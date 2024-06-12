import { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

const ArticleContext = createContext();

function ArticleProvider(props) {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState({});
  const [getImageUrl, setGetImageUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [articleId, setArticleId] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //Fetching all articles from the database
  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:3000/api/v1/articles?page=${currentPage}&limit=6`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { articles, totalPages } = response.data.data;
      setTotalPages(totalPages);
      setArticles(articles);
      console.log("This is the response data", response.data.data);
      console.log("This is the articles", articles);
      console.log("This is the total pages", totalPages);
    } catch (error) {
      console.error("An error occurred while fetching the articles", error);
    }
  };

  //Fetching a single article from the database
  const fetchArticle = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/v1/article/${articleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setArticle(data.data);
      } else {
        console.log("There was an error!", data);
      }

      //Get the image url from the article content
      const imageFilename = data.data.image
        ? data.data.image.split("/").pop()
        : null;
      const imageUrl = `http://127.0.0.1:3000/images/${imageFilename}`;
      setGetImageUrl(imageUrl);
      console.log("This is the data ===============> ", data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  //Fetch article comments
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/v1/comments/${articleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setComments(data.data);
        console.log("This is the comments data", data.data);
      } else {
        console.log("There was an error!", data);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  //Get the categories from the database
  const fetchCategories = async () => {
    try {
      await fetch("http://127.0.0.1:3000/api/v1/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCategories(data.data));
    } catch (error) {
      console.log("An error occurred while fetching the categories", error);
    }
  };

  // Get the category name from the category id
  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    setCategoryName(category ? category.name : "Unknown");
  };
  useMemo(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchComments();
    }
  }, [articleId]);

  useEffect(() => {
    if (article.categories && article.categories.length > 0) {
      getCategoryName(article.categories[0].categoryId);
    }
  }, [article]);

  const values = {
    articles,
    article,
    getImageUrl,
    setArticleId,
    comments,
    fetchComments,
    fetchArticles,
    categories,
    categoryName,
    handlePrevPage,
    handleNextPage,
    currentPage,
    totalPages,
  };

  return <ArticleContext.Provider value={values} {...props} />;
}

export { ArticleContext, ArticleProvider };
