domohalla - Automated Pomodoro tracking using real-time computer vision in a live game environment.

This project integrates OpenCV-based screen analysis with a React timer UI to automatically track focused work sessions while playing Brawlhalla, eliminating the need for manual timer control.

Why?

In my study sessions using pomodoro timers, i would use the breaks to play 2 ranked games of Brawlhalla before continuing the pomodoro cycle. I created this app as a for fun project, to be able to open my game after the study time was up, and close my game automatically after 2 ranked games finished, using computer vision to detect my matches ending.

---------------

Key Features:

OpenCV template matching for ranked match end detection

False-positive prevention with confidence thresholds & cooldowns

Automatic Pomodoro state transitions

Interactive React + TypeScript UI

Designed as a desktop-style workflow (Electron-compatible)

-----------------

🛠 Tech Stack

Frontend

React

TypeScript

CSS

React Icons

Backend / Detection

Python

OpenCV

NumPy

MSS

Tesseract OCR (configured for extensibility)


