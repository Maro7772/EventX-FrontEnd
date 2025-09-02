import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EyeOff, Eye, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "user") {
        navigate("/user/dashboard");
      } else {
        setError("Invalid role");
      }
    } catch (error) {
      setError("Login failed. Check your email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome To <br /> EventX Studio👋
        </h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded-lg mb-4">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <motion.input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          required
        />

        <div className="relative mb-4">
          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`cursor-pointer w-full ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white p-3 rounded-lg font-medium shadow-md transition`}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* Register link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don’t have an account?</p>
          <Link
            to="/register"
            className="inline-block mt-2 px-5 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
          >
            + Create Account
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
