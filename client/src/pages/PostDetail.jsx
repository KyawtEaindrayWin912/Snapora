import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePost, useLikes, useUpdatePost, useDeletePost } from "../hooks/usePosts";
import { useMe } from "../hooks/useAuth";
import { useGetComments, useAddComment } from "../hooks/useComments";
import { Heart, MessageCircle, Send, MoreHorizontal, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post,refetch, isLoading, isError } = usePost(postId);
  const { data: me } = useMe();
  const { likes, users, like, unlike } = useLikes(postId);

  const { data: comments = [], isLoading: commentsLoading } = useGetComments(postId);
  const addComment = useAddComment(postId);

  const [commentText, setCommentText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [editImage, setEditImage] = useState(null);

  const menuRef = useRef(null);

  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !post) return <p className="text-center mt-10">Post not found</p>;

  const hasLiked = users?.some((u) => u._id === me?._id);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment.mutate(commentText);
    setCommentText("");
  };

  const handleUpdate = () => {
    updatePost.mutate(
      { postId: post._id, caption: editCaption },
      {
        onSuccess: (updatedPost) => {
          queryClient.setQueryData(['post', postId], {
            ...updatedPost,
            user: post.user, 
          });
          setEditOpen(false);
        },
      }
    );
  };
  

  // ✅ Delete post
  const handleDelete = () => {
    deletePost.mutate(post._id, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate("/home"); 
      },
    });
  };
  

  return (
    <div className="flex justify-center mt-10">
      <div className="flex bg-white rounded-2xl shadow-md max-w-5xl w-full h-[80vh] overflow-hidden">
        <div className="w-1/2 bg-black flex items-center justify-center">
          <img
            src={post.image.url}
            alt="Post"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="w-1/2 flex flex-col relative">
          <div className="absolute top-3 right-3 flex gap-3 items-center">
            {me?._id === post.user._id && (
              <div className="relative" ref={menuRef}>
                <MoreHorizontal
                  className="cursor-pointer text-gray-700 hover:text-black"
                  onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        setEditCaption(post.caption);
                        setEditOpen(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      ✏️ Edit Post
                    </button>
                    <button
                      onClick={() => {
                        setDeleteOpen(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    >
                      🗑️ Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}


            <X
              className="cursor-pointer text-gray-700 hover:text-red-500"
              onClick={() => navigate(-1)}
            />
          </div>

          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <img
              src={post.user.avatar?.url || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-bold">{post.user.username}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex gap-3">
              <p>{post.caption}</p>
            </div>
            {commentsLoading
              ? <p className="text-gray-500 italic">Loading comments...</p>
              : comments.length > 0
                ? comments.map((c) => (
                    <div key={c._id} className="flex gap-3">
                      <img
                        src={c.user.avatar?.url || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p>
                          <span className="font-bold mr-2">{c.user.username}</span>
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))
                : <div className="text-gray-500 italic">No comments yet...</div>
            }
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-4 mb-2">
              <Heart
                className={`cursor-pointer transition-colors ${hasLiked ? "fill-red-500 text-red-500" : "text-gray-700 hover:text-red-500"}`}
                onClick={() => (hasLiked ? unlike() : like())}
              />
              <MessageCircle className="cursor-pointer hover:text-blue-500" />
              <Send className="cursor-pointer hover:text-green-500" />
            </div>
            <p className="font-semibold text-sm">{likes} likes</p>
          </div>

          <form onSubmit={handleCommentSubmit} className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 outline-none border-none text-sm"
            />
            <button
              type="submit"
              disabled={addComment.isLoading}
              className="text-blue-500 font-semibold disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
