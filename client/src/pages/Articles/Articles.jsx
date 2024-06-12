import "./Articles.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ArticleContext } from "../../context/ArticleContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function Articles() {
  const { isLoogedIn, user } = useContext(AuthContext);
  const { articles, handlePrevPage, handleNextPage, currentPage, totalPages } =
    useContext(ArticleContext);
  const { theme } = useContext(ThemeContext);

  const [query, setQuery] = useState("");

  //Filter articles by title
  const filteredArticles = articles.filter((article) => {
    return article.title.toLowerCase().includes(query.toLowerCase());
  });

  //Change the url when the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.pushState(null, null, `?page=${currentPage}`);
  }, [currentPage]);

  return (
    <section className="articles">
      {isLoogedIn && user.role == "ADMIN" ? (
        <Link to="/create-article">
          <button className="create-article">
            <Link to="/create-article">Create Article</Link>
          </button>
        </Link>
      ) : null}

      <div className="search">
        <div className="searchInput">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="search"
            placeholder="Search for an article 📰..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={
              theme === "light"
                ? {
                    boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.5)",
                  }
                : {
                    boxShadow: "0px 3px 10px rgba(255, 255, 255, 0.3)",
                  }
            }
          />
        </div>
      </div>

      {/* Display articles */}
      <div className="articles-container">
        {filteredArticles.map((article) => {
          return (
            <Link to={`/article/${article.id}`} key={article.id}>
              <div className="article" key={article.id}>
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
                  className="article-info"
                  style={
                    theme === "light"
                      ? {
                          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)",
                        }
                      : {
                          boxShadow: "0 2px 15px rgba(255, 255, 255, 0.3)",
                        }
                  }
                >
                  <div className="content">
                    <div className="infos">
                      {/* //Created at */}
                      <span className="timezone">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      <div className="author">
                        <i className="fa-regular fa-user"></i>
                        <span>{article.author.name}</span>
                      </div>
                    </div>
                    <div className="title">
                      <h2>{article.title}</h2>
                    </div>

                    <div className="details">
                      <Link to={`/article/${article.id}`}>Read More</Link>
                      <span>
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          className="previous"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={
            theme === "light"
              ? {
                  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.5)",
                }
              : {
                  boxShadow: "0px 1px 8px rgba(255, 255, 255, 0.5)",
                }
          }
        >
          Previous
        </button>
        <button
          className="next"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={
            theme === "light"
              ? {
                  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.5)",
                }
              : {
                  boxShadow: "0px 1px 8px rgba(255, 255, 255, 0.5)",
                }
          }
        >
          Next
        </button>
      </div>
    </section>
  );
}
