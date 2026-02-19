import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { loginUser } from "@/api/authApi";
import { setCredentials } from "@/store/authSlice";
import { ROUTES, TOAST_MESSAGES } from "@/constants";
import { getErrorMessage } from "@/api/axiosClient";
import Button from "@/components/shared/Button";
import { FormField, Input } from "@/components/shared/FormField";

// ── Types ────────────────────────────────────────────────────
interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// ── Validation ───────────────────────────────────────────────
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.email) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!values.password) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 6) {
    errors.password = "Password minimal 6 karakter.";
  }
  return errors;
}

// ── Component ────────────────────────────────────────────────
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    ROUTES.BOOKS;

  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  // ── Mutation ──────────────────────────────────────────────
  const { mutate: login, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.LOGIN_ERROR);
    },
  });

  // ── Handlers ─────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate(values)[name as keyof FormErrors],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    login({ email: values.email, password: values.password });
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] flex flex-col gap-5">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="Booky" className="h-8 w-8 object-contain" />
          <span className="text-[22px] font-bold text-neutral-900">Booky</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold text-neutral-900 leading-tight">
            Login
          </h1>
          <p className="text-sm font-medium text-neutral-700">
            Sign in to manage your library account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Email */}
          <FormField label="Email" error={errors.email}>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.email}
              placeholder=""
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" error={errors.password}>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.password}
              placeholder=""
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </FormField>

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isPending}
            className="w-full h-12"
          >
            Login
          </Button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm font-medium text-neutral-700">
          Don't have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="text-primary font-bold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}