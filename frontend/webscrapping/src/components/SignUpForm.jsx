import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";

import OtpVerificationModal from "./OtpVerificationModal";
import "./SignUpForm.css";

Modal.setAppElement("#root");

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate()

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const initialValues = {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    isAdmin: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const validateUser = async (data) => {
    try {
      console.log(data);
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/signup/`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      setLoading(false);

      console.log(responseData);

      if (!response.ok) {
        const errorMessages = Object.values(responseData.message).join("\n");
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        sessionStorage.setItem("signup_username", data.username);
        alert("OTP sent successfully");
        openModal();
      }
    } catch (error) {
      console.error("Error validating user:", error);
      setLoading(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      console.log("OTP submitted:", otp);
      
      alert("Email verification successful!");
      navigate("/available_websites")
      closeModal();
    } catch (error) {
      console.error("Error handling OTP submission:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    console.log("submit triggered");
    const data = {
      username: values.username,
      password1: values.password,
      password2: values.confirmPassword,
      email: values.email,
      isAdmin: values.isAdmin,
    };
    
    await validateUser(data);
    openModal();

    resetForm();
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="username">Username:</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" />

            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />

            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
            />
            <ErrorMessage name="confirmPassword" component="div" />

            <label htmlFor="isAdmin">Are you an admin?</label>
            <Field type="checkbox" id="isAdmin" name="isAdmin" />

            <div>
              <p>
                <Link
                  to="/"
                  className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                >
                  {"Already have an account?"}
                </Link>
              </p>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {loading ? <>Loading..</> : <>Submit</>}
            </button>

            <OtpVerificationModal
              isOpen={showModal}
              onClose={closeModal}
              onOtpSubmit={handleOtpSubmit}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpForm;
