import { useMe } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useUserPosts } from "../hooks/usePosts";
import Modal from "../components/Modal";

export default function Profile() {
  const { data: me, isLoading } = useMe();

  const { data: posts = [], isLoading: postsLoading } = useUserPosts(me?._id);

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!me) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex items-center gap-6 p-4">
        <img
          src={me.avatar?.url || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-2xl font-bold">{me.username}</h2>
            <button
              className="px-4 py-1 rounded border border-gray-300"
              onClick={() => console.log("TODO: open edit modal")}
            >
              Edit Profile
            </button>
          </div>
          <p className="font-semibold">{me.fullName}</p>
          <p className="text-gray-600 mt-1">{me.bio || "No bio yet"}</p>
          <div className="flex gap-4 mt-2">
            <span>{posts.length} posts</span>
            <span>{me.followers?.length || 0} followers</span>
            <span>{me.following?.length || 0} following</span>
          </div>
        </div>
      </div>

      {postsLoading ? (
        <p className="text-center mt-6">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center mt-6 text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
          {posts.map((post) => (
    
              <Link to={`/post/${post._id}`}>
                <img
                  src={post.image.url}
                  alt="Post"
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </Link>

          ))}
        </div>
      )}
    </div>
  );
}
