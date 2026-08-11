async function sendRequest() {
  const response = await fetch('http://localhost:3000/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      displayName: 'hacker',
      isAdmin: true,
      creditLimit: 50000
    })
  });

  const result = await response.json();
  console.log(`HTTP ${response.status}`);
  console.log(JSON.stringify(result, null, 2));
}

sendRequest().catch((error) => {
  console.error('Request failed:', error.message);
});