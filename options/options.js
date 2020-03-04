const defaultPortalTextArea = document.querySelector("#default-portal");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  let defaultPortal = defaultPortalTextArea.value;
  browser.storage.local.set({
    defaultPortal
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  defaultPortalTextArea.value = restoredSettings.defaultPortal;
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
defaultPortalTextArea.addEventListener("change", storeSettings);
