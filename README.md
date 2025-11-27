# Task Management Challenge

This is a Task Management application built with React, TypeScript, and Vite. It features a Kanban board and List view for managing tasks, powered by Firebase for the backend.

## Documentation

This project is a task management solution that allows users to:

- Manage tasks with a Kanban board or List view.
- Create, update, and delete tasks.
- Synchronize data in real-time using Firebase.

## Installation Guide

Follow these steps to set up and run the application locally:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd task-management-challange
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Firebase Setup:**
    To run this app locally, you need to set up your own Firebase project.

    **Step 1: Create a Firebase Project**

    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the prompts to create a new project (e.g., name it "task-management-app").
    - This sets up the backend resources. Once created, you'll get a project ID and other details.

    **Step 2: Register Your Web App**

    - In the Firebase Console, select your new project.
    - Click the `</>` icon (Web) under "Get started by adding Firebase to your app."
    - Enter an app nickname (e.g., "TaskApp") and check "Also set up Firebase Hosting" if you plan to deploy later (optional).
    - Click "Register app." This generates a `firebaseConfig` object with keys like `apiKey`, `authDomain`, etc. Copy this—you'll use it in your `.env` file.
    - Firebase will suggest installing the SDK via npm, but we've already handled that.

    **Step 3: Enable Email/Password Authentication**

    - In the Firebase Console, go to the "Authentication" section (left sidebar).
    - Click "Sign-in method" tab.
    - Enable "Email/Password" and save.
    - **Optional but recommended:**
      - Go to the "Password policy" tab in Authentication Settings.
      - Set requirements like minimum length (e.g., 6 characters), require uppercase/lowercase/numbers for better security.
      - Choose "Notify" mode initially to avoid blocking users, or "Require" for strict enforcement.
    - Also, enable "Email enumeration protection" via the Google Cloud CLI (`gcloud`) to prevent email discovery attacks:
      ```bash
      gcloud alpha firebase auth update-settings --project YOUR_PROJECT_ID --email-enumeration-protection=ENABLED
      ```

    **Step 4: Set Up Cloud Firestore Database**

    - In the Firebase Console, go to the "Firestore Database" section (left sidebar).
    - Click "Create database."
    - Choose "Start in production mode" for secure defaults.
    - Select a location (e.g., closest to your users, like `us-central`).
    - This creates your database. No further console setup needed here, but we'll configure rules next.

    **Step 5: Configure Firestore Security Rules**

    - In the Firestore section, go to the "Rules" tab.
    - Replace the default rules with the following to ensure only authenticated users can read/write their own data:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId}/tasks/{taskId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```
    - Click "Publish" to deploy.

4.  **Set up Environment Variables:**
    Copy the example environment file and configure your Firebase credentials using the data from Step 2.

    ```bash
    cp .env.example .env
    ```

    Open `.env` and fill in your Firebase configuration details.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Credentials & Configuration

### Environment Variables

This application uses Firebase. You need to provide your own Firebase configuration in the `.env` file. See `.env.example` for the required fields.

### Demo Credentials

**Note:** These credentials are for the **deployed app only**. For local development, you must create your own user through app or firebase.

- **Email:** `coba@mail.com`
- **Password:** `12345678`

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend/Auth:** Firebase
- **State Management:** React Query, Context API
- **UI Components:** Radix UI, Lucide React, DnD Kit
