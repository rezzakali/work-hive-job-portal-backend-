import { NextFunction, Request, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import Contact from '../models/contact';
import ErrorResponse from '../utils/error';

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
