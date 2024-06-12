import "./NineCards.scss";
import { ArticleContext } from "../../context/ArticleContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function NineCards() {
  const { articles } = useContext(ArticleContext);
  const { theme } = useContext(ThemeContext);

  //Sort articles by creation date in descending order (newest first)
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  //Display only the 3 most recent articles
  const recentArticles = sortedArticles.slice(0, 9);

  return (
    <section className="nine-cards">
      {recentArticles.map((article) => {
        return (
          <Link to={`/article/${article.id}`} key={article.id}>
            <div
              className="card"
              style={
                theme === "light"
                  ? {
                      boxShadow: "0 1px 10px rgba(0, 0, 0, 0.1)",
                    }
                  : {
                      boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                    }
              }
            >
              <img src={article.image} alt={article.title} />
              <div className="info">
                <Link to={`/article/${article.id}`} className="title">
                  {article.title}
                </Link>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="line"></div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
