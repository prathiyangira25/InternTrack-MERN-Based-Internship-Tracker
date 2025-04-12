
# InternTrack: Full Stack Web Application

InternTrack is a comprehensive web application for tracking and managing student internships. It enables students to submit their internship details with supporting documents while providing coordinators with tools to verify, track, and generate reports on internship data.

## 🚀 Features

### Student Features
- **User Authentication**: Secure login and registration
- **Internship Submission**: Submit internship details with proof documents
- **Document Upload**: Upload offer letters, permission letters, and completion certificates
- **Dashboard**: View submission status and internship statistics
- **Track Status**: Monitor verification status of submissions

### Coordinator Features
- **Dashboard**: View comprehensive statistics and recent submissions
- **Verification**: Verify student submissions with comments
- **Filtering**: Filter internships by various criteria (batch, company, type, etc.)
- **Reports**: Generate and export various reports (batch-wise, CDC/non-CDC, academic/industry, etc.)
- **Document Verification**: View and verify proof documents

### Technical Features
- **Form Validation**: Client-side and server-side validation
- **PDF Content Verification**: Verify if PDF contains student name and registration number
- **File Management**: Organize files in Google Drive with proper structure (year-wise and student-wise)
- **Responsive Design**: Works on desktop and mobile devices
- **NoSQL Injection Prevention**: Secure against MongoDB injection attacks

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- CSS3
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication

### External Services
- Google Drive API for file storage
- Tesseract.js for PDF text extraction

## 📋 Prerequisites
Before you begin, ensure you have the following:

- Node.js (v14 or higher) and npm installed
- MongoDB installed locally or MongoDB Atlas account
- Google Cloud Platform account with Google Drive API enabled
- Google Service Account credentials with Drive API access

## ⚙️ Setup and Installation

### 1. Clone the Repository
git clone https://github.com/prathiyangira25/InternTrack-MERN-Based-Internship-Tracker.git

cd InternTrack-MERN-Based-Internship-Tracker

It is recommended to create a new branch for your work to keep the main branch clean. You can create a new branch using the following command:

git checkout -b your-branch-name

Now, you can make changes and commit them to this branch. When you're done with your changes, you can push the branch to your forked repository and create a pull request.

git push origin your-branch-name

### 2. Environment Variables
Create a `.env` file in the `backend` directory and add the following:
```env
NODE_ENV=development
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/interntrack

# JWT Secret and Expiry
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

# Google Drive API
# Replace this with your actual Google Service Account credentials JSON
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}

# Google Drive root folder ID - REPLACE THIS WITH YOUR FOLDER ID
DRIVE_ROOT_FOLDER_ID=your_google_drive_folder_id

# Coordinator email (for access control)
COORDINATOR_EMAIL=youremail@ssn.edu.in
```
 **Important**: The `GOOGLE_CREDENTIALS` should be the entire JSON content of your service account credentials file. Replace `DRIVE_ROOT_FOLDER_ID` with the ID of the folder where you want to store internship files.

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Google Drive Setup
- Create a project in Google Cloud Console
- Enable the Google Drive API
- Create a service account with the necessary permissions
- Generate and download a JSON key file
- Create a folder in your Google Drive for storing internship files
- Share this folder with your service account's email
- Copy the folder ID and update your `.env` file

### 5. Run the Application
```bash
# Run backend (from the backend directory)
npm start

# Run frontend (from the frontend directory)
npm start
```
- Backend will run on: http://localhost:5000
- Frontend will run on: http://localhost:3000

## 🔍 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### File Routes
- `POST /api/files/upload/offerLetter` - Upload offer letter
- `POST /api/files/upload/permissionLetter` - Upload permission letter
- `POST /api/files/upload/completionCertificate` - Upload completion certificate

### Internship Routes
- `GET /api/internships` - Get all internships (filtered)
- `GET /api/internships/:id` - Get single internship
- `POST /api/internships` - Create internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship
- `PUT /api/internships/:id/verify` - Verify internship
- `GET /api/internships/stats/dashboard` - Get internship statistics

## 📁 Folder Structure Explanation

The application follows a specific folder structure to organize files on Google Drive:

```
InternTrack/
└── [Year]/
    └── details/
        └── [RegNo_StudentName]/
            ├── offerLetter_[RegNo].pdf
            ├── permissionLetter_[RegNo].pdf
            └── completionCertificate_[RegNo].pdf

```

For example:
```
InternTrack/
└── 2022/
    └── details/
        └── 1101_John_Doe/
            ├── offerLetter_1101.pdf
            ├── permissionLetter_1101.pdf
            └── completionCertificate_1101.pdf

```
## 🔒 Security Features

- **JWT Authentication**: Secure user authentication
- **Password Hashing**: Passwords are hashed using bcrypt
- **Role-Based Access Control**: Different access for students and coordinators
- **PDF Verification**: Ensures uploaded PDFs contain student information
- **Input Validation**: Client and server-side validation
## 🛡️ Error Handling

The application implements comprehensive error handling:
- Form validation errors with specific messages
- API response error messages
- File upload and processing errors
- Authentication and authorization errors

## 📱 Responsive Design

The application is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Customization

### Changing the Google Drive Folder

To use a different Google Drive folder:
1. Create a new folder in Google Drive
2. Share it with your Google Service Account
3. Copy the folder ID and update the `DRIVE_ROOT_FOLDER_ID` in your `.env` file

## 📱 Usage

### Student Workflow
1. Register/Login with your credentials
2. Submit internship details with required documents
3. View submitted internships and their verification status
4. Edit or delete pending internships if needed

### Coordinator Workflow
1. Login with coordinator credentials
2. View dashboard with internship statistics
3. Browse and filter internship submissions
4. Verify submissions by checking uploaded documents
5. Generate various reports based on filters

## 🔍 Known Issues and Fixes
If you're experiencing issues with toast notifications showing runtime errors, try these solutions:

### Update the ToastContainer configuration in `src/index.js`:
```javascript
<ToastContainer 
  position="bottom-right" 
  autoClose={3000} 
  hideProgressBar={false} 
  closeOnClick
  pauseOnHover
  draggable={false}
  limit={3}
/>
```

- Ensure all toast usage is consistent across the application
- Try reinstalling the react-toastify package:
```bash
npm uninstall react-toastify
npm install react-toastify@latest
```


## 📄 License
This project is licensed under the MIT License.

## 👥 Contributors
- [Prathiyangira Devi V C](https://github.com/prathiyangira25)
- [Padala Praneetha](https://github.com/PRANEETHAPADALA)
- [Oviasree S]


For any issues or questions, please open an issue on GitHub or contact the project maintainer.
