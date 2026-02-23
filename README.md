# CarePulse - Medical Appointment Management System

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas (Connection string in .env)

## Setup

1.  **Clone the repository**.
2.  **Install Dependencies**:

    ```bash
    # Backend
    cd server
    npm install

    # Frontend
    cd ../client
    npm install
    ```

3.  **Environment Variables**:
    - Ensure `server/.env` exists with the following content:
        ```
        PORT=5000
        MONGO_URI=mongodb+srv://... (Your Atlas URI)
        JWT_SECRET=your_secret_key_here
        ```

## Running the Application

1.  **Start the Backend Server**:
    ```bash
    cd server
    node index.js
    ```
    Server runs on `http://localhost:5000`.

2.  **Start the Frontend Client**:
    ```bash
    cd client
    npm run dev
    ```
    Client runs on `http://localhost:5173`.

## Features
- **Patient**: Register, Login, Book Appointment with Specialists, View History.
- **Doctor**: Register with Specialty, Login, View Schedule, Real-time Clinical Hub.
- **System**: Real-time Clock, Professional Minimal UI, Secure Auth.
