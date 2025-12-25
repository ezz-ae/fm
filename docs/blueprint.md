# **App Name**: MotionCanvas

## Core Features:

- Canvas Drawing: Enable users to draw on a fullscreen canvas with chalk-like strokes that vary in thickness based on drawing speed.
- Pause Detection and Release: Detect when the user stops drawing for a short period, triggering a release animation with subtle effects and a background hum.
- Collective Field Slider: After the release animation, present a slider displaying the user's canvas alongside other blurred canvases in a constantly drifting field.
- Intent Choice: Present the user with a choice to either save their drawing or discard it using visual cues (◯ and ✕ symbols) with subtle hover effects.
- Notebook Entry: If the user chooses to save their drawing, display a short, fading line of text to acknowledge their motion.
- Second Chance: If the user chooses to discard their drawing, offer a second chance to reset and start over.
- Event Tracking: Minimal and non-invasive tracking of user interactions, such as reaching the drawing state, field state, and choice selection.

## Style Guidelines:

- Background color: Dark chalkboard texture (#121212) to evoke a classic and creative feel.
- Primary color: Pale Yellow (#FCF8E8) for the chalk strokes to stand out against the dark background, mimicking real chalk.
- Accent color: Muted Grayish-Yellow (#A8A495) for the ◯ and ✕ symbols, providing a subtle contrast without distracting from the main content.
- Font: 'Inter', sans-serif, for the minimal text elements. Note: currently only Google Fonts are supported.
- Use simple, clear symbols (◯ and ✕) for the choice UI, ensuring they are easily recognizable.
- Fullscreen canvas with fixed positioning to prevent scrolling or zooming, ensuring a focused and immersive drawing experience.
- Subtle animations for transitions and feedback, such as the release decay effect and hover highlights on interactive elements.