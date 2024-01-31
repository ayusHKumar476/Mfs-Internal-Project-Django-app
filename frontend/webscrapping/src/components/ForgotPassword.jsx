import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Modal from "react-modal";
import "./Myform.css";

import OtpVerificationModal from "./OtpVerificationModal";

Modal.setAppElement("#root");

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');


  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
  };


  const validationSchema = Yup.object({
    username: Yup.string(),
    email: Yup.string().email("Invalid email address"),
  });

  const validateUser = async (data) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/forgot_password/`,
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

      console.log("response from forgot pass", responseData);

      if (!response.ok) {
        console.log("response failed in forgot_password");
        const errorMessages = responseData.message;
        alert(`Validation errors:\n${errorMessages}`);
        return response.status;
      } else {
        alert("OTP sent successfully");
        return {
          username: responseData.username,
          user_id: responseData.user_id,
          status: 200,
        };
      }
    } catch (error) {
      console.error("Error validating user:", error);
      setLoading(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const validateOTP = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/verify_otp/`,
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

      if (responseData.success === false) {
        console.log("response failed in verify otp");
        alert(`Validation errors:\n${responseData.message}`);
        return { success: false };
      } else {
        alert("OTP matched sucessfully");
        return { success: true };
      }
    } catch (error) {
      console.error("Error validating user:", error);

      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      console.log("OTP submitted:", otp);

      const data = {
        otp: otp,
        username: sessionStorage.getItem("username"),
      };

      const response = await validateOTP(data);
      console.log("response from otp - ", response);
      if (response.success === true) {
        // closeModal();
        navigate("/reset_password");
      } else {
        navigate("/verify_user");
      }
    } catch (error) {
      console.error("Error handling OTP submission:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    const data = {};

    if (values.email) {
      data["email"] = values.email;
    }

    if (values.username) {
      data["username"] = values.username;
    }

    const response = await validateUser(data);

    // console.log("response from fgtpwd api: ", response.username);
    // console.log(response.status == 200);
    if (response.status === 200) {
      setUsername(response.username);
      sessionStorage.setItem("username", response.username);
      sessionStorage.setItem("user_id", response.user_id);
      setShowModal(true);
    }

    resetForm();
  };

  return (
    <div className="d-flex justify-content-center height-80vh">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="d-flex align-items-center justify-content-center flex-column">
            <h1>Verify yourself before proceeding</h1>
            <label htmlFor="username">Username:</label>
            <Field
              type="text"
              id="username"
              name="username"
              disabled={values.email !== ""}
            />
            <ErrorMessage name="username" component="div" />

            <label htmlFor="email">Email:</label>
            <Field
              type="email"
              id="email"
              name="email"
              disabled={values.username !== ""}
            />
            <ErrorMessage name="email" component="div" />

            <div>
              <label htmlFor="myInput">
                <span style={{ color: "red" }}>*</span>&nbsp; Either use your
                email or username
              </label>
            </div>

            <button className="btn btn-primary"
              type="submit"
              disabled={
                isSubmitting || (values.username === "" && values.email === "")
              }
            >
              {loading ? <>Loading..</> : <>Submit</>}
            </button>

            <OtpVerificationModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onOtpSubmit={handleOtpSubmit}
              username={username}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
