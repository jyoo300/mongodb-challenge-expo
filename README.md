# MongoDB Challenge Expo App (Simplified)

A React Native mobile application built with Expo for managing user profiles. This app connects to the Express backend API to perform CRUD operations on user profiles.

## Features

- View all profiles
- Create, edit, and delete profiles (first name, last name, age, interests)
- All logic and UI on a single screen
- Minimal, clean codebase

## Project Structure

```
mongodb-challenge-expo/
├── App.js                      # Main app entry (renders MainScreen)
├── screens/
│   └── MainScreen.js           # All UI and CRUD logic
├── services/
│   └── api.js                  # Minimal API service for backend communication
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- The Express backend server running (see mongodb-challenge-express README)

## Installation & Usage

1. Navigate to the Expo app directory:
   ```bash
   cd mongodb-challenge-expo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure the Express backend server is running on `http://localhost:3001`
4. Start the Expo app:
   ```bash
   npm start
   ```
   - Scan the QR code with Expo Go app
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for web browser

## User Profile Fields
- **firstName**: String (required, max 50)
- **lastName**: String (required, max 50)
- **age**: Number (required, 13-120)
- **interests**: Array of strings (comma-separated in the UI)

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **Axios**: HTTP client

## License

This project is part of the MongoDB Challenge and is for educational purposes.
