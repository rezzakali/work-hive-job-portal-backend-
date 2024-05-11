# Job Portal API Documentation

## Overview

This README file provides detailed documentation for the Job Portal API. This API is built using Node.js, Express, and MongoDB, and it serves as the backend for a job portal application.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Permissions](#permissions)
7. [Error Handling](#error-handling)
8. [Utilities](#utilities)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [Contact](#contact)

---

## Features

- User registration and authentication
- Job posting and management
- Job application submission
- Role-based access control (Admin, Employer, Job Seeker)
- Email notifications
- Pagination and filtering
- Error handling and validation

---

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication
- Nodemailer for email sending
- Express-validator for input validation

---

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running
- SMTP server (e.g., Gmail) for sending emails

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rezzakali/job-portal-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd job-portal-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SMTP_EMAIL=your_smtp_email
   SMTP_PASSWORD=your_smtp_password
   ```

5. Start the server:
   ```bash
   npm start
   ```

---

## API Endpoints

- `/api/users`
- `/api/jobs`
- `/api/applications`

## Authentication

- **JWT-based authentication**
- Register, login, and logout functionalities
- Session-based authentication with a 30-day validity

---

## Permissions

### Permissions for Super Admin:

#### Users

1. get all users
2. get a single user
3. update user role
4. permanently delete a user

#### JOBS

- View All Jobs
- Manage Jobs
- View Applications
- Manage Applications
- Manage Employer Profiles
- Manage System Settings

### Permissions for Employer:

- Manage Jobs
- View Applications

### Permissions for Job Seeker:

- Apply for Jobs
- View Jobs

---

## Error Handling

- Custom error classes and middleware for error handling
- Detailed error messages and status codes

---

## Utilities

- Email utility for sending emails
- Validation utility using Express-validator

---

## Testing

- Unit tests
- Integration tests
- Test coverage reports

---

## Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues.

---

## Contact

For any questions, concerns, or suggestions, please contact [your-email@example.com](mailto:your-email@example.com).

---

Thank you for using the Job Portal API!
