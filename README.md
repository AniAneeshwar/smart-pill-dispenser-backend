# Smart Pill Dispenser Backend

A Node.js backend system for a **Smart Medication Management Platform** that helps doctors monitor patients’ medicine adherence and alerts caregivers when doses are missed.

---

## 🚀 Features

* User authentication with JWT
* Role-based access (Doctor, Patient, Caregiver)
* Prescription management
* Automatic medicine schedule generation
* Dose tracking (taken / missed)
* Patient adherence analytics
* Doctor dashboard
* Caregiver alerts
* Accessibility settings support

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST API Architecture

---

## 📂 Project Structure

controllers/ → API logic
models/ → Database schemas
routes/ → API routes
middleware/ → Authentication & role protection
server.js → Main server entry

---

## ⚙️ Installation

Clone the repository:

git clone https://github.com/AniAneeshwar/smart-pill-dispenser-backend.git

Navigate to project folder:

cd smart-pill-dispenser-backend

Install dependencies:

npm install

---

## 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

---

## ▶️ Running the Server

Start the server:

npm start

or with nodemon:

npm run dev

Server runs at:

http://localhost:5000

---

## 📚 API Documentation

Complete API documentation is available in:

API_DOCUMENTATION.md

---

## 🔐 Authentication

All protected routes require a JWT token:

Authorization: Bearer YOUR_TOKEN

---

## 📡 Main API Endpoints

Auth

POST /api/auth/register
POST /api/auth/login

Prescription

POST /api/prescriptions/create
GET /api/prescriptions/my

Schedule

GET /api/schedule/today
POST /api/schedule/taken
GET /api/schedule/next-dose
GET /api/schedule/history/:patient_id

Adherence

GET /api/adherence/patient/:patient_id
GET /api/adherence/report/:patient_id
GET /api/adherence/chart/:patient_id

Doctor

GET /api/doctor/patients

Alerts

GET /api/alerts/caregiver

User Settings

PUT /api/users/accessibility

---

## 📊 System Workflow

Doctor → Creates Prescription
Backend → Generates Medicine Schedule
Patient → Marks Dose Taken
System → Tracks Adherence
Caregiver → Receives Missed Dose Alerts

---

## 📌 Future Improvements

* Push notifications
* AI pill recognition
* Smart dispenser integration
* Mobile application dashboard

---

## 👨‍💻 Author

Aneeshwar S
Artificial Intelligence & Data Science
Panimalar Engineering College
