import "./Profile.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { ToastContext } from "../../context/ToastContext";
import axios from "axios";
import { ToastContainer } from "react-toastify";

export default function Profile() {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  //Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  //Toast context
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    // Cleanup function to revoke the object URL when the component unmounts
    return () => {
      if (file) {
        URL.revokeObjectURL(file);
      }
    };
  }, [file]);

  //Get the user data
  const { name, email, bio } = user;

  //Formik logic
  const formik = useFormik({
    initialValues: {
      name: name || "",
      email: email || "",
      password: "",
      bio: bio || "",
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
      textarea: Yup.string().max(200, "Bio must be 200 characters or less."),
    }),
  });

  //Upload Image
  //Upload Image
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "http://127.0.0.1:3000/api/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Image uploaded successfully");

      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", formik.values);

    //Upload the image
    const imageUrl = await uploadImage(file);
    const data = JSON.stringify({ ...formik.values, profilePic: imageUrl });

    //Update the user
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/v1/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });
      console.log("This is the data", data);
      if (res.ok) {
        await addToast("Profile updated successfully!", "success");
      }
    } catch (error) {
      console.log(error);
      addToast("Failed to update profile!", "error");
    }

    if (formik.isValid) {
      formik.resetForm();
    }
  };

  return (
    <>
      <section className="profile-form">
        <div className="profile-picture">
          <input
            onChange={(e) => {
              setFile(e.target.files[0]);
              handleImageChange(e);
            }}
            type="file"
            name="image"
            accept="image/*"
          />
          <img
            src={
              user.profilePic ||
              selectedImage ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
          />
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group-one">
            <div className="labelError">
              {formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""}
            </div>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formik.values.name || user.name}
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
              placeholder="Email"
              name="email"
              value={formik.values.email || user.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="labelError">
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""}
          </div>
          <div className="input-group-two">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="labelError">
              {formik.touched.textarea && formik.errors.textarea
                ? formik.errors.textarea
                : ""}
            </div>
            <textarea
              placeholder="Bio"
              name="bio"
              value={formik.values.bio || user.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="button-group">
            <button>Update</button>
            <button>Delete Account</button>
          </div>
        </form>
        <ToastContainer />
      </section>
    </>
  );
}
