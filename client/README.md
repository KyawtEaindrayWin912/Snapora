# Snapora Frontend

Snapora is an Instagram-inspired social media web app built with **React**, **Tailwind CSS**, and **React Query**. This repository contains the **frontend** part of Snapora.

## Features

- User authentication: register, login, logout, and profile management.
- Upload and edit posts with images.
- Like posts and view like counts.
- Comment on posts.
- Feed displaying posts in an Instagram-style grid.
- Profile page showing user info and posts.
- Search for users and posts by username or caption.
- Responsive design for desktop and mobile.
- React Query for fetching, caching, and updating API data.
- Axios for HTTP requests.

> Note: Notifications and messaging features are currently skipped.

---

## Tech Stack

- **React 18** with functional components & hooks
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling
- **React Query** for server state management
- **Axios** for API requests
- **Lucide Icons** for UI icons
- **Vite** for fast development and build
- **Cloudinary** for image uploads

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/KyawtEaindrayWin912/Snapora.git
cd Snapora/frontend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:8080
```

4. Start the development server:

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`.

---

## Folder Structure

```
src/
├─ components/       # Reusable UI components
├─ hooks/            # Custom React hooks (API calls, auth, posts, search)
├─ pages/            # Pages like Feed, Profile, PostDetail, Search
├─ lib/              # Axios instance & utility functions
├─ App.jsx           # Main app with routes
├─ main.jsx          # Entry point
└─ index.css         # Tailwind styles
```

---

## Usage

* Register a new account or log in.
* Upload posts with images and captions.
* View posts on the main feed in a grid layout.
* Like posts and add comments.
* Edit profile information, including avatar and bio.
* Edit or delete your own posts from the profile page.
* Use the search bar to find users or posts by username or caption.

---

## License

MIT © Kyawt Eaindray Win https://github.com/KyawtEaindrayWin912



