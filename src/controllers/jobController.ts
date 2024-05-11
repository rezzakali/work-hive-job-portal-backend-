import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import nodemailer from 'nodemailer';
import Application from '../models/applicationModel';
import Job from '../models/jobModel';
import User from '../models/userModel';
import ErrorResponse from '../utils/error';
import uploadToImageKit from '../utils/imageUploadToImageKit';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL, // Your Gmail address
    pass: process.env.MY_PASSWORD, // Your Gmail password (Use App Password for better security)
  },
});

// GET JOBS
export const getJobsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract search query, sort direction, limit, and page number from request query parameters
    const searchQuery = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as 'asc' | 'desc' | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;

    const { salaryRange } = req.query;

    // Initialize salary range variables
    let minSalary;
    let maxSalary;

    // Extract and split the salary range
    if (typeof salaryRange === 'string') {
      const [min, max] = salaryRange.split('-');
      minSalary = parseInt(min, 10);
      maxSalary = parseInt(max, 10);
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    // Build the query
    const query: FilterQuery<any> = {
      $and: [
        // Use $and to combine multiple conditions
        searchQuery
          ? {
              $or: [
                { title: { $regex: new RegExp(searchQuery as string, 'i') } },
                { company: { $regex: new RegExp(searchQuery as string, 'i') } },
                {
                  location: { $regex: new RegExp(searchQuery as string, 'i') },
                },
              ],
            }
          : {},
        minSalary && maxSalary
          ? {
              salary: {
                $gte: minSalary,
                $lte: maxSalary,
              },
            }
          : {},
      ],
    };

    // Build sort options based on sortBy query parameter
    let sortOptions: { [key: string]: 1 | -1 } = {};

    if (sortBy === 'asc') {
      sortOptions = { createdAt: 1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    // Specify the fields to include in the response
    const fieldsToInclude = [
      'title',
      'company',
      'location',
      'salary',
      'createdAt',
    ];

    // Fetch jobs from the database with search, sort, limit, and pagination options
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select(fieldsToInclude)
      .lean();

    // Count total number of documents for pagination
    const totalJobs = await Job.countDocuments(query);

    // Calculate hasNext boolean for pagination
    const hasNext = totalJobs > skip + limit;

    res.status(200).json({
      success: true,
      count: jobs.length,
      hasNext,
      data: jobs,
      //   pagination: {
      //     totalJobs,
      //     totalPages: Math.ceil(totalJobs / limit),
      //     currentPage: page,
      //   },
    });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// GET A JOB
export const getJobsDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorResponse('Id is required to see job details', 400));
    }
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorResponse('Job does not exists', 404));
    }
    res.status(200).json({ success: true, data: job });
    next();
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// POST A JOB
export const postAJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Create a new job document
    const job = new Job(req.body);

    // Set createdBy field to the user's ID
    job.createdBy = req.user._id;

    // Save the job document
    await job.save();

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// UPDATE A JOB
export const updateJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId, data } = req.body;
    const updatedJob = await Job.findByIdAndUpdate({ _id: jobId }, data, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedJob });
    next();
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// APPLY JOB
export const applyJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id;
    const jobId = req.body.jobId;

    // Check if the user has already applied to the job
    const existingApplication = await Application.findOne({ userId, jobId });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    let resumePath: { url?: string; fileId?: string };

    if (user.resume.fileId && user.resume.fileId !== '') {
      resumePath = user.resume;
    } else {
      const folderPath = 'users-resume';
      const imageUploadResponse = await uploadToImageKit(req.file, folderPath);

      if (!imageUploadResponse?.url || !imageUploadResponse?.fileId) {
        return res
          .status(500)
          .json({ success: false, message: 'Failed to apply on this job' });
      }

      user.resume.url = imageUploadResponse.url;
      user.resume.fileId = imageUploadResponse.fileId;
      await user.save();
      resumePath = user.resume;
    }

    // Create a new application
    const newApplication = new Application({
      jobId,
      userId,
      resume: resumePath,
    });

    // Save the application to the database
    await newApplication.save();

    // Send email to the user
    const mailOptions = {
      from: process.env.MY_EMAIL, // Your Gmail address
      to: user.email, // User's email address
      subject: 'Application Confirmation',
      html: `
        <p>Dear Applicant,</p>
        <p>We are pleased to inform you that your application for the position of ${job.title} at ${job.company} has been successfully received and is currently under review.</p>
        <p><strong>Application Details:</strong></p>
        <ul>
          <li><strong>Job Title:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Location:</strong> ${job.location}</li>
          <li><strong>Salary:</strong> ${job.salary}/month</li>
          <li><strong>Employment Type:</strong> ${job.employmentType}</li>
          <li><strong>Experience Level:</strong> ${job.experienceLevel}</li>
        </ul>
        <p><strong>Next Steps:</strong></p>
        <p>Our recruitment team is currently reviewing applications, and we will contact you directly if your qualifications match our requirements and you are selected for an interview.</p>
        <p>We appreciate your interest in joining our team at <strong>${job.company}</strong>.
        <p>Thank you once again for applying with us. We wish you the best of luck in your job search!</p>
        <p>Warm regards,</p>
        <p>${job.company}<br>${job.location}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: 'Successfully applied!' });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// CLOSE A JOB
export const closeJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    if (!jobId) {
      return next(new ErrorResponse('jobId is required!', 400));
    }
    // Find the job by ID and check if the authenticated user is the creator
    const job = await Job.findOne({ _id: jobId, createdBy: userId });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Update the job status to 'closed'
    job.status = 'closed';
    await job.save();

    res.status(200).json({ success: true, message: 'Job closed successfully' });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// ################# GET EMPLOYERS JOBS
export const getEmployerJobsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next(new ErrorResponse('userId is required!', 400));
    }
    // Fetch all job listings created by the specific employer
    const jobs = await Job.find({ createdBy: userId });
    if (!jobs || jobs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No jobs found for this employer!' });
    }

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// ######## FIND OUT APPLICANTS ################
export const getApplicantsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find all applications for the job and populate the userId field to get the applicant's details
    const applications = await Application.find({
      jobId: req.params.jobId,
    });

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No applicants found for this job' });
    }

    // Extract applicant details with email ,phone and resume
    const applicants = [];

    for (const application of applications) {
      const user = await User.findById(application.userId);

      if (user) {
        const { email, phone, resume } = user;
        applicants.push({ email, phone, resume });
      }
    }

    res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// ############ UPDATE APPLICANT STATUS ###############
export const updateApplicantStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId, userId, status } = req.body;
    // Validate employer's access to the job
    const job = await Job.findById(jobId);

    if (!job || job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Unauthorized access' });
    }

    // Find the application
    const application = await Application.findOne({ jobId, userId });

    // Find the user
    // const user = await User.findOne({ _id: userId });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found' });
    }

    // Update applicant status
    application.status = status;
    await application.save();

    // Sending email after update the status

    //   const mailOptions = {
    //     from: process.env.MY_EMAIL, // Your Gmail address
    //     to: user.email, // User's email address
    //     subject: 'Application Status Updated',
    //     html: `
    //         <p>Your application status has been updated to: <strong>${status}</strong></p>
    //         <p>If you have any questions, please contact us.</p>
    //         <p>Thank you for applying!</p>
    //       `,
    //   };

    // await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Applicant status updated successfully',
    });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};
