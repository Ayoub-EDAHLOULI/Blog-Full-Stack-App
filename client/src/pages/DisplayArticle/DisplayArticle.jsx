import { useEffect, useContext } from "react";
import "./DisplayArticle.scss";
import { useParams } from "react-router-dom";
import { ArticleContext } from "../../context/ArticleContext";
import { AuthContext } from "../../context/AuthContext";
import Comments from "../../components/Comments/Comments";
import { Link } from "react-router-dom";

export default function DisplayArticle() {
  //Fetching the article from the database by the article id
  const articleId = useParams().id;

  const {
    articles,
    article,
    getImageUrl,
    setArticleId,
    comments,
    categoryName,
  } = useContext(ArticleContext);
  const { isLoogedIn } = useContext(AuthContext);

  useEffect(() => {
    setArticleId(articleId);
  }, []);

  return (
    <section className="display-article">
      {/* Display the title of the article */}
      <div className="first-part">
        <h1>{article.title}</h1>
      </div>

      {/* Display the article */}
      <div className="second-part">
        <div className="left-side">
          <div className="article-content">
            <div className="article-image">
              <img src={getImageUrl} alt={article.title} />
            </div>
            <div
              className="article-text"
              dangerouslySetInnerHTML={{ __html: article.content }}
            >
              {/* Change the article content from html to text */}
            </div>

            <div className="article-info">
              <div className="article-author">
                <i className="fa-regular fa-user"></i>
                <span>{article.author ? article.author.name : null}</span>
              </div>

              <div className="article-date">
                <i className="fa-regular fa-calendar"></i>
                <span>
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString()
                    : null}
                </span>
              </div>

              <div className="article-category">
                <i className="fa-regular fa-folder"></i>
                <span>{categoryName}</span>
              </div>
            </div>
          </div>

          {/* Display the comments */}
          <div className="comments">
            <h2>Comments</h2>
            {
              // Display the comments
              comments.map((comment) => {
                return (
                  <div className="comment" key={comment.id}>
                    <div className="comment-author">
                      <i className="fa-regular fa-user"></i>
                      <span>{comment.author.name}</span>
                    </div>
                    <div className="comment-content">
                      <p>{comment.content}</p>
                    </div>
                  </div>
                );
              })
            }
          </div>

          {/* Add a comment */}
          {isLoogedIn ? (
            <Comments articleId={articleId} />
          ) : (
            <div className="login-to-comment">
              <h2>You are not authenticated please login to add comment</h2>
              <Link to="/login">Login</Link>
            </div>
          )}

          {/* End of the left side */}
        </div>

        {/* Right side */}
        <div className="right-side">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="recent-articles">
            <h2>Recent Articles</h2>
            <div className="line">
              <div className="inner-line"></div>
            </div>
            {articles.map((article) => {
              return (
                <div className="recent-article-titles" key={article.id}>
                  {/* Extract the titles from the articles */}
                  <h3>{article.title}</h3>
                </div>
              );
            })}
            <div className="recent-articles-container"></div>
            <div className="popular-articles"></div>
            <div className="categories"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
