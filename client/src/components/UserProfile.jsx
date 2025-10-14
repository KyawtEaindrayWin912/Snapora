import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMe } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useUserPosts } from "../hooks/usePosts";
import { useFollow, useUnfollow } from "../hooks/useFollows";

export default function UserProfile() {
  const { userId: paramId } = useParams();
  const { data: me } = useMe();

  if (!paramId && !me)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  const userId = paramId || me._id;
  const { data: user, isLoading: userLoading } = useUser(userId);
  const { data: posts = [], isLoading: postsLoading } = useUserPosts(userId);

  const followMutation = useFollow(userId);
  const unfollowMutation = useUnfollow(userId);

  const isOwnProfile = me?._id === userId;
  const isFollowing = user?.followers?.some((f) => f._id === me?._id);

  const [showEdit, setShowEdit] = useState(false);

  if (userLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center sm:justify-start">
          <img
            src={user.avatar?.url || "/default-avatar.png"}
            alt="avatar"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {user.username}
            </h2>

            {isOwnProfile ? (
              <button
                onClick={() => setShowEdit(true)}
                className="mt-2 sm:mt-0 px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() =>
                  isFollowing
                    ? unfollowMutation.mutate()
                    : followMutation.mutate()
                }
                className={`mt-2 sm:mt-0 px-4 py-1.5 rounded-lg font-medium transition ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <p className="font-semibold text-gray-800">{user.fullName}</p>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {user.bio || "No bio yet"}
          </p>

          <div className="flex justify-center sm:justify-start gap-6 mt-3 text-sm sm:text-base text-gray-700">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{user.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> following
            </span>
          </div>
        </div>
      </div>

      {postsLoading ? (
        <p className="text-center mt-6 text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center mt-6 text-gray-500 italic">
          No posts yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
          {posts.map((post) => (
            <Link key={post._id} to={`/post/${post._id}`}>
              <img
                src={post.image.url}
                alt="post"
                className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition duration-150"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
