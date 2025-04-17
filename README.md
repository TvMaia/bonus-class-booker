# Bonus Class Booker

The **Bonus Class Booker** is a simple system designed to allow students to schedule additional classes on Fridays. The system allows students to select available slots, book a teacher, and receive notifications of confirmation and reminders. The coordinators manage the schedule and availability of teachers via a Google Sheet. 

## Features

- **Student Side:**
  - View available slots based on teacher availability.
  - Select a time slot and enter booking details.
  - Receive booking confirmation and reminders via browser notifications.
  
- **Coordinator Side:**
  - Manage teacher availability and time slots via Google Sheets.
  - The system automatically tracks available slots based on Google Sheet data.
  - Easily adjust teacher availability and time slots by adding/removing rows in the Google Sheet.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** Google Sheets (using Google Sheets API)
- **Hosting:** Railway (for both backend and frontend)

---

## Project Structure

```
bonus-class-booker/
├── backend/  
│   ├── controllers/           # Functions for interacting with Google Sheets API
│   ├── routes/                # Routes for API requests (GET, POST)
│   ├── services/              # Service for managing Google Sheets API
│   ├── .env                   # Environment variables (Google API credentials)
│   ├── app.js                 # Express setup and middlewares
│   └── server.js              # Server entry point
│
├── frontend/
│   ├── public/                # Public assets (favicon, etc.)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # Service to call backend API
│   │   ├── App.js             # Main App component
│   │   ├── index.js           # React entry point
│   │   └── styles.css         # Global styles
│   ├── .env                   # Environment variables for frontend (optional)
│   └── package.json           # Frontend dependencies and scripts
│
└── README.md                  # Project documentation (this file)
```

---

## Setup and Installation

### Backend

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/bonus-class-booker.git
   cd bonus-class-booker/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory and add your Google Sheets API credentials. You can follow the [Google Sheets API quickstart guide](https://developers.google.com/sheets/api/quickstart/nodejs) to set up the credentials and get the `GOOGLE_SHEET_ID` and `GOOGLE_API_KEY`.

   Example `.env` file:

   ```
   GOOGLE_SHEET_ID=your-google-sheet-id
   GOOGLE_API_KEY=your-google-api-key
   ```

4. **Run the server locally:**

   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`.

### Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Run the development server:**

   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`.

### Deploying to Railway (or other hosting services)

1. **Create a Railway account** if you don't have one: [https://railway.app/](https://railway.app/)

2. **Deploy the backend:**
   - Push the backend code to GitHub (if not already done).
   - Go to Railway, create a new project, and select GitHub to deploy the backend.
   - Add your `.env` variables to Railway's environment settings for your project.

3. **Deploy the frontend:**
   - Similarly, push the frontend code to GitHub and deploy on Railway.

   Once deployed, the backend and frontend will be live with URLs provided by Railway.

---

## How It Works

### **Google Sheets as the Database**

1. **Google Sheets Structure:**

   The Google Sheet is used to store teacher availability and bookings. Each row in the sheet represents an individual booking slot. The system reads available slots based on the number of rows corresponding to that time.

   Example layout:

   | Teacher   | Time    | Student Name | Booked? | WhatsApp    | Status       |
   |-----------|---------|--------------|---------|-------------|--------------|
   | Teacher A | 14:00   |              |         | 999999999   | Available    |
   | Teacher B | 14:00   |              |         | 999999999   | Available    |
   | Teacher C | 14:00   |              |         | 999999999   | Available    |
   | Teacher A | 14:30   |              |         | 999999999   | Available    |

2. **Backend (Node.js)**:
   - The backend communicates with Google Sheets using the [Google Sheets API](https://developers.google.com/sheets/api). 
   - The `GET /bonus-class/available` API reads the sheet, filters available slots, and returns the number of open spots for each time slot.
   - The `POST /bonus-class/book` API updates the sheet with the student's information and marks the time slot as "booked."

3. **Frontend (React.js)**:
   - Students can see available slots and book a time by providing their details.
   - The frontend communicates with the backend through REST API calls.
   - After booking, the student gets a browser notification confirming the class and a reminder the day before and 2 hours prior.

---

## Notifications

1. **Booking Confirmation:**
   - When a student books a class, a browser notification is sent confirming the class.
   - The message includes the time, teacher, and the policy of a $20 fine for cancellations or no-shows on the day of the class.

2. **Reminders:**
   - A reminder notification will be sent the day before the class and again 2 hours prior to the class start time.

---

## To-Do and Future Improvements

- Add a login system for students (optional).
- Add the ability for coordinators to edit the sheet directly from the admin interface (e.g., via a web interface).
- Improve error handling and validation on the frontend.
- Implement a payment integration for the fine (if applicable).
- Add a calendar view for better schedule management.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

