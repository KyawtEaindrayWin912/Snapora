import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } 
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    loginMutation.mutate(form, {
      onSuccess: () => navigate("/home"),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-200">
        
        <h1 className="text-5xl font-extrabold mb-2 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Snapora
        </h1>
    
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h2>
    
        <div className="mb-4">
            <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
                errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
    
        <div className="mb-4">
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`w-full p-3 border rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
                errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
    
        <button
        type="submit"
        disabled={loginMutation.isLoading}
        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>
    
        {loginMutation.error && <p className="text-red-500 mt-4 text-sm text-center">{loginMutation.error.response?.data?.error}</p>}
    
        <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
            </Link>
        </p>
        </form>
    </div>
  );
}
