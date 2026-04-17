import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-white relative z-10">

        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-50 to-white -z-10 lg:hidden"></div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 mx-auto lg:mx-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-base text-slate-500 font-medium">
              Please enter your details to access your dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex. admin@example.com"
                error={errors.email}
                required
              />
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full mt-6 shadow-indigo-500/25"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400">Quick Demo Access</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setFormData({ email: 'manager@example.com', password: 'Manager123!' })}
                className="flex flex-col items-center p-3 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-2 group-hover:bg-emerald-500 group-hover:text-white transition-colors">M</div>
                <span className="text-xs font-bold text-slate-700">Manager</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'user@example.com', password: 'Password123!' })}
                className="flex flex-col items-center p-3 border border-slate-200 rounded-2xl hover:border-slate-500 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm mb-2 group-hover:bg-slate-600 group-hover:text-white transition-colors">U</div>
                <span className="text-xs font-bold text-slate-700">User</span>
              </button>
            </div>
          </div>
          
          <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start space-x-3">
            <svg className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              We recommend changing your password continuously for optimal security within the platform.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
        <div className="absolute top-[40%] right-[-10%] w-96 h-96 bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgeT0iNTAiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgZD0iTTAgMGg2MHY2MEgwaHoiLz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 max-w-lg w-full p-2 animate-fade-in-up">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2rem] shadow-2xl flex flex-col items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px]"></div>
            
            <div className="mb-6 inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-white/80 text-xs font-semibold tracking-wide uppercase">System Operational</span>
            </div>
            
            <h3 className="text-4xl font-bold text-white mb-4 leading-tight">
              Powerful tools for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">modern teams.</span>
            </h3>
            <p className="text-indigo-100/70 text-lg leading-relaxed mb-8">
              Streamlined access control and comprehensive user management architecture built to scale with your organization.
            </p>
            
            <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mb-8"></div>
            
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xl z-30">A</div>
              <div className="w-12 h-12 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xl z-20">M</div>
              <div className="w-12 h-12 rounded-full bg-slate-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xl z-10">U</div>
              <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs shadow-xl z-0">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
