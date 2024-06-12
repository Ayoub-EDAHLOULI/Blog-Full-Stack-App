const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter");
const articleRouter = require("./routes/articleRouter");
const commentRouter = require("./routes/commentRouter");
const categoryRouter = require("./routes/categoryRouter");
const categoriesOnArticlesRouter = require("./routes/categoriesOnArticlesRouter");
const auth = require("./routes/authRouter");
const cors = require("cors");

//Seed data to database
const main = require("./seed");

const PORT = process.env.PORT || 3000;
const hostman = process.env.HOSTMAN || "127.0.0.1";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE",
  })
);

app.use(express.static("public"));

// Routes

//Auth routes
app.use("/api/v1", auth);

// User routes
app.use("/api/v1", userRouter);

// Article routes
app.use("/api/v1", articleRouter);

//Comment routes
app.use("/api/v1", commentRouter);

//Category routes
app.use("/api/v1", categoryRouter);

//Categories on Articles routes
app.use("/api/v1", categoriesOnArticlesRouter);

//Seed data to database
//main();

//Server
app.listen(PORT, () => {
  console.log(`Server is running on port http://${hostman}:${PORT}`);
});
