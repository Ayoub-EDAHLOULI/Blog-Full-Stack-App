import "./CreateArticle.scss";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ArticleContext } from "../../context/ArticleContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const quillRef = useRef(); // Create a reference to the Quill Editor

  const { categories, fetchArticles } = useContext(ArticleContext);
  const { theme } = useContext(ThemeContext);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
      ["code-block"],
    ],
  };

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

      console.log(res.data);
      console.log("Image uploaded successfully");
      console.log(
        "res.data.imageUrl ===============================>",
        res.data.data
      );

      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    //Upload the image

    const imageUrl = await uploadImage(file);

    const data = JSON.stringify({ title, content, image: imageUrl, category });

    //Create the article
    try {
      const res = await axios.post(
        "http://127.0.0.1:3000/api/v1/article",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      //Fetch the articles
      fetchArticles();

      //Clear the form
      setFile(null);
      setTitle("");
      setContent("");
      setCategory("");
      quillRef.current.editor.setText("");

      console.log(res.data);
      console.log("Article created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="create-article">
        <div className="create-article-container">
          <h1
            style={
              theme === "dark"
                ? {
                    color: "var(--white-color)",
                  }
                : {
                    color: "var(--l9ahwi-color)",
                  }
            }
          >
            Create a post
          </h1>
          <form onSubmit={handelSubmit}>
            <div className="imageContainer">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                name="image"
                accept="image/*"
              />

              <button onClick={uploadImage}>Upload Image</button>
            </div>

            <select
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={"default"}
            >
              <option value={"default"}>Choose an option</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />

            <ReactQuill
              ref={quillRef} // Assign the reference to the Quill Editor
              theme="snow"
              value={content}
              onChange={setContent}
              className="text-editor"
              modules={modules}
            />

            <button type="submit" className="submitBtn">
              Publish
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
