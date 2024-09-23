// background.js

(async () => {
  // Default settings
  const DEFAULT_SETTINGS = {
    lockInterval: 5, // minutes
    locksPaused: false,
    level: 'beginner',
  };
  // chrome.action.onClicked.addListener(() => {
  //   activateLockscreen();
  // });
  // Load settings from storage or set defaults
  let settings = await getSettings();

  // Schedule the initial alarm
  if (!settings.locksPaused) {
    scheduleAlarm(settings.lockInterval);
  }

  // Listen for messages to update settings or handle unlocks
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getAlarm') {
      chrome.alarms.get('lockAlarm', function (alarm) {
        if (alarm) {
          sendResponse({ alarm });
        } else {
          sendResponse('No alarm found with that name.');
        }
      });
      return true;
    } else if (message.type === 'updateSettings') {
      updateSettings(message.newSettings).then(() => {
        sendResponse({ success: true });
      });
      return true; // Indicates sendResponse will be called asynchronously
    } else if (message.type === 'unlock') {
      // User has unlocked the lockscreen, reschedule the alarm
      chrome.storage.local.set({ isLocked: false });
      if (!settings.locksPaused) {
        scheduleAlarm(settings.lockInterval);
      }
    } else if (message.type === 'pauseLocks') {
      settings.locksPaused = true;
      chrome.storage.local.set({ isLocked: false });
      clearAlarm();
      saveSettings(settings);
      sendResponse({ success: true });
    } else if (message.type === 'resumeLocks') {
      settings.locksPaused = false;
      scheduleAlarm(settings.lockInterval);
      saveSettings(settings);
      sendResponse({ success: true });
    }

    // sendResponse({ success: false, message });
  });

  // On startup, reschedule the alarm if necessary
  chrome.runtime.onStartup.addListener(() => {
    if (!settings.locksPaused) {
      scheduleAlarm(settings.lockInterval);
    }
  });

  // Listen for the alarm to trigger the lockscreen
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'lockAlarm') {
      activateLockscreen();
    }
  });

  // Function to activate the lockscreen
  async function activateLockscreen() {
    const word = await fetchRandomWord();
    chrome.storage.local.set({ isLocked: true, word });
  }

  // Function to schedule the alarm
  function scheduleAlarm(intervalMinutes) {
    clearAlarm();
    chrome.alarms.create('lockAlarm', { delayInMinutes: intervalMinutes });
  }

  // Function to clear the alarm
  function clearAlarm() {
    chrome.alarms.clear('lockAlarm');
  }

  // Function to fetch settings from storage
  async function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ['lockInterval', 'locksPaused', 'level'],
        (result) => {
          let settings = {
            lockInterval: result.lockInterval || DEFAULT_SETTINGS.lockInterval,
            locksPaused: result.locksPaused || DEFAULT_SETTINGS.locksPaused,
            level: result.level || DEFAULT_SETTINGS.level,
          };
          resolve(settings);
        },
      );
    });
  }

  // Function to save settings to storage
  function saveSettings(settings) {
    chrome.storage.local.set({
      lockInterval: settings.lockInterval,
      locksPaused: settings.locksPaused,
    });
  }

  // Function to update settings
  async function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    saveSettings(settings);
    if (!settings.locksPaused) {
      scheduleAlarm(settings.lockInterval);
    } else {
      clearAlarm();
    }
  }

  // Function to fetch a random word
  async function fetchRandomWord() {
    try {
      const response = await fetch(
        chrome.runtime.getURL('./src/data/words.json'),
      );
      const data = await response.json();
      const words = data.levels[settings.level];
      const randomIndex = Math.floor(Math.random() * words.length);
      return words[randomIndex];
    } catch (error) {
      console.error('Error fetching word:', error);
      return 'example'; // Fallback word
    }
  }
})();
