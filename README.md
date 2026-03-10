# DropMind

![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Multi-Arch](https://img.shields.io/badge/arch-amd64%20%7C%20arm64-success)
![License](https://img.shields.io/badge/license-AGPL--3.0-red)
![Self Hosted](https://img.shields.io/badge/self--hosted-yes-green)
![GitHub stars](https://img.shields.io/github/stars/oldany/dropmind)

A lightweight **self-hosted capture inbox** for links, notes,
screenshots and files across your devices.

An alternative to **Telegram "Saved Messages"** for quickly sending
links, notes and files between your own devices.

**Drop something now. Organize it later.**

Think of DropMind as a **personal memory cache** running on your own
server.

------------------------------------------------------------------------

## ✨ Features

DropMind focuses on one simple idea:

**capture things quickly and retrieve them later.**

Typical things you can drop into DropMind:

- links to read later
- screenshots from mobile
- temporary files between devices
- quick notes
- ideas or reminders

### Core capabilities

- simple message-style interface
- send **text, links, images and files**
- **multi-clipboard organization**
- global search
- installable **PWA** (mobile & desktop)
- **Android share support**
- **Apple Shortcut support for instant sharing**
- extremely lightweight
- **Docker deployment**

------------------------------------------------------------------------

## 📸 Screenshots

### Desktop

![Desktop UI](docs/desktop.png)

### Mobile

![Mobile UI](docs/mobile.png)

------------------------------------------------------------------------

## 🍎 Apple Shortcut

DropMind can integrate with **Apple Shortcuts** to quickly send:

-   links
-   text
-   images
-   files

directly from **iOS and iPadOS**.

This makes DropMind behave like a **personal cross‑device inbox**.

### Install the Shortcut

👉 **Download here:**  
[Add DropMind Shortcut](https://www.icloud.com/shortcuts/8f39d178512145918c7d1fda03d31c43)

After installation:

1. Open the Shortcut once to grant permissions  
2. Set your DropMind server URL  
3. Insert your API token  
4. Choose your default clipboard  

You're ready.

Fully local. Fully yours.

------------------------------------------------------------------------

## 💡 Typical Workflow

1.  Find something interesting on your phone
2.  **Drop it into DropMind**
3.  Later open it on your computer
4.  Keep it, move it elsewhere, or delete it

DropMind is **not a note‑taking system**.

It is a **temporary capture space** for your digital thoughts.

Use it as the **front door for your ideas and resources**.

------------------------------------------------------------------------

## 🚀 Quick Start

Clone the repository:

``` bash
git clone https://github.com/oldany/dropmind
cd dropmind
```

Start the stack:

``` bash
docker compose up -d
```

Create a `config.js` file inside the `frontend` folder:

``` js
window.DM_CONFIG = {
  API_BASE_URL: "http://localhost:8000",
  API_TOKEN: "your-secure-token"
};
```

Open your browser:

    http://localhost:8080

That's it.

------------------------------------------------------------------------

## 🐳 Deploy with Prebuilt Docker Images (Recommended)

DropMind provides official multi-architecture Docker images (amd64 +
arm64) published on GitHub Container Registry.

This is the recommended way to deploy in production.

### Backend

``` bash
docker pull ghcr.io/oldany/dropmind-backend:latest
```

### Frontend

``` bash
docker pull ghcr.io/oldany/dropmind-frontend:latest
```

------------------------------------------------------------------------

### Example docker-compose (Production)

``` yaml
version: "3.9"

services:
  backend:
    image: ghcr.io/oldany/dropmind-backend:latest
    container_name: dropmind_backend
    volumes:
      - ./data/db:/data/db
      - ./data/attachments:/data/attachments
    ports:
      - "8000:8000"
    environment:
      - DROPMIND_API_TOKEN=your-secure-token
    restart: unless-stopped

  frontend:
    image: ghcr.io/oldany/dropmind-frontend:latest
    container_name: dropmind_frontend
    volumes:
      # Optional: external config.js
      - ./frontend/config.js:/usr/share/nginx/html/config.js
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped
```

------------------------------------------------------------------------

### 🔐 config.js Example

Create a `config.js` file inside the `frontend` folder:

``` js
window.DM_CONFIG = {
  API_BASE_URL: "http://localhost:8000",
  API_TOKEN: "your-secure-token"
};
```

------------------------------------------------------------------------

⭐ If you like DropMind, consider starring the repo to support the project!

------------------------------------------------------------------------

## 🧠 Philosophy

Your thoughts are personal.\
Your memory system should be too.

Many people use:

-   Telegram "Saved Messages"
-   email
-   cloud notes

to move things between devices.

DropMind provides a **self‑hosted alternative focused on quick
capture**.

Simple. Private. Always available.

------------------------------------------------------------------------

## 🤖 Human + AI Development

DropMind was created by a human with the assistance of AI tools.

AI helped accelerate development, but the **idea, direction and design
decisions were human‑driven**.

------------------------------------------------------------------------

## 🛣 Roadmap

Possible future improvements:

-   stronger offline support
-   browser extensions
-   UI improvements
-   performance optimizations

------------------------------------------------------------------------

## Why AGPL?

To ensure that DropMind remains open if modified and offered as a public
service.
To prevent closed commercial forks of DropMind while keeping the project
fully open.

------------------------------------------------------------------------

## 📜 License

DropMind is licensed under the GNU Affero General Public License v3.0
(AGPL-3.0).

You are free to use, modify and self-host it.

If you modify DropMind and deploy it publicly, you must release your
changes under the same license.

------------------------------------------------------------------------

## 🌊 Drop it. Own it. Move on.
