# Smart Campus Operations Hub

A modern, unified platform designed to streamline campus operations and enhance the experience for students, lecturers, and staff. Manage resource bookings, track maintenance tickets, monitor real-time analytics, and control campus operations—all in one integrated system.

## 🎯 Overview

**Smart Campus Operations Hub** (UniOps) is a comprehensive web-based platform that centralizes campus management by providing:

- **Smart Resource Booking**: Reserve lecture halls, labs, and equipment with real-time availability
- **Integrated Ticket System**: Report and track maintenance issues and facility problems
- **Analytics Dashboard**: Monitor campus operations with real-time insights and metrics
- **User Management**: Control access and assign roles across the campus
- **Real-Time Notifications**: Stay updated on booking approvals and ticket status changes
- **Multi-Role Support**: Tailored experiences for Students, Lecturers, Technicians, and Admins

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

### Backend Setup

1. **Navigate to Backend directory**
# 🏫 Smart-Campus-Operations-Hub

UniOps is a full-stack web application designed for a university to modernize its day-to-day operations. The platform manages facility and asset bookings, maintenance ticketing, and features role-based workflows for seamless campus administration.

---

## 🧩 Core Features & Modules

- 🏢 **Facilities & Assets Catalogue**: A maintainable catalog of bookable resources (lecture halls, labs, equipment) with search, filtering, and availability status tracking.
- 📅 **Booking Management**: System for users to request bookings (with timeline conflict checking) and for admins to approve/reject/cancel requests.
- ⚙️**Maintenance & Incident Ticketing**: Workflow for users to report faults and attach evidence images. Technicians can be assigned to update ticket statuses (Open -> In Progress -> Resolved), complete with comment ownership rules.
- 🔔**Notifications**: Alerting system to inform users of booking approval/rejection updates and ticket status changes.
- 🔐 **Authentication & Authorization**: Secure application with OAuth 2.0 login integration and role-based access control (User, Admin, etc.) to secure frontend routes and REST endpoints.

---

## 🛠️Technologies & Tools

### Backend
- **Java 17+**
- **Spring Boot** (RESTful API, layered architecture, validation, error handling)
- **MongoDB** (Data persistence)

### Frontend
- **React.js** (Client Web Application UI)
- **Node.js & npm** (Package management)

---

## 🚀Setup Instructions

### Prerequisites

- **Java 17** (or higher)
- **Node.js** and **npm**
- **MongoDB** (Ensure MongoDB is running locally or configure the connection string in the backend)

### Backend Setup (Spring Boot)

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. **Configure application.properties**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.application.name=Backend
   spring.data.mongodb.uri=mongodb://localhost:27017/campus-hub
   # Add your Google OAuth2 credentials:
   spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
   ```

3. **Build and run**
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8085`

### Frontend Setup

1. **Navigate to frontend directory**
2. Run the Spring Boot application using the provided Maven wrapper:
   ```bash
   # On Windows
   mvnw.cmd spring-boot:run
   
   # On Mac/Linux
   ./mvnw spring-boot:run
   ```
   *(The backend server will start on port `8085`)*

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

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/current-user` - Get current user info

### Resources (Bookings)
- `GET /api/resources` - Get all resources
- `GET /api/resources/{id}` - Get resource details
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `PATCH /api/bookings/{id}` - Update booking status

### Tickets (Maintenance)
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{id}` - Get ticket details
- `PATCH /api/tickets/{id}` - Update ticket status
- `POST /api/tickets/{id}/comments` - Add comment

### Users (Admin)
- `GET /api/users` - Get all users
- `PATCH /api/users/{id}/role` - Update user role
- `DELETE /api/users/{id}` - Delete user

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/test` - Send test notification

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/bookings` - Booking statistics
- `GET /api/analytics/tickets` - Ticket statistics

## 👥 User Roles

### Student
- View available resources
- Book resources (labs, halls, equipment)
- Submit maintenance tickets
- View their bookings and ticket status
- Comment on tickets

### Lecturer
- Same as Student
- Create and manage course schedules
- Bulk resource reservations

### Technician
- View all open tickets
- Update ticket status
- Add resolution notes
- Assign tickets

### Admin
- Full system access
- User management (create, edit, delete)
- Role assignments
- System configuration
- Analytics and reporting

## 🔐 Security Features

- **OAuth2 Authentication**: Secure Google login integration
- **CORS Protection**: Whitelist frontend origin
- **CSRF Protection**: Token-based CSRF defense
- **Role-Based Access Control (RBAC)**: Endpoint authorization by user role
- **Password Security**: Encrypted password storage
- **Session Management**: Secure session handling with HTTP-only cookies

## 📊 Key Features

### Resource Booking System
- Real-time availability checking
- Instant booking confirmation
- QR code generation for check-in
- Booking history and management

### Ticket Management
- Multi-priority level support (Low, Medium, High, Critical)
- Category-based organization
- Image evidence attachment
- Comment threads for collaboration
- Automatic notification to assigned technician

### Analytics Dashboard
- Real-time resource utilization metrics
- Booking trends and patterns
- Ticket status overview
- User activity tracking
- Custom date range filtering

### Notifications
- Real-time push notifications
- Email notifications (configurable)
- Notification preferences management
- In-app notification panel

## 🛠️ Development Workflow

### Running Both Services Simultaneously

**Terminal 1 - Backend:**
```bash
cd Backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Build for Production

**Backend:**
```bash
cd Backend
./mvnw clean package
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting
```

## 📝 Project Structure Details

### Backend Services
- **UserService**: User management and role handling
- **ResourceService**: Resource availability and booking logic
- **BookingService**: Booking creation and status management
- **TicketService**: Ticket lifecycle management
- **NotificationService**: Real-time notification delivery
- **AnalyticsService**: Dashboard metrics calculation

### Frontend Components
- **Pages**: HomePage, LoginPage, AdminDashboardPage, TicketingPage, etc.
- **Components**: Reusable UI widgets (buttons, cards, modals)
- **Services**: API service layer (authService, bookingService, etc.)
- **Contexts**: NotificationContext for global state

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `application.properties`

### Frontend Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### CORS Errors
- Verify frontend URL is whitelisted in `SecurityConfig.java`
- Ensure backend is running on port 8085

### Google OAuth Issues
- Verify credentials in `application.properties`
- Check callback URL matches in Google Console
- Ensure redirect URI is set to `http://localhost:8085/login/oauth2/code/google`

## 📦 Dependencies

Key dependencies are managed via:
- **Backend**: `pom.xml` (Maven)
- **Frontend**: `package.json` (npm)

Run these commands to update dependencies:
```bash
# Backend
cd Backend && ./mvnw clean install

# Frontend
cd frontend && npm install
```

## 📄 License

This project is part of the Smart Campus Operations Hub initiative. All rights reserved.

## 👨‍💻 Contributing

Contributions are welcome! Please:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support & Contact

For issues, bug reports, or feature requests, please create an issue in the repository.

---

**Last Updated**: April 23, 2026  
**Status**: Active Development
3. Start the React development server:
   ```bash
   npm start
   ```
   *(The frontend application will start and open automatically, typically on port `3000`)*
