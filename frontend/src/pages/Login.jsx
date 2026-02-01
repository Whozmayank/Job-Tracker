import { useState } from "react";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./Login.css";

const Login = () => {
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // clear old error
      
        try {
          const res = await loginUser(formData);
      
          localStorage.setItem("token", res.token);
          navigate("/dashboard");
        } catch (error) {
          // backend error message
          const message =
            error.response?.data?.error || "Login failed. Please try again.";
      
          setErrorMsg(message);
        }
      };
          


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    return (<>
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Enter your credentials to access your account.</p>
                {errorMsg && <p className="error-text">{errorMsg}</p>}
                <form onSubmit={handleSubmit}>
                    {/* EMAIL */}
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
                </p>

            </div>
        </div>
    </>
    )
}

export default Login;