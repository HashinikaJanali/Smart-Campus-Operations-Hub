# Smart Campus Operations Hub

A modern, unified platform designed to streamline campus operations and enhance the experience for students, lecturers, and staff. Manage resource bookings, track maintenance tickets, monitor real-time analytics, and control campus operations—all in one integrated system.

## 🧩 Core Features

- 🏢 **Facilities & Assets Catalogue**: A maintainable catalog of bookable resources (lecture halls, labs, equipment) with search, filtering, and availability status tracking.
- 📅 **Booking Management**: System for users to request bookings (with timeline conflict checking) and for admins to approve/reject/cancel requests.
- ⚙️**Maintenance & Incident Ticketing**: Workflow for users to report faults and attach evidence images. Technicians can be assigned to update ticket statuses (Open -> In Progress -> Resolved), complete with comment ownership rules.
- 🔔**Notifications**: Alerting system to inform users of booking approval/rejection updates and ticket status changes.
- 🔐 **Authentication & Authorization**: Secure application with OAuth 2.0 login integration and role-based access control (User, Admin, etc.) to secure frontend routes and REST endpoints.

## 🏗️ Architecture

The project follows a **client-server architecture** with clear separation of concerns:

```
Smart-Campus-Operations-Hub/
├── Backend/                    # Spring Boot Java backend
│   ├── src/main/java/Backend/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/            # Business logic layer
│   │   ├── repository/         # Database access layer
│   │   ├── model/              # MongoDB document models
│   │   ├── security/           # OAuth2 and security configs
│   │   └── config/             # Application configurations
│   ├── pom.xml                 # Maven dependencies
│   └── mvnw                    # Maven wrapper
├── frontend/                   # React + Tailwind CSS frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API service calls
│   │   ├── contexts/           # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   └── assets/             # Images and static files
│   ├── package.json            # NPM dependencies
│   └── tailwind.config.js      # Tailwind CSS configuration
└── README.md                   # This file
```

## 🔧 Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MongoDB (NoSQL)
- **Authentication**: OAuth2 with Google
- **API**: RESTful API with Spring MVC
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.x
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **Build Tool**: Create React App (Webpack)


## 🚀 Getting Started

### Prerequisites
- **Java 17+** installed
- **Node.js 16+** and npm installed
- **MongoDB** running locally or in the cloud
- **Google OAuth2 credentials** (for authentication)

### Backend Setup (Spring Boot)

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `Backend` directory (use `.env.example` as a template):
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-hub
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
   ```

3. **Build and run**
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8085`

### Frontend Setup (React)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies**
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The frontend will open at `http://localhost:3000`


## 🔐 Security Features

- **OAuth2 Authentication**: Secure Google login integration
- **CORS Protection**: Whitelist frontend origin
- **CSRF Protection**: Token-based CSRF defense
- **Role-Based Access Control (RBAC)**: Endpoint authorization by user role
- **Password Security**: Encrypted password storage
- **Session Management**: Secure session handling with HTTP-only cookies


## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`

### Frontend Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### CORS Errors
- Verify frontend URL is whitelisted in `SecurityConfig.java`
- Ensure backend is running on port 8085

### Google OAuth Issues
- Verify credentials in `.env`
- Check callback URL matches in Google Console
- Ensure redirect URI is set to `http://localhost:8085/login/oauth2/code/google`
