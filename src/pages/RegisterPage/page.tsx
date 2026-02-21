import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { registerUser } from "@/api/authApi";
import { ROUTES, TOAST_MESSAGES } from "@/constants";
import { getErrorMessage } from "@/api/axiosClient";
import Button from "@/components/shared/Button";
import { FormField, Input } from "@/components/shared/FormField";

// ── Types ────────────────────────────────────────────────────
interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

// ── Validation ───────────────────────────────────────────────
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }

  if (!values.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email format.";
  }

  if (values.phone && !/^[0-9]{8,20}$/.test(values.phone)) {
    errors.phone = "Phone number must be 8–20 digits long.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

// ── Component ────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Mutation ──────────────────────────────────────────────
  const { mutate: register, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.REGISTER_SUCCESS);
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.REGISTER_ERROR);
    },
  });

  // ── Handlers ─────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof FormErrors],
      }));
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
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    register({
      name: values.name.trim(),
      email: values.email,
      phone: values.phone || undefined,
      password: values.password,
    });
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px] flex flex-col gap-5">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="Booky" className="h-8 w-8 object-contain" />
          <span className="text-[22px] font-bold text-neutral-900">Booky</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold text-neutral-900 leading-tight">
            Register
          </h1>
          <p className="text-sm font-medium text-neutral-700">
            Create your account to start borrowing books.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Name */}
          <FormField label="Name" error={errors.name}>
            <Input
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.name}
              placeholder=""
            />
          </FormField>

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

          {/* Phone */}
          <FormField label="Nomor Handphone" error={errors.phone}>
            <Input
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.phone}
              placeholder=""
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" error={errors.password}>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

          {/* Confirm Password */}
          <FormField label="Confirm Password" error={errors.confirmPassword}>
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.confirmPassword}
              placeholder=""
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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
            Submit
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm font-medium text-neutral-700">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="text-primary font-bold hover:underline"
          >
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}