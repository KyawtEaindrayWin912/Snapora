# Snapora

Snapora is an Instagram-inspired social media web application that allows users to register, create posts with images, like, comment, and view other users’ feeds. It is built with **React**, **Tailwind CSS**, **React Query** on the frontend, and **Node.js**, **Express**, **MongoDB**, and **Mongoose** on the backend.

> Note: Notifications and messaging features are currently skipped.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

**Frontend**

- User authentication: register, login, logout
- Profile management: edit avatar, bio, and name
- Upload posts with images and captions
- Edit or delete own posts
- Like posts and view like counts
- Comment on posts
- Feed with Instagram-style 3-column grid
- Search users and posts by username/caption
- Responsive design for mobile and desktop
- React Query for fetching and caching API data
- Axios for HTTP requests

**Backend**

- JWT-based authentication with access & refresh tokens
- User CRUD and follow/unfollow
- Post CRUD, likes, and comments
- Search posts and users (MongoDB text index)
- Image uploads via Cloudinary
- Input validation with Zod
- Security with CORS, Helmet, and rate limiting

---

## Tech Stack

**Frontend**

- React 18 + Functional Components & Hooks
- React Router v6
- Tailwind CSS
- React Query
- Axios
- Lucide Icons
- Vite

**Backend**

- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- bcrypt for password hashing
- Cloudinary for image storage
- Multer for handling image uploads
- Security: CORS, Helmet, express-rate-limit

---

## Project Structure

```

Snapora/
├─ client/
│  ├─ src/
│  │  ├─ components/   # Reusable UI components
│  │  ├─ hooks/        # API hooks for auth, posts, comments
│  │  ├─ pages/        # Pages like Feed, Profile, PostDetail
│  │  ├─ lib/          # Axios instance & utilities
│  │  ├─ App.jsx       # Main app with routes
│  │  └─ main.jsx      # Entry point
├─ server/
│  ├─ src/
│  │  ├─ controllers/  # Route handlers
│  │  ├─ models/       # Mongoose models (User, Post, Comment)
│  │  ├─ routes/       # Express routes
│  │  ├─ middlewares/  # Auth & error handling
│  │  ├─ utils/        # Helpers (JWT, Cloudinary)
│  │  └─ index.js      # Server entry point
└─ README.md

````

---

## Installation

### Backend

1. Navigate to the backend directory:

```bash
cd Snapora/server
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the backend server:

```bash
npm run dev
```

---

### Frontend

1. Navigate to the frontend directory:

```bash
cd Snapora/client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

4. Start the frontend development server:

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`.

---

## Usage

1. Register a new account or log in.
2. Upload posts with images and captions.
3. View the main feed in a 3-column grid layout.
4. Like posts and add comments.
5. Edit or delete your own posts from your profile.
6. Search for users or posts by username/caption.
7. Edit profile info, including avatar and bio.

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/register` | Register a new user        |
| POST   | `/auth/login`    | Login a user               |
| POST   | `/auth/logout`   | Logout a user              |
| GET    | `/auth/me`       | Get current logged-in user |
| POST   | `/auth/refresh`  | Refresh access token       |
| PUT    | `/auth/profile`  | Update profile             |

### Users

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/users/:id`        | Get user info and posts |
| POST   | `/users/:id/follow` | Follow a user           |
| DELETE | `/users/:id/follow` | Unfollow a user         |

### Posts

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/posts`               | Create a post           |
| GET    | `/posts/feed`          | Get feed posts          |
| GET    | `/posts/:postId`       | Get post by ID          |
| PUT    | `/posts/:id`           | Edit post caption       |
| DELETE | `/posts/:id`           | Delete a post           |
| POST   | `/posts/:postId/like`  | Like a post             |
| POST   | `/posts/:postId/unlike`| Unlike a post           |
| GET    | `/posts/user/:userId`  | Get posts by userID     |
| GET    | `/posts/:postId/likes` | Show like counts        |
| POST   | `/posts/:id/comments`  | Add a comment to a post |
| GET    | `/posts/:id/comments`  | Get comments of a post  |

**Search**

| Method | Endpoint     | Description                                  |
| ------ | ------------ | -------------------------------------------- |
| GET    | `/search?q=` | Search users by username or posts by caption |

---

## License

MIT © Kyawt Eaindray Win
[GitHub](https://github.com/KyawtEaindrayWin912)


