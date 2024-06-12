import "./ArticlesCrud.scss";
import { ArticleContext } from "../../context/ArticleContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function ArticlesCrud() {
  const { articles, handlePrevPage, handleNextPage, currentPage, totalPages } =
    useContext(ArticleContext);

  return (
    <>
      <section className="articles-crud">
        <h1>ArticlesCrud</h1>
        <div className="articles-crud-line "></div>

        <div className="articles-crud-form">
          {articles.map((article) => (
            <div key={article.id} className="article">
              <div className="article-image">
                <img src={article.image} alt={article.title} />
              </div>
              <h2 className="article-title">{article.title}</h2>

              <div className="buttons">
                <Link to={`/edit-article/${article.id}`}>
                  <i className="fa-solid fa-pen-to-square edit" />
                </Link>
                <i className="fa-solid fa-trash trash"></i>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="pagination">
          <button
            className="previous"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}
