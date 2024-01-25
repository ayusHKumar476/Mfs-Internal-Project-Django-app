import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const validateUser = async (data) => {
    try {
      console.log(data);
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/reset_password/`,
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
        console.log("response failed");
        const errorMessages = responseData.message;
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        console.log("response passed", responseData);
        alert(responseData.message + "\nPassword changed sucessfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Error validating user:", error);
      alert("An unexpected error occurred. Please try again.");
      setLoading(false);
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

    console.log("response from fgtpwd api: ", response.username);

    console.log(response.status == 200);

    if (response.status == 200) {
      sessionStorage.setItem("signup_username", response.username);
    }
    resetForm();
  };

  return (
    <div>
      <h1>Reset your password</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="password">New Password:</label>
            <Field type="password" id="username" name="username" />
            <ErrorMessage name="password" component="div" />

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
            />
            <ErrorMessage name="confirmPassword" component="div" />

            <button type="submit" disabled={isSubmitting}>
              {loading ? <>Loading..</> : <>Submit</>}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
