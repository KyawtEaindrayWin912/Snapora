import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useMe } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

export default function EditProfile() {
  const { data: user } = useMe();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Only images allowed");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");

    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      if (avatarFile && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(avatarUrl, croppedAreaPixels);
        formData.append("avatar", croppedBlob, "avatar.jpg");
        setAvatarUrl(URL.createObjectURL(croppedBlob));
        setAvatarFile(null);
      }

      formData.append("fullName", fullName);
      formData.append("bio", bio);

      const res = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      queryClient.setQueryData(["me"], res.data);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed, clearing client state anyway.");
    }
    queryClient.removeQueries();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-800">
          Edit Profile
        </h1>

        {avatarFile ? (
          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <Cropper
              image={avatarUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        ) : (
          avatarUrl && (
            <div className="flex justify-center">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
            </div>
          )
        )}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleChooseFileClick}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            {avatarFile
              ? "Change Avatar"
              : avatarUrl
              ? "Edit Avatar"
              : "Choose Avatar"}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div>
          <label className="block text-gray-600 text-sm mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Write something about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`py-2.5 rounded-lg font-semibold text-white transition duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
        >
          Log Out
        </button>
      </form>
    </div>
  );
}
