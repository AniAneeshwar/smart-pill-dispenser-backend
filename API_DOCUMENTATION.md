# Smart Pill Dispenser Backend API Documentation

## Base URL
http://localhost:5000

---

## 1. Register User

Endpoint
POST /api/auth/register

Role Required
Public

Request Body

{
"name": "John Doe",
"email": "john@test.com",
"password": "123456",
"role": "patient"
}

Response

{
"message": "User registered successfully"
}

Description
Registers a new user (doctor, patient, caregiver).

---

## 2. Login

Endpoint
POST /api/auth/login

Request Body

{
"email": "john@test.com",
"password": "123456"
}

Response

{
"token": "JWT_TOKEN",
"user": {
"id": "USER_ID",
"name": "John Doe",
"role": "patient"
}
}

Description
Authenticates the user and returns JWT token.
---

## 3. Create Prescription

Endpoint  
POST /api/prescriptions/create

Role Required  
Doctor

Headers

Authorization: Bearer DOCTOR_TOKEN

Request Body

{
"patient_id": "PATIENT_ID",
"medicine_name": "Paracetamol",
"dosage": "500mg",
"frequency": 2,
"start_date": "2026-03-06",
"end_date": "2026-03-10"
}

Response

{
"message": "Prescription created successfully",
"prescription": { ... },
"schedules_created": 8
}

Description  
Doctor creates a prescription for a patient. The system automatically generates dose schedules based on frequency and duration.

---

## 4. Get Prescriptions

Endpoint  
GET /api/prescriptions/my

Role Required  
Doctor or Patient

Headers

Authorization: Bearer TOKEN

Response

[
{
"_id": "PRESCRIPTION_ID",
"doctor_id": "DOCTOR_ID",
"patient_id": "PATIENT_ID",
"medicine_name": "Paracetamol",
"dosage": "500mg",
"frequency": 2,
"start_date": "2026-03-06",
"end_date": "2026-03-10"
}
]

Description  
Returns prescriptions created by the logged-in doctor or assigned to the logged-in patient.

---

## 5. Get Today's Medicines

Endpoint  
GET /api/schedule/today

Role Required  
Patient

Headers

Authorization: Bearer PATIENT_TOKEN

Response

[
{
"schedule_id": "SCHEDULE_ID",
"medicine_name": "Paracetamol",
"dosage": "500mg",
"scheduled_time": "08:00 AM",
"status": "pending"
}
]

Description  
Returns today's medicine schedule for the logged-in patient.

---

## 6. Mark Dose Taken

Endpoint  
POST /api/schedule/taken

Role Required  
Patient

Headers

Authorization: Bearer PATIENT_TOKEN

Request Body

{
"schedule_id": "SCHEDULE_ID"
}

Response

{
"message": "Dose marked as taken",
"schedule": { ... }
}

Description  
Marks a scheduled medicine dose as taken.

---

## 7. Get Next Dose

Endpoint  
GET /api/schedule/next-dose

Role Required  
Patient

Headers

Authorization: Bearer PATIENT_TOKEN

Response

{
"medicine_name": "Paracetamol",
"dosage": "500mg",
"scheduled_time": "08:00 PM",
"status": "pending"
}

Description  
Returns the next upcoming medicine dose for the logged-in patient.

---

## 8. Get Dose History

Endpoint  
GET /api/schedule/history/:patient_id

Role Required  
Doctor or Patient

Headers

Authorization: Bearer TOKEN

Response

{
"patient_id": "PATIENT_ID",
"history": [
{
"schedule_id": "SCHEDULE_ID",
"medicine_name": "Paracetamol",
"scheduled_time": "06 Mar 2026 08:00 AM",
"status": "taken",
"taken_time": "06 Mar 2026 08:02 AM"
}
]
}

Description  
Returns complete medicine intake history for a patient.

---

## 9. Patient Adherence

Endpoint  
GET /api/adherence/patient/:patient_id

Role Required  
Doctor

Headers

Authorization: Bearer DOCTOR_TOKEN

Response

{
"patient_id": "PATIENT_ID",
"total_doses": 10,
"taken_doses": 7,
"missed_doses": 3,
"adherence_percentage": "70.00"
}

Description  
Calculates medication adherence percentage for a patient.

---

## 10. Weekly Adherence Report

Endpoint  
GET /api/adherence/report/:patient_id

Role Required  
Doctor

Headers

Authorization: Bearer DOCTOR_TOKEN

Response

{
"patient_id": "PATIENT_ID",
"report": [
{
"date": "2026-03-06",
"taken": 2,
"missed": 1
}
]
}

Description  
Provides a daily breakdown of taken and missed doses.

---

## 11. Adherence Chart Data

Endpoint  
GET /api/adherence/chart/:patient_id

Role Required  
Doctor or Patient

Headers

Authorization: Bearer TOKEN

Response

{
"2026-03-06": 2,
"2026-03-07": 1
}

Description  
Returns data used to generate adherence charts.

---

## 12. Doctor Dashboard - Patient List

Endpoint  
GET /api/doctor/patients

Role Required  
Doctor

Headers

Authorization: Bearer DOCTOR_TOKEN

Response

[
{
"patient_name": "John Doe",
"patient_id": "PATIENT_ID",
"adherence": "80.00",
"taken_doses": 8,
"missed_doses": 2
}
]

Description  
Returns all patients with adherence statistics for doctor monitoring.

---

## 13. Caregiver Alerts

Endpoint  
GET /api/alerts/caregiver

Role Required  
Caregiver

Headers

Authorization: Bearer CAREGIVER_TOKEN

Response

[
{
"patient_id": "PATIENT_ID",
"caregiver_id": "CAREGIVER_ID",
"message": "Patient John Doe missed medicine scheduled at 2026-03-06T08:00:00Z",
"created_at": "2026-03-06T08:30:00Z"
}
]

Description  
Returns alerts when a patient misses a scheduled medicine.

---

## 14. Update Accessibility Settings

Endpoint  
PUT /api/users/accessibility

Role Required  
Authenticated User

Headers

Authorization: Bearer TOKEN

Request Body

{
"accessibility_mode": "vision_impaired",
"language": "en"
}

Response

{
"message": "Accessibility settings updated",
"user": { ... }
}

Description  
Allows users to update accessibility preferences such as vision or hearing mode and language.