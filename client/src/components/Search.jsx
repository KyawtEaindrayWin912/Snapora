import React, { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSearch(query);

  return (
    <div className="flex flex-col items-center mt-15 px-4 sm:px-0">
      <div className="w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search users or posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && <p className="text-gray-500">Searching...</p>}

      {data && (
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">Users</h2>
            {data.users.length > 0 ? (
              <div className="space-y-3">
                {data.users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <img
                      src={user.avatar?.url || "/default-avatar.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.fullName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No users found</p>
            )}
          </div>

 
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">Posts</h2>
            {data.posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {data.posts.map((post) => (
                  <Link key={post._id} to={`/post/${post._id}`}>
                    <img
                      src={post.image.url}
                      alt="post"
                      className="w-full h-40 object-cover rounded-lg hover:opacity-90"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No posts found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
