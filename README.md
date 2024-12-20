# Share Ride

## Overview

**Share Ride** is a web-based application designed to simplify and enhance ride-sharing. The platform connects ride providers and passengers, offering a user-friendly interface for managing rides, bookings, and users. The system is built with modern web technologies to ensure scalability, security, and a seamless user experience.

---

## Features

### User Features:
- **Signup and Login:** Secure user authentication.
- **Ride Management:** Create, edit, and delete rides.
- **Booking Management:** Book and cancel rides.
- **Search and Filter:** Locate rides by destination, price, and date.

### Admin Features:
- **User Management:** View and manage user accounts, activate/deactivate users.
- **Ride Oversight:** View and delete rides violating policies.

---

## Technologies Used

- **Frontend:** ReactJS, React Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)

---

## Prerequisites

Ensure you have the following installed:
- Node.js (v16 or above)
- MySQL
- npm (Node Package Manager)

---

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/SubramanyamGit/Share_Ride.git
cd Share_Ride
```

### Frontend Setup

### Navigate to the frontend directory:
```bash
cd frontend
```

### Install dependencies:
```bash
npm install
```
### Configure the .env file in frontend folder:

add this in env file

REACT_APP_API_URL=http://localhost:3000


### Start the frontend server:
```bash
npm start
```


### Backend Setup

### Navigate to the backend directory:
```bash
cd backend
```

### Install dependencies:
```bash
npm install
```
### Configure the .env file in backend folder:

add this in env file

PORT = 3000
JWT_SECRET_KEY = 'jwt_secret'


### Start the backend server:
```bash
npm start
```