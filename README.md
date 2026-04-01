# CHA Student Portal

Welcome to the Cloud Heroes Africa (CHA) Student Portal. This application is an integrated platform built with **Next.js 15 (App Router)** and **Payload CMS 3.0**.

## Project Overview

The project consolidates the student portal frontend and the administrative backend into a single Next.js application, sharing a unified database and authentication system.

- **Frontend**: A custom student experience built with Next.js and Tailwind CSS.
- **Backend/CMS**: Powered by Payload CMS 3.0 for managing courses, users, and site settings.

---

## 🌐 Accessing the Application on EC2

When the application is deployed to an AWS EC2 instance, you can access the various parts of the portal using the following URLs:

### 1. Frontend (Student Portal)
- **URL**: `http://<EC2_PUBLIC_IP_OR_DOMAIN>/`
- **Description**: The main entry point for students to view courses and access their learning materials.

### 2. Admin Dashboard (Payload CMS)
- **URL**: `http://<EC2_PUBLIC_IP_OR_DOMAIN>/admin`
- **Description**: The administrative interface used by staff and instructors to manage content, media, and users.
- **Login**: Use the administrator credentials created during the initial setup.

---

## 🛠 Quick Start - Local Setup

To run the project locally for development, follow these steps:

### 1. Environment Configuration
Copy the example environment file and fill in the required variables (Database URL, Payload Secret, etc.):
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

---

## 🚀 Deployment & Maintenance (EC2)

The application is typically deployed on EC2 using **PM2** as a process manager and **Nginx** as a reverse proxy.

### Project Directory
The project is located at: `~/cha-student-portal`

### Common Commands on EC2

#### 1. Initial Launch / Start Application
Register the application with PM2 for the first time:
```bash
# Navigate to the project
cd ~/cha-student-portal

# Start the process with required IPv4 forcing
pm2 start pnpm --name "cha-student-portal" --node-args="--dns-result-order=ipv4first" -- start

# Save the process list to restart on reboot
pm2 save
```

#### 2. General Maintenance
- **Restart**: `pm2 restart cha-student-portal`
- **View Logs**: `pm2 logs cha-student-portal`
- **Update Application**:
  ```bash
  git pull origin main
  pnpm install
  pnpm build
  pm2 restart cha-student-portal
  ```

---

## 📂 Project Structure

- `src/app/(frontend)`: Handles all public-facing portal routes.
- `src/app/(payload)`: Contains the Payload CMS admin panel and API.
- `src/collections`: Definitions for Payload data models (Users, Courses, Media, etc.).
- `src/globals`: Global site configuration.

---

## ❓ Questions & Support

For technical challenges, please refer to the [TROUBLESHOOTING.md](file:///e:/Projects/CHA_Student_Portal/cha-student-portal/TROUBLESHOOTING.md) file which documents known issues and fixes related to the EC2 environment and Payload 3.0.

