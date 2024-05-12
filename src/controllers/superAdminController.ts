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
    return res.status(200).json({
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
  try {
    const status = req.query.status as string | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    let query: any = {};

    // If statuses are provided, filter applications by those statuses
    if (status) {
      query.status = { $in: status };
    }

    // Implementation to fetch applications based on the query
    const applications = await Application.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    // Count total number of documents for pagination
    const totalApplications = await Application.countDocuments(query);

    // Calculate hasNext boolean for pagination
    const hasNext = totalApplications > skip + limit;

    return res.status(200).json({
      success: true,
      count: applications.length,
      hasNext,
      data: applications,
    });
  } catch (error) {
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
