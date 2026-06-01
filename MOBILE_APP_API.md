# Mobile App API Documentation

## Base URL
`http://<your-domain>/api`

## Authentication
All protected endpoints require a Bearer Token in the header.
`Authorization: Bearer <your_access_token>`

### 1. Register Patient
*   **Endpoint:** `POST /register`
*   **Content-Type:** `application/json`
*   **Body Parameters:**
    *   `name` (string, required): Full name
    *   `email` (string, required): Valid email address
    *   `phone` (string, optional): Phone number
    *   `password` (string, required): Min 8 chars
    *   `password_confirmation` (string, required): Must match password

### 2. Login
*   **Endpoint:** `POST /login`
*   **Body Parameters:**
    *   `email` (string, required)
    *   `password` (string, required)
*   **Response:** Returns `access_token` and user details.

### 3. Get Current User (Me)
*   **Endpoint:** `GET /me`
*   **Headers:** Auth Token required.
*   **Response:** Returns current user and patient profile data.

### 4. Logout
*   **Endpoint:** `POST /logout`
*   **Headers:** Auth Token required.

---

## Home Screen Data
### Get Mobile Home Data
*   **Endpoint:** `GET /mobile/home`
*   **Description:** Returns aggregated data for the home screen to reduce API calls.
*   **Response Structure:**
    *   `banners`: List of active banners.
    *   `specialties`: Top 10 active specialties.
    *   `top_doctors`: Top 5 doctors by rating.
    *   `latest_articles`: 5 most recent articles.

---

## Public Data & Listings

### Doctors
*   **List All:** `GET /doctors`
*   **Details:** `GET /doctors/{id}`
*   **Availability:** `GET /doctors/{id}/availability`

### Specialties
*   **List All:** `GET /specialties`
*   **Details:** `GET /specialties/{id}`

### Lab Tests
*   **List All:** `GET /lab-tests`
*   **Details:** `GET /lab-tests/{id}`

### Content
*   **Articles:** `GET /articles`
*   **FAQs:** `GET /faqs`

---

## Patient Services (Protected)
**Headers:** Auth Token required for all.

### 1. Appointments
*   **List My Appointments:** `GET /my/appointments`
*   **Book Appointment:** `POST /my/appointments`
    *   **Body:**
        *   `doctor_id` (int, required)
        *   `date` (string Y-m-d, required)
        *   `time` (string H:i, required)
        *   `reason` (string, optional)
*   **Cancel Appointment:** `POST /my/appointments/{id}/cancel`

### 2. Profile Management
*   **Update Profile:** `PUT /my/profile`
    *   **Body:**
        *   `name` (string)
        *   `phone` (string)
        *   `address` (string)
        *   `date_of_birth` (date)
        *   `gender` (string: male/female/other)
        *   `blood_group` (string)

### 3. Records
*   **Prescriptions:** `GET /my/prescriptions`
*   **Lab Appointments:** `GET /my/lab-appointments`

---

## Service Bookings (Public/Open)

### 1. NEMT (Medical Transport) Booking
*   **Endpoint:** `POST /nemt-requests`
*   **Body Parameters:**
    *   `patientName` (string, required)
    *   `contactNumber` (string, required)
    *   `pickupLocation` (string, required)
    *   `dropoffLocation` (string, required)
    *   `date` (string Y-m-d, required)
    *   `time` (string H:i, required)
    *   `vehicleType` (string, optional)
    *   `notes` (string, optional)

### 2. Pharmacy Orders (Upload Prescription)
*   **Endpoint:** `POST /pharmacy-orders`
*   **Content-Type:** `multipart/form-data`
*   **Body Parameters:**
    *   `name` (string, required)
    *   `phone` (string, required)
    *   `address` (string, required)
    *   `prescription` (file, required): Image or PDF (max 10MB)
    *   `email` (string, optional)
    *   `note` (string, optional)

### 3. Health Package Request
*   **Endpoint:** `POST /package-requests`
*   **Body Parameters:**
    *   `package_name` (string, required)
    *   `is_for_self` (boolean, required): `true` or `false`
    *   `patient_name` (string, required)
    *   `email` (string, required)
    *   `phone` (string, required)
    *   `address` (string, optional)
    *   **If `is_for_self` is false:**
        *   `booking_name` (string, required)
        *   `booking_email` (string, required)
        *   `booking_phone` (string, required)
        *   `relation` (string, required)

---

## System Info
*   **App Version Check:** `GET /mobile/version`
*   **Server Time:** `GET /time`