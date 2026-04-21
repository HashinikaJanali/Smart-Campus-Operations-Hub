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

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   *(The frontend application will start and open automatically, typically on port `3000`)*
