# UNWRITTEN Architecture

This document outlines the technical architecture of the UNWRITTEN experience, designed to support its core philosophy of motion-based, identity-free expression.

## Core Experience: The Motion Canvas

*   **Framework:** The front-end is built with **Next.js (React)**, chosen for its powerful server-side rendering (SSR) and client-side interactivity capabilities. This allows for a seamless, immediate experience that begins the moment a user arrives.
*   **Motion and Interaction:** The central "canvas" is a React component that listens for user input (mouse, touch, stylus). This motion is the primary driver of the entire experience, triggering everything from the visual feedback of chalk on a board to the initiation of the AI "Notebook."
*   **Styling:** **Tailwind CSS** is used for its utility-first approach, enabling the creation of a minimalist and highly responsive UI that fades into the background, ensuring the user's expression is the central focus.

## Backend and Intelligence

*   **The Notebook (AI):** The AI-driven "Notebook" is powered by **Google's Generative AI (Gemini) via Genkit**. It is not a chatbot but a reactive presence. The AI is designed to respond sparsely and poetically to the user's pauses and patterns, creating a sense of dialogue without explicit conversation.
*   **Server Logic:** The **Next.js backend (SSR)**, deployed as a **Firebase Function**, handles the server-side logic. This is crucial for the initial, mysterious loading of the experience and for processing the AI interactions.

## Deployment and Infrastructure

*   **Hosting:** **Firebase Hosting** serves the static front-end assets and intelligently routes dynamic requests to the Firebase Function. This ensures a fast, reliable, and scalable experience.
*   **The "Collective Field":** The sense of a shared space with others is an architectural concept. While the initial implementation may use placeholder data, the long-term vision is for the backend to surface anonymized, abstract patterns of interaction from other users, creating a feeling of shared presence without direct social features.

## Key Technical Decisions

*   **No Database, No Accounts:** A defining architectural choice is the **absence of a traditional user database or authentication system** in the initial experience. Identity is not required. This aligns with the core principle of "expression before identity."
*   **Monetization as Friction:** The introduction of a **PayPal** integration after a moment of hesitation (choosing "✕") is an intentional point of friction, reframing payment not as a purchase of a product, but as a payment for another attempt—a sign of user intent.
