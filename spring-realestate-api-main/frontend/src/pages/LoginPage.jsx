import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Alert from "../components/Alert.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "AGENT", label: "Agent" },
  { value: "ADMIN", label: "Admin" },
];

function LoginPage() {
  const { login, loading, error, isAuthenticated, getDashboardPath, user } =
    useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "USER" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(getDashboardPath(user?.role));
  }, [isAuthenticated, navigate, getDashboardPath, user]);

  const submit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!form.email || !form.password || !form.role) {
      setLocalError("Email, password, and role are required.");
      return;
    }
    await login(form);
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl gap-6 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-white lg:block">
        <div className="absolute -left-20 top-12 h-48 w-48 rounded-full bg-primary-500/25 blur-3xl" />
        <div className="absolute bottom-8 right-4 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
        <h2 className="relative text-4xl font-bold leading-tight">
          Welcome back to your real estate command center.
        </h2>
        <p className="relative mt-5 max-w-md text-sm text-slate-200">
          Track leads, listings, and deals in one secure workspace tailored for
          users, agents, and administrators.
        </p>
        <div className="relative mt-10 rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur">
          <p className="text-sm font-semibold">Secure Sign In</p>
          <p className="mt-2 text-xs text-slate-200">
            Use your role while logging in to enter the correct dashboard
            instantly.
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(2,6,23,0.08)] sm:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your account using email, password, and role.
        </p>

        <form className="mt-6 space-y-5" onSubmit={submit}>
          {localError ? <Alert type="error">{localError}</Alert> : null}
          {error ? <Alert type="error">{error}</Alert> : null}

          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">
              Choose role
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, role: role.value }))}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    form.role === role.value
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  aria-pressed={form.role === role.value}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />

          <div>
            <div className="mb-1 text-sm font-medium text-slate-700">
              Password
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-20 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          )}
        </form>

        <div className="mt-4 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link to="/register" className="font-semibold text-primary-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
