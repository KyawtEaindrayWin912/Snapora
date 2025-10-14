import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return alert("Only images allowed");
    if (file.size > 5 * 1024 * 1024) return alert("Max 5MB");

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");
    setLoading(true);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-800">
          Create a New Post
        </h1>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
        )}

        <label className="block text-sm font-medium text-gray-600">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
        />

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg resize-none h-24 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`py-2.5 rounded-lg font-semibold text-white transition duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Posting..." : "Share Post"}
        </button>
      </form>
    </div>
  );
}
