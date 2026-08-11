[Google Drive Folder](https://drive.google.com/drive/folders/12PhTquj1DhK0hGEkLB850jyEjXtJFHC4?usp=sharing)

# Mass Assignment Demo

A small Node.js security lab that makes a mass-assignment vulnerability visible through a profile editor.

The page appears to update only a user's display name. The server's `POST /api/profile` handler, however, copies every property from the request body into the user record. That means fields that are not exposed by the form, such as `isAdmin` and `creditLimit`, can also be changed.

> **Security warning:** This project intentionally contains a vulnerable update endpoint. Run it locally for educational use only. Do not expose it to the internet or use the code in production.

## What It Demonstrates

- A browser form that submits a normal profile update.
- A Node.js HTTP server with no external dependencies.
- A JSON API backed by an in-memory user record.
- How an attacker can submit additional properties that the UI does not show.
- The difference between client-side field visibility and server-side authorization.

## Requirements

- Node.js 18 or newer
- A modern web browser

No package installation is required because the server uses Node's built-in `http`, `fs`, and `path` modules.

## Run the Demo

From this directory, start the server:

```powershell
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The server listens on all network interfaces (`0.0.0.0`) so another device can reach it through this computer's local IPv4 address. Keep the server on a trusted network and stop it when finished with `Ctrl+C`.

## Try the Normal Flow

1. Open the demo page.
2. Change the **Display name** field.
3. Select **Save profile**.
4. Watch the returned in-memory record update.

The record is reset whenever the server restarts.

## Run the Exploit Example

Keep `server.js` running, then open a second terminal in this directory and run:

```powershell
node another.js
```

`another.js` sends this JSON payload:

```json
{
  "displayName": "hacker",
  "isAdmin": true,
  "creditLimit": 50000
}
```

The response demonstrates that the server accepts and stores all three properties, even though the web form only provides a `displayName` input.

You can also test the API with PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/api/profile

Invoke-RestMethod `
  -Uri http://localhost:3000/api/profile `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"displayName":"hacker","isAdmin":true,"creditLimit":50000}'
```

## API

### `GET /api/profile`

Returns the current user record.

### `POST /api/profile`

Accepts a JSON object and merges its properties into the current user record. This intentionally unsafe behavior is the focus of the demo.

Example response:

```json
{
  "displayName": "Alex Morgan",
  "isAdmin": false,
  "creditLimit": 500
}
```

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Demo page and profile form |
| `style.css` | Page styling and responsive layout |
| `script.js` | Browser-side API requests and record rendering |
| `server.js` | Static file server and profile API |
| `another.js` | Example request that exploits mass assignment |

## How to Fix the Vulnerability

A production implementation should allowlist fields at the server boundary instead of merging arbitrary request properties. For example, only copy `displayName` from the parsed request body, validate its type and length, and authorize every sensitive field change separately.
