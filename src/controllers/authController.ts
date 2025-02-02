import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config';
import { HTTPSTATUS } from '../config/http.config';
import User from '../models/userModel';
import ErrorResponse from '../utils/error';
import uploadToImageKit from '../utils/imageUploadToImageKit';

// signup controller
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    // check if user already exists in the database
    const user = await User.findOne({ email });

    if (user) {
      return next(new ErrorResponse('User already exists!', 403));
    }

    //   hashed password
    const hashedPassword = bcrypt.hashSync(password, Number(config.SALT_ROUND));

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // finally save to database
    await newUser.save();

    // send response
    res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message:
        'Thank you for registering! Your account has been successfully created.',
    });

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        error?.message || 'Internal Server Error',
        HTTPSTATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// signin controller
export const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // destructure email and password from request body
    const { email, password } = req.body;

    // check user with the email
    const user = await User.findOne({ email });
    // if no user
    if (!user) {
      return next(
        new ErrorResponse('Invalid credentials!', HTTPSTATUS.NOT_FOUND)
      );
    }

    // compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // if the password is invalid
    if (!isValidPassword) {
      return next(
        new ErrorResponse('Invalid credentials!', HTTPSTATUS.BAD_REQUEST)
      );
    }
    // generate a jwt token
    const token = jwt.sign({ _id: user._id }, config.JWT.SECRET, {
      expiresIn: config.JWT.EXPIRES_IN, // 30 days
    });

    const COOKIE_EXPIRATION =
      parseInt(config.COOKIE_EXPIRATION || '30', 10) * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    // Set the token as a cookie
    res.cookie('jwt', token, {
      httpOnly: config.NODE_ENV === 'production' ? true : false, // Makes the cookie inaccessible to JavaScript on the client side
      secure: config.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: config.NODE_ENV === 'production' ? 'strict' : 'none', // Prevents cross-site request forgery (CSRF)
      maxAge: COOKIE_EXPIRATION, // Cookie expiry in milliseconds (30d)
    });

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'Login Successful: Welcome back to your account.',
      data: token,
    });
    next();
  } catch (error) {
    return next(
      new ErrorResponse(error?.message, HTTPSTATUS.INTERNAL_SERVER_ERROR)
    );
  }
};

// logout controller
// Logout Controller
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the authentication token or session cookie
    res.clearCookie('client.sid', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production', // Only in HTTPS for production
      sameSite: 'strict',
    });

    // Respond with a success message
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: 'Logged out successfully!' });
  } catch (error) {
    // Handle any potential errors
    return next(
      new ErrorResponse(
        'Error logging out. Please try again.',
        HTTPSTATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Password-change
export const passwordChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    // check user with the email
    const user = await User.findOne({ email });

    // if no user
    if (!user) {
      return next(
        new ErrorResponse('Invalid credentials', HTTPSTATUS.NOT_FOUND)
      );
    }
    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return next(
        new ErrorResponse('Incorrect old password', HTTPSTATUS.UNAUTHORIZED)
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.SALT_ROUND)
    );

    // udpate the password
    user.password = hashedPassword;
    await user.save();

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    return next(
      new ErrorResponse(error?.message, HTTPSTATUS.INTERNAL_SERVER_ERROR)
    );
  }
};

// Add Address
export const addAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, address } = req.body;
    const user = await User.findOne({ email });
    // if no user
    if (!user) {
      return next(
        new ErrorResponse('Invalid credentials!', HTTPSTATUS.NOT_FOUND)
      );
    }
    user.address = address;
    await user.save();

    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'Address updated',
    });
    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        error?.message || 'Internal server error!',
        HTTPSTATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Add Resume
export const addResumeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(
        new ErrorResponse('Email is required', HTTPSTATUS.BAD_REQUEST)
      );
    }
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse('Invalid credentials', HTTPSTATUS.NOT_FOUND)
      );
    }
    // upload image to imageKit platform
    const folderPath = 'users-resume';
    const imageUploadResponse = await uploadToImageKit(req.file, folderPath);

    user.resume.url = imageUploadResponse?.url;
    user.resume.fileId = imageUploadResponse?.fileId;
    await user.save();
    res.status(200).json({ success: true, message: 'Resume added' });
  } catch (error) {
    return next(
      new ErrorResponse(error?.message, HTTPSTATUS.INTERNAL_SERVER_ERROR)
    );
  }
};

// get profile
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return next(new ErrorResponse('Id is required', HTTPSTATUS.BAD_REQUEST));
    }
    const user = await User.findById(_id);

    if (!user) {
      return next(
        new ErrorResponse('Invalid credentials', HTTPSTATUS.NOT_FOUND)
      );
    }

    const { password, ...rest } = user.toObject();
    res.status(200).json({ success: true, data: rest });
  } catch (error) {
    return next(
      new ErrorResponse(error?.message, HTTPSTATUS.INTERNAL_SERVER_ERROR)
    );
  }
};
