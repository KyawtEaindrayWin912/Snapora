import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const validate = () => {
    const newErrors = { username: "", email: "", fullName: "", password: "" };

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return !newErrors.username && !newErrors.email && !newErrors.fullName && !newErrors.password;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    registerMutation.mutate(form, {
      onSuccess: () => navigate("/profile"),
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <form className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-200" onSubmit={handleSubmit}>
        
        <h1 className="text-5xl font-extrabold mb-2 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Snapora
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

        {["username", "email", "fullName", "password"].map((field) => (
        <div key={field} className="mb-4">
            <input
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className={`w-full p-3 border rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
                errors[field] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
            />
            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
        </div>
        ))}

        <button
        type="submit"
        disabled={registerMutation.isLoading}
        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {registerMutation.isLoading ? "Registering..." : "Register"}
        </button>

        {registerMutation.error && (
        <p className="text-red-500 mt-4 text-sm text-center">{registerMutation.error.response?.data?.error}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
        </Link>
        </p>
    </form>
    </div>
  );
}
