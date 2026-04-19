# Scholarly - E-Learning Platform

A sleek, dynamic e-learning platform focusing on an immersive student experience. Built with vanilla web technologies and powered by Firebase, Scholarly provides robust course tracking, authentication, and personalized learning dashboards.

## Features

- **Secure Authentication**: Email/Password and Google OAuth integration handled securely via Firebase Authentication.
- **Dynamic Dashboards**: A personalized user dashboard that filters and displays active courses based on real-time database progress.
- **Video Course Engine**: An integrated video player with automated progress tracking. Viewing history is instantly persisted to Firestore.
- **Interactive Quizzes**: Built-in quizzes to test knowledge, with scores seamlessly recorded to the user's profile.
- **Profile Management**: Custom user profiles that dynamically aggregate completed quizzes, "Watch Later" lists, and "Favorite" courses.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend/BaaS**: Firebase (Authentication, Firestore Database)
- **Media**: Embedded YouTube Player API

## Getting Started

1. **Clone the repository.**
2. **Configure Firebase**:
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password & Google).
   - Enable Firestore Database and set up the appropriate security rules.
   - Update `firebase/config.js` with your specific Firebase project credentials.
3. **Run Locally**:
   - Serve the project using a local web server (e.g., VS Code Live Server). 
   - *Note: Opening the files directly via `file://` will prevent Firebase Authentication from functioning correctly due to security policies.*

## Project Structure

- `/css` - Styling and layout (responsive grids, variables, dark mode aesthetics).
- `/js` - Core application logic separated by page (`auth.js`, `dashboard.js`, `course.js`, `profile.js`, `quiz.js`).
- `/firebase` - Firebase initialization and configuration.