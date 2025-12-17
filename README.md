# File Share Application

A secure and efficient file sharing application featuring drag-and-drop uploads, user authentication, and capability to share files with specific users or via public links with expiration.

## Prerequisites

- **Node.js** (v14+ recommended)
- **MongoDB** (Local or Atlas URL)
- **AWS Account** (S3 Bucket for file storage)

## Getting Started

### 1. Backend Setup

The backend handles API requests, authentication, and file operations.

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/fileshare  # Or your MongoDB Atlas URI
    JWT_SECRET=your_super_secret_jwt_key

    # AWS S3 Configuration
    AWS_REGION=your_aws_region (e.g., us-east-1)
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    AWS_BUCKET_NAME=your_s3_bucket_name

    # Frontend URL for generating links
    FRONTEND_URL=http://localhost:5173
    ```

4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server should start on `http://localhost:5000`.

### 2. Frontend Setup

The frontend is a React application built with Vite.

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the `frontend` directory:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## Features

- **User Authentication**: Secure Login and Registration.
- **File Upload**: Drag-and-drop interface, uploads directly to AWS S3.
- **Share with Users**: Select users from a list to share files with.
  - **Expiration**: Set an expiration date/time for user access.
- **Public Links**: Generate shareable links for external users.
  - **Expiration**: Set a duration (e.g., 24 hours) for the link validity.
- **Dashboard**: View your files and files shared with you.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, Axios
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), AWS S3 SDK
