# Snapora Backend

This repository contains the **backend** of Snapora, an Instagram-inspired social media web app. It is built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**, providing RESTful APIs for authentication, posts, comments, likes, profile management, and search.

---

## Features

- **Authentication**
  - Register, login, logout
  - JWT-based access & refresh tokens
  - Password hashing with bcrypt
  - Protected routes with middleware
- **User Profiles**
  - View and edit profile information (avatar, bio, full name)
  - Follow/unfollow users
- **Posts**
  - Upload, edit, and delete posts
  - Image uploads via Cloudinary
  - Like/unlike posts
  - Comment on posts
- **Feed**
  - Fetch posts in descending order by creation date
  - Include likes, comments, and user info
- **Search**
  - Search users by username
  - Search posts by caption (MongoDB text index)
- **Security**
  - CORS, Helmet, and rate limiting for protection

> Note: Notifications and messaging features are currently skipped.

---

## Tech Stack

- **Node.js** & **Express** for server
- **MongoDB** & **Mongoose** for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Cloudinary** for image storage
- **Cors**, **Helmet**, **express-rate-limit** for security
- **Multer** for handling multipart/form-data (image uploads)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/KyawtEaindrayWin912/Snapora.git
cd Snapora/backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development server:

```bash
npm run dev
```

The backend API will now run at `http://localhost:8080`.

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

### Search

| Method | Endpoint     | Description                                  |
| ------ | ------------ | -------------------------------------------- |
| GET    | `/search?q=` | Search users by username or posts by caption |

---

## Folder Structure

```
src/
├─ controllers/     # Route handler functions
├─ models/          # Mongoose models (User, Post, Comment)
├─ routes/          # Express routes
├─ middlewares/     # Auth, error handling, etc.
├─ utils/           # Helper functions (JWT, Cloudinary, etc.)
├─ server.js         # Server entry point
└─ config/          # DB and environment config
```

---

## Usage

1. Register a user via `/auth/register`.
2. Log in to obtain access tokens.
3. Upload and interact with posts.
4. Search users or posts.
5. Edit your profile and manage your posts.

---

## License

MIT © Kyawt Eaindray Win https://github.com/KyawtEaindrayWin912

```

