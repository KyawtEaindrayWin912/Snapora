import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import { useMe } from "./hooks/useAuth";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import SearchPage from "./pages/Search";

function PrivateRoute({ children }) {
  const { data: user } = useMe();
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
      <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
      <Route path="/post/:postId" element={<PostDetail />} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}
