# University Schedule Application

A web application for university class schedules with language selection functionality (Russian/English).

## Features

- User authentication (students, teachers, administrators)
- Personalized schedules for each user type
- Language selection (Russian/English)
- Responsive design
- Database with users, groups, subjects, and schedules

## User Roles

1. **Student**: Views their personal schedule
2. **Teacher**: Views classes they teach
3. **Administrator**: Views all schedules and manages the system

## Database Structure

The application uses a JSON file (`data/database.json`) with the following structure:

- `users`: Contains user information (email, password, name, role)
- `groups`: Contains student groups
- `subjects`: Contains subjects and associated teachers
- `schedule`: Contains schedule entries with day, time, room, etc.

## API Endpoints

- `POST /api/login` - Authenticate user
- `GET /api/schedule/:userId` - Get schedule for a user
- `GET /api/users` - Get all users (admin only)

## How to Run

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open your browser and go to `http://localhost:3000`

## Default Login Credentials

- Student: student@example.com / password123
- Teacher: teacher@example.com / password123
- Admin: admin@example.com / password123

## Project Structure

```
/workspace/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── LoginPage.js
│   │   └── SchedulePage.js
│   ├── contexts/
│   │   └── LanguageContext.js
│   ├── utils/
│   ├── assets/
│   │   └── styles.css
│   └── App.js
├── data/
│   └── database.json
├── server.js
├── package.json
└── README.md
```

## Language Selection

The application supports both Russian and English. Users can switch languages using the dropdown menu in the navigation bar or on the login page. The selected language is stored in localStorage and persists between sessions.