// content.js

let isLocked = false;
let word = '';
(async () => {
  // Listen for changes in chrome.storage
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log('Changes in storage');
    if (namespace === 'local' && changes.isLocked) {
      isLocked = changes.isLocked.newValue;
    }
    if (namespace === 'local' && changes.word) {
      word = changes.word.newValue;
    }

    updateState();
  });

  // Get the current state on initial load
  chrome.storage.local.get(['isLocked', 'word'], function (result) {
    console.log('Current state');
    isLocked = result.isLocked || false;
    word = result.word || '';
    updateState();
  });

  // Function to display the lockscreen
  async function updateState() {
    if (!isLocked || !word) {
      // remove the lockscreen from the page
      removeLockscreen();
      return;
    }
    // Check if the lockscreen already exists
    if (document.getElementById('lockscreen-overlay')) {
      return;
    }

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.id = 'lockscreen-overlay';

    // Fetch the lockscreen HTML template
    const response = await fetch(
      chrome.runtime.getURL('./src/html/lockscreen.html'),
    );

    const html = await response.text();

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    // Append the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('./src/css/lockscreen.css');
    document.head.appendChild(link);

    // Attach event listeners
    attachEventListeners();

    // Prevent interaction with the underlying page
    // preventInteraction();
  }

  // Function to attach event listeners
  function attachEventListeners() {
    const submitButton = document.getElementById('submitBtn');
    const playAudioBtn = document.getElementById('playAudioBtn');
    const userInput = document.getElementById('userInput');

    submitButton.addEventListener('click', handleSubmit);
    playAudioBtn.addEventListener('click', speakWord);

    // Handle Enter key
    userInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    });

    // Focus on input field
    userInput.focus();
  }

  // Function to handle submit button click
  function handleSubmit() {
    const userInputValue = document.getElementById('userInput').value.trim();
    if (userInputValue.toLowerCase() === word.toLowerCase()) {
      // Correct word, remove lockscreen
      removeLockscreen();

      chrome.storage.local.set({ isLocked: false });
      // Send a message to background script to reschedule the alarm
      chrome.runtime.sendMessage({ type: 'unlock' });
    } else {
      alert('Incorrect, try again!');
      //   speakWord();
    }
  }

  // Function to remove the lockscreen
  function removeLockscreen() {
    console.log('Removing lockscreen');
    const overlay = document.getElementById('lockscreen-overlay');
    if (overlay) {
      overlay.parentNode.removeChild(overlay);
      overlay.remove();
    }
    // Allow interaction with the page again
    // allowInteraction();
  }

  // Function to prevent interaction with the underlying page
  function preventInteraction() {
    document.addEventListener('keydown', stopEvent, true);
    document.addEventListener('keypress', stopEvent, true);
    document.addEventListener('keyup', stopEvent, true);
    document.addEventListener('mousedown', stopEvent, true);
    document.addEventListener('mouseup', stopEvent, true);
    document.addEventListener('click', stopEvent, true);
    document.addEventListener('contextmenu', stopEvent, true);
    document.addEventListener('wheel', stopEvent, true);
  }

  // Function to allow interaction with the underlying page
  function allowInteraction() {
    document.removeEventListener('keydown', stopEvent, true);
    document.removeEventListener('keypress', stopEvent, true);
    document.removeEventListener('keyup', stopEvent, true);
    document.removeEventListener('mousedown', stopEvent, true);
    document.removeEventListener('mouseup', stopEvent, true);
    document.removeEventListener('click', stopEvent, true);
    document.removeEventListener('contextmenu', stopEvent, true);
    document.removeEventListener('wheel', stopEvent, true);
  }

  // Function to stop event propagation and prevent default
  function stopEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  // Function to speak the word using TTS
  function speakWord() {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
  }
})();
