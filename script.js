const form = document.querySelector('#profile-form');
const displayNameInput = document.querySelector('#display-name');
const recordElement = document.querySelector('#user-record');
const badgeElement = document.querySelector('#result-badge');
const messageElement = document.querySelector('#message');

function renderRecord(userRecord, exposedFields = []) {
  recordElement.innerHTML = Object.entries(userRecord).map(([key, value]) => `
    <div class="${exposedFields.includes(key) ? 'exposed' : ''}">
      <dt>${key}</dt>
      <dd>${value}</dd>
    </div>
  `).join('');
}

async function updateProfile(requestBody) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error('The profile update failed.');
  }

  return response.json();
}

async function loadProfile() {
  const response = await fetch('/api/profile');
  const userRecord = await response.json();
  renderRecord(userRecord);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const userRecord = await updateProfile({ displayName: displayNameInput.value });
    badgeElement.textContent = 'Updated';
    badgeElement.className = 'status safe';
    messageElement.textContent = 'The visible profile field was saved.';
    messageElement.className = 'message';
    renderRecord(userRecord);
  } catch (error) {
    messageElement.textContent = error.message;
  }
});

loadProfile().catch(() => {
  messageElement.textContent = 'Unable to load the profile.';
});

setInterval(() => {
  loadProfile().catch(() => {
    messageElement.textContent = 'Unable to load the profile.';
  });
}, 1000);
