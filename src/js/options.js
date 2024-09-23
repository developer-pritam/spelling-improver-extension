// options.js

document.addEventListener('DOMContentLoaded', () => {
  const lockIntervalInput = document.getElementById('lockInterval');

  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const nextAlarmTime = document.getElementById('nextAlarmTime');
  const toggleLockBtn = document.getElementById('toggleLock');
  // Load settings
  chrome.storage.local.get(['lockInterval', 'locksPaused'], (result) => {
    lockIntervalInput.value = result.lockInterval || 5;
    updateStatus(result.locksPaused);
  });

  // Pause locks

  toggleLockBtn.addEventListener('change', function () {
    if (!toggleLockBtn.checked) {
      chrome.runtime.sendMessage({ type: 'pauseLocks' }, (response) => {
        if (response.success) {
          updateStatus(true);
        }
      });
    } else {
      chrome.runtime.sendMessage({ type: 'resumeLocks' }, (response) => {
        if (response.success) {
          updateStatus(false);
        }
      });
    }
  });

  // Save changes
  saveBtn.addEventListener('click', () => {
    const lockInterval = parseInt(lockIntervalInput.value);
    const levelSelector = document.getElementById('levelSelector');
    const level = levelSelector.value;

    if (isNaN(lockInterval) || lockInterval < 1 || lockInterval > 120) {
      statusDiv.textContent =
        'Please enter a valid interval between 1 and 120 minutes.';
      statusDiv.style.color = 'red';
      return;
    }

    chrome.runtime.sendMessage(
      { type: 'updateSettings', newSettings: { lockInterval, level } },
      (response) => {
        if (response && response.success) {
          statusDiv.textContent = 'Settings have been saved.';
          statusDiv.style.color = 'green';
        } else {
          statusDiv.textContent = 'Error saving settings.';
          statusDiv.style.color = 'red';
        }
      },
    );
    loadNextAlarmTime();
  });

  function updateStatus(locksPaused) {
    if (locksPaused) {
      toggleLockBtn.checked = false;
      statusDiv.textContent = 'Locks are currently paused.';
      statusDiv.style.color = 'orange';
    } else {
      toggleLockBtn.checked = true;
      statusDiv.textContent = 'Locks are currently active.';
      statusDiv.style.color = 'green';
    }
    loadNextAlarmTime();
  }
  async function loadNextAlarmTime() {
    chrome.runtime.sendMessage({ action: 'getAlarm' }, function (response) {
      if (response.alarm) {
        nextAlarmTime.textContent =
          'Next alarm time: ' +
          new Date(response.alarm.scheduledTime).toLocaleTimeString();
      } else {
        nextAlarmTime.textContent = response;
      }
    });
  }
});
