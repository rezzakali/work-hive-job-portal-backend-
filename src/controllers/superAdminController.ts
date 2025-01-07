import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import Application from '../models/applicationModel';
import Job from '../models/jobModel';
import User from '../models/userModel';
import ErrorResponse from '../utils/error';

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchQuery = req.query.search as string | undefined;
    const role = req.query.role;
    const sortBy = req.query.sortBy as 'asc' | 'desc' | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    // Build the query
    const query: FilterQuery<any> = {
      $and: [
        // Use $and to combine multiple conditions
        searchQuery
          ? {
              $or: [
                { phone: { $regex: new RegExp(searchQuery as string, 'i') } },
                { email: { $regex: new RegExp(searchQuery as string, 'i') } },
              ],
            }
          : {},
        // Filter by role if provided
        role ? { role } : {},
      ],
    };

    let sortOptions: { [key: string]: 1 | -1 } = {};

    if (sortBy === 'asc') {
      sortOptions = { createdAt: 1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    // const fieldsToInclude = ['phone'];

    // Implementation to fetch all users
    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    // Count total number of documents for pagination
    const totalUsers = await User.countDocuments(query);
    // Calculate hasNext boolean for pagination
    const hasNext = totalUsers > skip + limit;

    const formattedUsers = users.map((user) => {
      const { password, ...usersWithoutPassword } = user;
      return usersWithoutPassword;
    });
    res.status(200).json({
      success: true,
      count: totalUsers,
      hasNext,
      data: formattedUsers,
    });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// get user
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return next(new ErrorResponse('User does not exists!', 404));
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// role change controller
export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return next(new ErrorResponse('User does not exists!', 404));
    }

    user.role = role;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: `User role updated to ${role}` });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// delete a user controller
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next(new ErrorResponse('userId is required!', 400));
    }
    await User.findByIdAndDelete({ _id: userId });

    return res
      .status(200)
      .json({ success: true, message: 'User deleted successfullly!' });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// delete a job permanently
export const deleteJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndDelete({ _id: jobId });
    res.status(200).json({ success: true, message: 'Job deleted!' });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// Get all applications with optional status filtering
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const limit = parseInt(req.query.limit as string, 10) || 10;
  //   const page = parseInt(req.query.page as string, 10) || 1;
  //   const status = req.query.status as
  //     | 'pending'
  //     | 'reviewed'
  //     | 'rejected'
  //     | 'accepted'
  //     | undefined;
  //   // const searchQuery = req.query.search as string | undefined;
  //   const sortField = req.query.sortField as string | 'appliedAt';
  //   const sortValue = req.query.sortValue as '1' | '-1' | undefined;

  //   // Calculate skip value for pagination
  //   const skip = (page - 1) * limit;

  //   let query: any = {};

  //   // If statuses are provided, filter applications by those statuses
  //   if (status) {
  //     query.status = { $in: Array.isArray(status) ? status : [status] };
  //   }

  //   // Count total number of documents for pagination
  //   const totalApplications = await Application.countDocuments(query);

  //   // Calculate hasNext boolean for pagination
  //   const hasNext = totalApplications > skip + limit;

  //   // Build sort options based on sortBy query parameter
  //   let sortOptions: { [key: string]: 1 | -1 } = {};

  //   if (sortField && (sortValue === '1' || sortValue === '-1')) {
  //     sortOptions[sortField] = parseInt(sortValue) as 1 | -1;
  //   }

  //   const applications = await Application.aggregate([
  //     { $match: query },
  //     {
  //       $lookup: {
  //         from: 'jobs',
  //         localField: 'jobId',
  //         foreignField: '_id',
  //         as: 'jobDetails',
  //       },
  //     },
  //     {
  //       $unwind: '$jobDetails',
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'userId',
  //         foreignField: '_id',
  //         as: 'userDetails',
  //       },
  //     },
  //     {
  //       $unwind: '$userDetails',
  //     },
  //     {
  //       $group: {
  //         _id: '$jobId',
  //         jobTitle: { $first: '$jobDetails.title' },
  //         company: { $first: '$jobDetails.company' },
  //         status: { $first: '$jobDetails.status' },
  //         applicants: {
  //           $push: {
  //             email: '$userDetails.email',
  //             phone: '$userDetails.phone',
  //             resume: '$resume.url',
  //             status: '$status',
  //           },
  //         },
  //         applicantsCount: { $sum: 1 },
  //       },
  //     },
  //     {
  //       $skip: skip,
  //     },
  //     {
  //       $limit: limit,
  //     },
  //     {
  //       $sort: sortOptions,
  //     },
  //   ]);

  //   res
  //     .status(200)
  //     .json({ success: true, hasNext, count: totalApplications, applications });
  // } catch (error) {
  //   console.error('Error fetching applications:', error);
  //   return next(new ErrorResponse(error?.message, 500));
  // }
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const status = req.query.status as
      | 'pending'
      | 'reviewed'
      | 'rejected'
      | 'accepted'
      | undefined;
    // const searchQuery = req.query.search as string | undefined;
    const sortField = req.query.sortField as string | 'appliedAt';
    const sortValue = req.query.sortValue as '1' | '-1' | undefined;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    let query: any = {};

    // If statuses are provided, filter applications by those statuses
    if (status) {
      query.status = { $in: Array.isArray(status) ? status : [status] };
    }

    // Count total number of documents for pagination
    const totalApplications = await Application.countDocuments(query);

    // Calculate hasNext boolean for pagination
    const hasNext = totalApplications > skip + limit;

    // Build sort options based on sortBy query parameter
    let sortOptions: { [key: string]: 1 | -1 } = {};

    if (sortField && (sortValue === '1' || sortValue === '-1')) {
      sortOptions[sortField] = parseInt(sortValue) as 1 | -1;
    }

    const applications = await Application.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      {
        $unwind: '$jobDetails',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $group: {
          _id: '$jobId',
          jobTitle: { $first: '$jobDetails.title' },
          company: { $first: '$jobDetails.company' },
          status: { $first: '$jobDetails.status' },
          applicants: {
            $push: {
              email: '$userDetails.email',
              phone: '$userDetails.phone',
              resume: '$resume.url',
              status: '$status',
            },
          },
          applicantsCount: { $sum: 1 },
        },
      },
      {
        $sort: sortOptions,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    res.status(200).json({
      success: true,
      applications,
      totalApplications,
      hasNext,
      currentPage: page,
      totalPages: Math.ceil(totalApplications / limit),
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return next(new ErrorResponse(error?.message, 500));
  }
};

// Update application status
export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, applicationId } = req.body;

    if (!applicationId) {
      return next(new ErrorResponse('Application id is required!', 400));
    }
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return next(new ErrorResponse('Application does not exists!', 404));
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Applications status updated to ${status}`,
    });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// delete an application permanently
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicationId } = req.params;
    if (!applicationId) {
      return next(new ErrorResponse('Applicaton id is required!', 400));
    }
    await Application.findByIdAndDelete({ _id: applicationId });
    res.status(200).json({ success: true, message: 'Application deleted!' });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// change job's status
export const ChangeJobStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId, status } = req.body;

    if (!jobId) {
      return next(new ErrorResponse('jobId is required!', 400));
    }
    // Find the job by ID
    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Update the job status
    job.status = status;
    await job.save();

    res
      .status(200)
      .json({ success: true, message: 'Job status changed successfully' });
  } catch (error) {
    return next(new ErrorResponse(error?.message, 500));
  }
};

// for dashboard

export const getDashboardSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalJobs,
      totalUsers,
      totalCompanies,
      totalApplicants,
      openJobs,
      closedJobs,
      pendingApplications,
      reviewedApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      Job.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: 'employer' }),
      Application.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Job.countDocuments({ status: 'closed' }),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'reviewed' }),
      Application.countDocuments({ status: 'accepted' }),
      Application.countDocuments({ status: 'rejected' }),
    ]);

    // Format the data for the dashboard
    const formattedData = [
      {
        title: 'Total Jobs',
        count: totalJobs,
      },
      {
        title: 'Open Jobs',
        count: openJobs,
      },
      {
        title: 'Closed Jobs',
        count: closedJobs,
      },
      {
        title: 'Total Users',
        count: totalUsers,
      },
      {
        title: 'Companies/Employers',
        count: totalCompanies,
      },
      {
        title: 'Total Applicants',
        count: totalApplicants,
      },
      {
        title: 'Pending Applications',
        count: pendingApplications,
      },
      {
        title: 'Reviewed Applications',
        count: reviewedApplications,
      },
      {
        title: 'Accepted Applications',
        count: acceptedApplications,
      },
      {
        title: 'Rejected Applications',
        count: rejectedApplications,
      },
    ];

    // Send the formatted data in the response
    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return next(new ErrorResponse('Failed to fetch dashboard summary', 500));
  }
};

export const getDashboardRecentJobsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title company createdAt status')
      .lean();

    return res.status(200).json({
      status: true,
      data: jobs,
    });
  } catch (error) {
    return next(
      new ErrorResponse('Failed to fetch dashboard recent jobs', 500)
    );
  }
};

export const getDashboardRecentApplicationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applications = await Application.find({})
      .sort({ appliedAt: -1 })
      .populate({
        path: 'userId',
        select: 'email -_id',
      })
      .populate({
        path: 'jobId',
        select: 'title -_id',
      })
      .limit(5)
      .select('-resume')
      .lean();

    return res.status(200).json({
      status: true,
      data: applications,
    });
  } catch (error) {
    return next(
      new ErrorResponse('Failed to fetch dashboard recent applications', 500)
    );
  }
};

export const getTopCompaniesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the limit for the number of top companies to fetch
    // const limit = parseInt(req.query.limit as string, 10) || 10;

    // Aggregate the data to get the top companies based on job count
    const topCompanies = await Job.aggregate([
      {
        $group: {
          _id: '$company', // Group by company
          jobs: { $sum: 1 }, // Count the number of jobs per company
        },
      },
      {
        $sort: { jobs: -1 }, // Sort by job count in descending order
      },
      {
        $limit: 5, // Limit the number of companies returned
      },
    ]);

    // Return the top companies
    return res.status(200).json({
      success: true,
      data: topCompanies,
    });
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return next(new ErrorResponse('Failed to fetch top companies', 500));
  }
};

export const getTasksNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch pending applications
    const pendingApplications = await Application.find({ status: 'pending' })
      .populate({ path: 'jobId', select: 'title -_id' })
      .select('createdAt');

    // Build the response data
    // const tasksNotifications = {
    //   pendingApplications,
    // };

    // Return the tasks/notifications
    return res.status(200).json({
      success: true,
      data: pendingApplications,
    });
  } catch (error) {
    console.error('Error fetching tasks/notifications:', error);
    return next(new ErrorResponse('Failed to fetch tasks/notifications', 500));
  }
};

export const getApplicationsByStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: applicationsByStatus,
    });
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    return next(
      new ErrorResponse('Failed to fetch applications by status', 500)
    );
  }
};
