import "./Comments.scss";
import { useState, useContext } from "react";
import { ArticleContext } from "../../context/ArticleContext";

export default function Comments(articleId) {
  const [comment, setComment] = useState([]);
  const numericArticleId = Number(articleId.articleId);

  const { fetchComments } = useContext(ArticleContext);

  const postComment = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/v1/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: comment, articleId: numericArticleId }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Comment posted successfully", data);

        //Empty the comment input field
        setComment("");
        fetchComments();
      } else {
        console.log("There was an error!", data);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <>
      <section className="comments">
        <h2>Leave A Comment</h2>
        <div className="comment-input">
          <textarea
            name="comment"
            id="comment"
            cols="30"
            rows="10"
            placeholder="Write your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={postComment}>Post Comment</button>
        </div>
      </section>
    </>
  );
}
