Bonus Class Booker
The Bonus Class Booker is a web application designed for inFlux language schools to allow students to schedule bonus classes (online or in-person) with teachers. It integrates with Google Sheets to manage available time slots and bookings, providing a user-friendly interface for selecting modalities, time slots, and entering booking details. The application is built with Next.js and deployed on Vercel for seamless scalability and performance.
Features

Modality Selection: Choose between Online (O) or In-Person (P) classes.
Dynamic Time Slots: Displays available time slots based on modality, fetched from a Google Sheet.
Booking Form: Collects student details (name, book, content, WhatsApp) with validation for required fields (name and WhatsApp).
Navigation: Intuitive navigation with back/forward buttons, including a return to time slot selection from the booking form.
Google Calendar Integration: Generates a link to add the booked class to the user's Google Calendar.
Responsive Design: Clean and accessible UI with toast notifications for errors and success messages.
Cancellation Policy: Displays a warning about the cancellation policy (contact before Thursday night to avoid a R$20 fee).

Technologies

Frontend: Next.js 14, React 18, React Toastify
Backend: Next.js API Routes, Google Sheets API (via googleapis)
HTTP Client: Axios
Deployment: Vercel
Styling: CSS (custom styles for navigation and form validation)
Version Control: Git, GitHub

Prerequisites

Node.js (v18 or higher)
npm (v9 or higher)
Google Cloud account with access to Google Sheets API
Vercel account for deployment

Setup Instructions (Local Development)

Clone the Repository:
git clone https://github.com/TvMaia/bonus-class-booker.git
cd bonus-class-booker


Install Dependencies:
npm install


Configure Environment Variables:

Create a .env.local file in the root of the project.
Add the following variables (replace with your Google Sheets API credentials):GOOGLE_SHEET_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
GOOGLE_SHEET_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYourPrivateKey\n-----END PRIVATE KEY-----\n
GOOGLE_SHEET_ID=your-spreadsheet-id


Obtain these credentials from the Google Cloud Console:
Create a service account and enable the Google Sheets API.
Share your Google Sheet with the service account's email.




Run the Development Server:
npm run dev


Open http://localhost:3000 in your browser to view the application.



Deployment on Vercel

Push to GitHub:

Ensure your project is pushed to a GitHub repository (e.g., https://github.com/TvMaia/bonus-class-booker).

git add .
git commit -m "Deploy to Vercel"
git push origin main


Connect to Vercel:

Log in to Vercel (https://vercel.com).
Import the repository from GitHub in the Vercel dashboard.
Vercel will automatically detect the Next.js project and configure build settings.


Set Environment Variables:

In the Vercel dashboard, go to Settings > Environment Variables.
Add the following:
GOOGLE_SHEET_CLIENT_EMAIL
GOOGLE_SHEET_PRIVATE_KEY (ensure newlines are preserved)
GOOGLE_SHEET_ID


Apply to the Production environment (and optionally Preview and Development).


Deploy:

Vercel will trigger a deploy after each push to the main branch.
Access the deployed URL (e.g., https://bonus-class-booker.vercel.app) to test the application.



Project Structure
bonus-class-booker/
├── components/
│   └── AvailableSlotsGrid.jsx   # Component for displaying available time slots
├── pages/
│   ├── api/
│   │   ├── available.js        # API route to fetch available time slots
│   │   └── book.js             # API route to book a time slot
│   ├── booking.jsx             # Booking form component
│   └── index.jsx               # Main page with modality and navigation logic
├── services/
│   └── apiService.js           # Axios client for API requests
├── public/
│   ├── school-logo.png         # School logo
│   └── check.webm              # Success animation
├── styles/
│   └── globals.css             # Custom CSS for styling
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation

Google Sheets Integration
The application uses a Google Sheet to manage time slots and bookings. The sheet should have the following structure:



A
B
C
D
E
F
G



TEACHER
HORARIO
MODALIDADE
ALUNO
LIVRO
CONTEUDO
WHATSAPP


Will
16:00 - 16:30
P







Columns:

TEACHER: Teacher's name (e.g., Will Smith, Carol).
HORARIO: Time slot (e.g., 16:00 - 16:30).
MODALIDADE: Modality (O for Online, P for In-Person, or empty for both).
ALUNO: Student name (empty if available).
LIVRO, CONTEUDO, WHATSAPP: Booking details (filled after booking).


The available.js API route filters slots where ALUNO is empty and matches the selected modality.


Contributing

Fork the repository.
Create a new branch:git checkout -b feature/your-feature


Make changes and commit:git commit -m "Add your feature"


Push to your fork:git push origin feature/your-feature


Open a Pull Request on GitHub.

License
This project is licensed under the MIT License. See the LICENSE file for details.


