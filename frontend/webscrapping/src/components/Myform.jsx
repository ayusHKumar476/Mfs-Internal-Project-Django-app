import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
// import PropTypes from "prop-types";
import * as Yup from "yup";
import "./Myform.css";

// const MyForm = ({ setUsername, setAuthenticated }) => {
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
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/login/`,
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

    if (!response.ok) {
      alert(responseData.message || "An error occurred.");
    } else {
      alert(responseData.message);
    }
  }

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      username: values.username,
      password: values.password,
    };

    try {
      await validateUser(data);
      navigate("/available_websites");
      sessionStorage.setItem("isAuthenticated", true);
    } catch (error) {
      console.error("Error validating user:", error);
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
        <Form className="d-flex align-items-center justify-content-center flex-column">
          {/* <div className="border rounded p-4"> */}
          <h1>Sign In</h1>

          <label htmlFor="username">Username:</label>
          <Field type="text" id="username" name="username" />
          <ErrorMessage name="username" component="div" />

          <label htmlFor="password">Password:</label>
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" />

          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>

          <div className="mt-2">
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
          {/* </div> */}
        </Form>
      </Formik>
    </div>
  );
};

// MyForm.propTypes = {
//   setUsername: PropTypes.func.isRequired,
//   setAuthenticated: PropTypes.func.isRequired,
// };

export default MyForm;
