import "./Posts.scss";
import { ArticleContext } from "../../context/ArticleContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function Posts() {
  const { articles } = useContext(ArticleContext);
  const { theme } = useContext(ThemeContext);

  //Sort articles by creation date in descending order (newest first)
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  //Display only the 3 most recent articles
  const recentArticles = sortedArticles.slice(0, 3);

  return (
    <>
      <section className="posts">
        <h1 className="postTitle">
          Latest from the blog
          <div className="line"></div>
        </h1>

        {/* Display articles */}
        <div className="postContainer">
          {recentArticles.map((article) => {
            return (
              <Link to={`/article/${article.id}`} key={article.id}>
                <div className="postContent" key={article.id}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={
                      theme === "light"
                        ? {
                            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)",
                          }
                        : {
                            boxShadow: "0px 1px 4px rgba(255, 255, 255, 0.2)",
                          }
                    }
                  />
                  <div
                    className="postInfo"
                    style={
                      theme === "light"
                        ? {
                            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
                          }
                        : {
                            boxShadow: "0px 2px 15px rgba(255, 255, 255, 0.5)",
                          }
                    }
                  >
                    <div className="content">
                      <div className="infos">
                        {/* //Created at */}
                        <span className="timezone">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <div className="user">
                          <i className="fa-regular fa-user"></i>
                          <span>{article.author.name}</span>
                        </div>
                      </div>
                      <div className="title">
                        <h5>{article.title}</h5>
                      </div>

                      <div className="details">
                        <h4>
                          <Link to={`/article/${article.id}`}>Read More</Link>
                          <span>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
