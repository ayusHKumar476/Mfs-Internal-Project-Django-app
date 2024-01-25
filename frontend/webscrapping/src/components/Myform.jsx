// MyForm.js
// import React from 'react';
// import "./MyForm.css";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { getCookie } from "csr"

const MyForm = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  async function validateUser(data) {
    // const csrfToken = getCookie('CSRF-TOKEN');

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/login/`,
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          // 'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      alert(responseData.message || "An error occurred.");
    } else {
      alert(responseData.message);
    }
  }

  const onSubmit = async (values, { resetForm }) => {
    console.log("Form submitted:", values);

    const data = {
      username: values.username,
      password: values.password,
    };

    try {
      await validateUser(data);
      navigate("/available_websites");
    } catch (error) {
      console.error("Error validating user:", error);
    }

    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div>
          <label htmlFor="username">Username:</label>
          <Field type="text" id="username" name="username" />
          <ErrorMessage name="username" component="div" />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" />
        </div>

        <div>
          <button className="btn-primary" type="submit">
            Submit
          </button>
        </div>

        <div>
          <p>
            <Link
              to="/signup"
              className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            >
              {"Don't have an account?"}
            </Link>
          </p>
        </div>

        <div>
          <p>
            <a
              href="/verify_user"
              className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            >
              {"Forgot password?"}
            </a>
          </p>
        </div>
      </Form>
    </Formik>
  );
};

export default MyForm;
