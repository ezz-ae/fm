# Architecture

This document outlines the technical architecture of the MotionCanvas application.

## Frontend

*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS
*   **UI Components:** A mix of custom-built components and UI components from a library (likely shadcn/ui, given the file structure).

## Backend

*   **Server-side Logic:** Next.js with Server-Side Rendering (SSR)
*   **Deployment:** The application is deployed as a Cloud Function on Firebase, which handles the server-side rendering of the Next.js application.

## Deployment & Hosting

*   **Hosting:** Firebase Hosting serves the static assets and rewrites dynamic routes to the Firebase Function.
*   **Continuous Integration:** The project is set up for manual deployment via the Firebase CLI.

## Integrations

*   **Authentication:** Firebase Authentication is used for user management.
*   **AI:** The application integrates with Google's Generative AI (Gemini) via Genkit for its AI-powered features.
*   **Payments:** PayPal is integrated for handling payments.
