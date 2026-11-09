// Roblox Pulse V1.1 Content Script

// Notify the web application that the extension is active
function broadcastReady() {
  window.postMessage({
    type: 'ROBLOX_REWIND_EXTENSION_STATUS',
    installed: true,
    version: '1.1.0'
  }, '*');
}

// Listen for messages from the React app
window.addEventListener('message', (event) => {
  // Only accept messages from same window
  if (event.source !== window) return;

  if (event.data && event.data.type === 'CHECK_EXTENSION_INSTALLED') {
    broadcastReady();
  }

  if (event.data && event.data.type === 'REQUEST_AUTO_ROBLOX_SESSION') {
    chrome.runtime.sendMessage({ action: 'AUTO_DETECT_ROBLOX_SESSION' }, (response) => {
      window.postMessage({
        type: 'AUTO_ROBLOX_SESSION_RESULT',
        payload: response || { success: false, error: 'Extension failed to respond' }
      }, '*');
    });
  }

  if (event.data && event.data.type === 'REQUEST_BROWSER_DIRECT_SCAN') {
    chrome.runtime.sendMessage({ action: 'PERFORM_BROWSER_SCAN', cookie: event.data.cookie }, (response) => {
      window.postMessage({
        type: 'BROWSER_DIRECT_SCAN_RESULT',
        payload: response || { success: false, error: 'Direct browser scan failed' }
      }, '*');
    });
  }
});

// Broadcast on startup
broadcastReady();
setTimeout(broadcastReady, 500);
setTimeout(broadcastReady, 1500);
