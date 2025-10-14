import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useLikePost } from "../hooks/usePosts";
import { useMe } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function Feed() {
  const { data: me } = useMe();
  const { data: postsData = [], isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const res = await api.get("/posts/feed");
      return res.data;
    },
  });

  const likeMutation = useLikePost();
  const currentUserId = localStorage.getItem("userId");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(
      postsData.map((post) => ({
        ...post,
        liked: post.likes.includes(currentUserId),
        likesCount: post.likes.length,
      }))
    );
  }, [postsData, currentUserId]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading feed...</p>
      </div>
    );

  const handleLike = (postId) => {
    likeMutation.mutate(postId, {
      onSuccess: () => {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const liked = !post.liked;
              const likesCount = liked
                ? post.likesCount + 1
                : post.likesCount - 1;
              return { ...post, liked, likesCount };
            }
            return post;
          })
        );
      },
    });
  };

  return (
    <div className="flex flex-col items-center sm:mt-16 gap-6 px-2 sm:px-4 md:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-md border border-gray-200 overflow-hidden"
        >
          <div className="flex items-center p-4 gap-3">
            <img
              src={post.user.avatar?.url || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
            />
            <Link
              to={`/profile/${post.user._id}`}
              className="font-semibold text-gray-800 hover:underline text-sm sm:text-base"
            >
              {post.user.username}
            </Link>
          </div>

          <Link to={`/post/${post._id}`}>
            <img
              src={post.image.url}
              alt="Post"
              className="w-full h-auto object-cover max-h-[600px]"
              loading="lazy"
            />
          </Link>

          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex gap-4">
              <button
                onClick={() => handleLike(post._id)}
                className="transition-transform duration-150 hover:scale-110 active:scale-125"
              >
                <Heart
                  size={24}
                  strokeWidth={2}
                  className={`cursor-pointer transition-colors ${
                    post.liked
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                />
              </button>

              <Link
                to={`/post/${post._id}`}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <MessageCircle size={24} strokeWidth={2} />
              </Link>

              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <Send size={24} strokeWidth={2} />
              </button>
            </div>

            <div className="text-right text-xs sm:text-sm text-gray-700">
              <p className="font-semibold">{post.likesCount} likes</p>
              <p className="font-semibold">{post.commentCount} comments</p>
            </div>
          </div>

          <p className="px-4 pb-4 text-sm sm:text-base text-gray-800 break-words">
            <span className="font-semibold">{post.user.username}</span>{" "}
            {post.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
