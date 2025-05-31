import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { differenceInYears } from "date-fns";
import { CalenderIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Select from "./components/Select";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../common/Checkbox";
import Button from "../ui/button/Button";
import { countriesName, gender } from "../../utils/constants";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      password: "",
      confirmPassword: "",
      dob: "",
      agreeToTerms: false,
      gender: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      country: Yup.string().required("Country is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
      dob: Yup.string()
        .required("Date of Birth is required")
        .test("is-18+", "You must be at least 18 years old", (value) => {
          if (!value) return false;
          return differenceInYears(new Date(), new Date(value)) >= 18;
        }),
      gender: Yup.string().required("Gender is required"),
      agreeToTerms: Yup.boolean()
        .oneOf([true], "You must agree to the Terms and Conditions")
        .required("You must agree to the Terms and Conditions"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await authAPI.register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          country: values.country,
          dob: values.dob,
          gender: values.gender,
          password: values.password,
          confirmPassword: values.confirmPassword,
          agreedToTerms: values.agreeToTerms,
        });

        toast.success(
          "Registration successful! Please check your email for verification.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          }
        );

        navigate("/signin");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto p-10 lg:w-1/2  no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Sign Up
        </h1>
        <p className="text-sm text-gray-500 mb-8 dark:text-gray-400">
          Enter your information to sign up!
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                {...formik.getFieldProps("firstName")}
                placeholder="Wali"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </p>
              )}
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                {...formik.getFieldProps("lastName")}
                placeholder="Ahmad"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>Email</Label>
              <Input
                {...formik.getFieldProps("email")}
                type="email"
                placeholder="walishykh@gmail.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
            <div>
              <Label>Enter D.O.B</Label>
              <div className="relative w-full flatpickr-wrapper">
                <Flatpickr
                  value={formik.values.dob}
                  onChange={(selectedDates) => {
                    if (selectedDates.length > 0) {
                      formik.setFieldValue(
                        "dob",
                        selectedDates[0].toISOString().split("T")[0]
                      );
                    }
                  }}
                  options={{ dateFormat: "Y-m-d" }}
                  placeholder="2003-09-15"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-yellow-300 focus:ring-yellow-500/20 dark:border-gray-700  dark:focus:border-yellow-800"
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <CalenderIcon className="size-6" />
                </span>
              </div>
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-red-500 text-sm">{formik.errors.dob}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label>Select Country</Label>
              <Select
                options={countriesName}
                placeholder="Select your country"
                onChange={(value) => formik.setFieldValue("country", value)}
              />
              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-sm">{formik.errors.country}</p>
              )}
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                options={gender}
                placeholder="Select your gender"
                onChange={(value) => formik.setFieldValue("gender", value)}
              />
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-red-500 text-sm">{formik.errors.gender}</p>
              )}
            </div>
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>
          <div>
            <Label>
              Confirm Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...formik.getFieldProps("confirmPassword")}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="text-error-500 text-sm">
                {formik.errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <Checkbox
            checked={formik.values.agreeToTerms}
            onChange={() =>
              formik.setFieldValue("agreeToTerms", !formik.values.agreeToTerms)
            }
            label="Agree to Terms and Conditions"
          />
          {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
            <p className="text-red-500 text-sm">{formik.errors.agreeToTerms}</p>
          )}

          <div>
            <Button
              className="w-full flex items-center justify-center"
              size="sm"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
