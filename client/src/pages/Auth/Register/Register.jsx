import "./Register.scss";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContext } from "../../../context/ToastContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";

export default function Register() {
  //Toast context
  const { addToast } = useContext(ToastContext);

  //Formik logic
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    //Validation with Yup
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .max(20, "Name must be 20 charracters or less."),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    //Submit function

    onSubmit: (values) => {
      console.log(values);
    },
  });

  console.log(formik.errors);

  const registerUser = async () => {
    const { name, email, password } = formik.values;

    //Check if the form is valid
    if (!formik.isValid) {
      return addToast("Please fill in the required fields!", "error");
    }

    try {
      // Send a POST request to the server
      fetch("http://127.0.0.1:3000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }).then((response) => {
        if (response.ok) {
          addToast("User registered successfully", "success");
        } else {
          addToast("Failed to register user", "error");
        }
      });
    } catch (error) {
      console.log(error);
      addToast("Failed to register user", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <>
      <div className="Register">
        <div className="close">
          <Link to="/">
            <i className="fa-solid fa-xmark"></i>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className="labelError">
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : ""}
          </div>
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <div className="labelError">
            {formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""}
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <div className="labelError">
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""}
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <button type="submit">Register</button>
          <p className="accountMissing">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </>
  );
}
