import "./ContactUs.scss";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContext } from "../../context/ToastContext";
import { ToastContainer } from "react-toastify";

export default function ContactUs() {
  const { theme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  //Formik logic
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      phone: "",
      message: "",
    },

    //Validation with Yup
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .max(20, "Name must be 20 charracters or less."),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      subject: Yup.string().required("Subject is required"),
      phone: Yup.number().required("Phone is required"),
      message: Yup.string().required("Message is required"),
    }),

    //Submit function
    onSubmit: (values) => {
      console.log(values);
    },
  });

  //Change the background color of the input background based on the theme
  const inputStyle =
    theme === "dark" ? { backgroundColor: "#f5f5f5", color: "#000" } : {};

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { resetForm } = formik;

    //Check if the form is valid
    if (!formik.isValid) {
      return addToast("Please fill in the required fields!", "error");
    }

    formData.append("access_key", "61f12eaf-878d-43df-bd4e-845211821c8e");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then((res) => res.json())
      .catch((error) => console.log("Error", error));

    if (res.success) {
      await addToast("Message sent successfully!", "success");
      resetForm(); // Reset the form values
    } else {
      await addToast("Message not sent!", "error");
    }
  };

  return (
    <section className="contact-us">
      <div className="contactUs__bg"></div>
      <div className="contactUs__container">
        <div className="contactUs__left">
          <div className="contactUs__left__header">
            <h3>Contact Now</h3>
            <h1>Get In Touch with us</h1>
          </div>
          <form onSubmit={onSubmit}>
            <div className="inputRowOne">
              <div className="name">
                <div className="labelError">
                  {formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ""}
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  style={inputStyle}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="email">
                <div className="labelError">
                  {formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""}
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  style={inputStyle}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="inputRowTwo">
              <div className="subject">
                <div className="labelError">
                  {formik.touched.subject && formik.errors.subject
                    ? formik.errors.subject
                    : ""}
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  style={inputStyle}
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="phone">
                <div className="labelError">
                  {formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : ""}
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  style={inputStyle}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="message">
              <div className="labelError">
                {formik.touched.message && formik.errors.message
                  ? formik.errors.message
                  : ""}
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                style={inputStyle}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contactUs__right">
          <div className="background"></div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
}
