import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./Myform.css";

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
        alert(responseData.message);
        sessionStorage.clear();
        navigate("/");
      }
    } catch (error) {
      alert(
        "An unexpected error occurred in validating user. Please try again."
      );
      setLoading(false);
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const user_id = sessionStorage.getItem("user_id");
      values.user_id = user_id;
      await validateUser(values);

    } catch (error) {
      alert(
        "An unexpected error occurred in submit function. Please try again."
      );
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
        {({ isSubmitting }) => (
          <Form className="d-flex align-items-center justify-content-center flex-column">
            <h1>Reset your password</h1>
            <label htmlFor="password">New Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
            />
            <ErrorMessage name="confirmPassword" component="div" />

            <button
              className="btn btn-primary mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {loading ? <>Loading..</> : <>Submit</>}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
