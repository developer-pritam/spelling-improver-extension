# Spelling Improver: Spell Better, Type Faster!

**Spelling Improver** is a Chrome extension designed to help you improve your spelling skills by requiring you to type words correctly to unlock your browser tabs. This extension periodically locks your screen and prompts you to type a word correctly to continue browsing.

## Features
- **Lock Interval**: Set the interval at which the lock screen appears.
- **Pause/Resume Locks**: Temporarily pause or resume the lock screen functionality.
- **Level Selector**: Choose your difficulty level (Beginner, Intermediate, Advanced).
- **Audio Playback**: Hear the word you need to type to unlock the screen.
- **Customizable Settings**: Easily customize settings through the options page.

## Installation
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the directory containing this extension.

## Usage
1. Click on the extension icon in the Chrome toolbar to open the options page.
2. Set your desired lock interval, difficulty level, and toggle the lock functionality.
3. Save your changes.
4. The extension will periodically lock your screen based on the set interval. Type the word correctly to unlock and continue browsing.

## Files and Directories
- **manifest.json**: Configuration file for the Chrome extension.
- **src/js/**: Contains JavaScript files for background tasks, content scripts, and the options page.
  - `background.js`: Handles alarms, settings, and lock screen activation.
  - `content.js`: Manages the lock screen display and user interactions.
  - `options.js`: Manages the options page functionality.
- **src/html/**: Contains HTML files for the lock screen and options page.
  - `lockscreen.html`: Template for the lock screen.
  - `options.html`: Template for the options page.
- **src/css/**: Contains CSS files for styling the lock screen.
  - `lockscreen.css`: Styles for the lock screen.
- **src/data/**: Contains data files.
  - `words.json`: JSON file containing words for different difficulty levels.
- **src/icons/**: Contains icons for the extension.

## Permissions
- **alarms**: To schedule and manage lock intervals.
- **storage**: To save and retrieve user settings.
- **host_permissions**: To allow the extension to run on all URLs.

## Contributing
1. Fork the repository.
2. Create a new branch:  
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:  
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to the branch:  
   ```bash
   git push origin feature-branch
   ```
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or suggestions, please open an issue or contact the repository owner.

---

Happy spelling! 🚀

---

### Improvements Made:
- Added better formatting for clarity and readability.
- Made the installation and usage instructions more structured.
- Organized files and directories to give a clear understanding of the project structure.
- Added code snippets for contributing instructions to make it easy for contributors to follow.

This should be more user-friendly and easier to understand for anyone looking at the repository. Let me know if you'd like any additional tweaks!