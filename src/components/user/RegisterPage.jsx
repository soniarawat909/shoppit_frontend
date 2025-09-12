import { useState } from "react";
import "./LoginPage.css";
import api from "../../api";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/auth/register/", {
        username,
        email,
        password,
      });

      setSuccess("Account created successfully! Please login.");
      setError("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const data = err?.response?.data;
      let serverMessage = data?.detail || data?.message;
      if (!serverMessage && data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstVal = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        serverMessage = `${firstKey}: ${firstVal}`;
      }
      setError(serverMessage || "Failed to register. Try again.");
      setSuccess("");
      console.error("Register error:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  const passwordScore = (value) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return score; // 0-5
  };
  const pwdScore = passwordScore(password);

  const formValid =
    username.trim().length >= 3 &&
    isValidEmail(email) &&
    password.length >= 8 &&
    pwdScore >= 3 &&
    password === confirmPassword;

  return (
    <div className="login-container my-5">
      <div className="login-card shadow">
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">Fill in your details to get started</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username (min 3 chars)"
              required
            />
            {username && username.trim().length < 3 && (
              <small className="text-danger">Username should be at least 3 characters</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {email && !isValidEmail(email) && (
              <small className="text-danger">Please enter a valid email</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {password && (
              <div className="mt-2">
                <div
                  style={{
                    height: 8,
                    background: "#eee",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(pwdScore / 5) * 100}%`,
                      background:
                        pwdScore >= 4
                          ? "#28a745"
                          : pwdScore >= 3
                          ? "#ffc107"
                          : "#dc3545",
                      transition: "width 200ms ease",
                    }}
                  />
                </div>
                <small className="text-muted">
                  {pwdScore >= 4 ? "Strong password" : pwdScore >= 3 ? "Medium strength" : "Weak password"}
                </small>
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <small className="text-danger">Passwords do not match</small>
            )}
          </div>

          <button
            type="submit"
            className="btn my-btn w-100"
            disabled={!formValid || isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;