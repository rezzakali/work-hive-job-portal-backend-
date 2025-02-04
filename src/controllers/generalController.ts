import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import Contact from '../models/contact';
import Notification from '../models/notificationModel';
import ErrorResponse from '../utils/error';

// contact controller
export const contactController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { subject, email, description } = req.body;

    const newContact = new Contact(req.body);

    // save to database
    await newContact.save();

    // Send Email Notification
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: process.env.ADMIN_EMAIL, // Your personal email
    //   subject: `New Contact Form Submission: ${subject}`,
    //   text: `You received a new message from ${email}.\n\nDescription:\n${description}`,
    // };

    // await transporter.sendMail(mailOptions);

    // return the response
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: 'Message sent successfully', data: newContact });
  } catch (error) {
    return next(
      new ErrorResponse(error?.message, HTTPSTATUS.INTERNAL_SERVER_ERROR)
    );
  }
};

// get unread notifications
export const getUnreadNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      isReadBy: { $ne: req.user._id }, // Fetch only unread notifications
    })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(Number(limit))
      .lean();
    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: notifications || [] });
    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        error?.message || 'There was a server side error!',
        HTTPSTATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// get unread notifications
export const markNotificationRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: true,
        message: 'Notification Id is required!',
      });
    }

    await Notification.updateOne(
      { _id: notificationId },
      { $addToSet: { isReadBy: req.user._id } }
    );

    res
      .status(200)
      .json({ success: true, message: 'Notification marked as read' });
    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        error?.message || 'There was a server side error!',
        HTTPSTATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};
