import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [adminCode, setAdminCode] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [interests, setInterests] = useState([]);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        adminCode,
        age,
        gender,
        interests,
        location,
      });
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong ❌, try again!";
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create Account 🚀
        </h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded-lg mb-4">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Name */}
        <motion.input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          required
        />

        {/* Email */}
        <motion.input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          required
        />

        {/* Password */}
        <div className="relative mb-4">
          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition pr-10"
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

        {/* Age */}
        <motion.input
          type="number"
          placeholder="Age"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />

        {/* Gender */}
        <motion.select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="male">👨 Male</option>
          <option value="female">👩 Female</option>
        </motion.select>

        {/* Interests */}
        <div className="mb-4">
          <p className="mb-2 font-medium text-gray-700">Select Interests:</p>
          <div className="flex gap-2 flex-wrap">
            {["Sports", "Arts", "Music", "Tech", "Martial Arts", "Makeup"].map(
              (interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`cursor-pointer px-3 py-1 rounded-full border ${
                    interests.includes(interest)
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {interest}
                </button>
              )
            )}
          </div>
        </div>

        {/* Location */}
        <motion.input
          type="text"
          placeholder="Location"
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />

        {/* Role */}
        <motion.select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="user">🙋 User</option>
          <option value="admin">🛠️ Admin</option>
        </motion.select>

        {/* Admin Code if admin */}
        {role === "admin" && (
          <motion.input
            type="text"
            placeholder="Admin Code"
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            required
          />
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          className="cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </motion.button>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link
            to="/login"
            className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow hover:opacity-90 transition"
          >
            🔑 Back to Login
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default Register;
