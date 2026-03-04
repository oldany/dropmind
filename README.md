# DropMind

![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Multi-Arch](https://img.shields.io/badge/arch-amd64%20%7C%20arm64-success)
![License](https://img.shields.io/badge/license-AGPL--3.0-red)
![Self Hosted](https://img.shields.io/badge/self--hosted-yes-green)
![GitHub stars](https://img.shields.io/github/stars/oldany/dropmind)

DropMind is a self-hosted memory cache for your digital thoughts.

Designed to be lightweight, private and easy to deploy --- even on a
Raspberry Pi.

Save links, notes, files, images and locations in one place --- fully
under your control.

No cloud lock-in. No external accounts. Just your server.

------------------------------------------------------------------------

## ✨ Features

-   📌 Pin important messages
-   📎 File & image upload
-   🔗 Smart link cards
-   📍 Map / GPS location detection
-   🗂 Multiple clipboards
-   ⭐ Favorite clipboard
-   🔍 Local & global search
-   🌙 Clean dark UI
-   📱 Fully mobile responsive
-   🐳 Docker-ready backend

------------------------------------------------------------------------

## 📸 Interface Preview

### Desktop

![Desktop UI](docs/desktop.png)

### Mobile

![Mobile UI](docs/mobile.png)

------------------------------------------------------------------------

## 🧠 Philosophy

DropMind was born from a simple idea:

Your thoughts are personal.\
Your memory system should be too.

This is not a cloud service.\
It is a self-hosted digital extension of your mind.

------------------------------------------------------------------------

## 👤 Human + AI Development

DropMind was conceived, designed and architected by a human.

The implementation was developed with the support of AI tools, under
direct human supervision and decision-making.

Every architectural choice, feature direction and philosophy belongs to
the project author.

This project embraces AI as a tool --- not as an autonomous creator.

------------------------------------------------------------------------

## 🏗 Architecture

-   Backend: FastAPI\
-   Database: SQLite\
-   Frontend: Vanilla HTML / CSS / JS\
-   Containerized: Docker

### Lightweight by Design

DropMind intentionally avoids complex infrastructure.

There are no external services such as Redis, message queues or
background workers.

The entire stack is:

FastAPI backend\
SQLite database\
Static frontend\
Docker container

This makes DropMind extremely lightweight and ideal for:

-   Raspberry Pi
-   Small home servers
-   Low-power homelabs
-   Single-node deployments

Designed to be lightweight, portable and easy to deploy on:

-   Raspberry Pi
-   Home server
-   VPS
-   NAS
  
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

Create a `config.js` file:

``` js
window.DROPMIND_CONFIG = {
  API_BASE_URL: "http://localhost:8000",
  API_TOKEN: "your-secure-token"
};
```

------------------------------------------------------------------------

### 🚀 Multi-Architecture Support

Images are built for:

-   linux/amd64
-   linux/arm64 (Raspberry Pi compatible)

No manual build required.

------------------------------------------------------------------------

## 🚀 Installation (Docker)

``` bash
git clone https://github.com/oldany/dropmind.git
cd dropmind
docker compose up -d
```

Then open:

    http://localhost:8000

------------------------------------------------------------------------

## ⚙ Configuration

Create a `config.js` file in the frontend root:

``` js
window.DM_CONFIG = {
  API_TOKEN: "your-secure-token"
};
```

Set the same token in backend environment variables.

------------------------------------------------------------------------

## 🍎 iOS / iPadOS Shortcut

DropMind integrates with Apple Shortcuts for a seamless mobile workflow.

Using the official Shortcut, you can:

- Share links directly from Safari  
- Save selected text from any app  
- Upload images to DropMind
- Upload files from any app that support share menu
- Send content to a specific clipboard ( 1 is the default main )

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

## 🧭 Project Roadmap

DropMind intentionally keeps a minimal scope.

Future development focuses on improving reliability, maintainability and
lightweight operation rather than adding heavy features.

Possible future directions include:

-   Improved offline mode and synchronization
-   Optional browser extension for faster capture
-   Codebase cleanup and modularization of the frontend (planned for a
    future major version)

The goal is to keep DropMind small, fast and easy to self-host.

------------------------------------------------------------------------

## Why AGPL?

To ensure that DropMind remains open if modified and offered as a public
service.

------------------------------------------------------------------------

## 📜 License

DropMind is licensed under the GNU Affero General Public License v3.0
(AGPL-3.0).

You are free to use, modify and self-host it.

If you modify DropMind and deploy it publicly, you must release your
changes under the same license.

------------------------------------------------------------------------

## 🌊 Drop it. Own it. Move on.
