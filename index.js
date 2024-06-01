const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3030;

// your code

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
app.use(bodyParser.json());
app.use(express.static("public"));

// Utility function to read JSON file
const readJSONFile = () => {
  const data = fs.readFileSync("data.json");
  return JSON.parse(data);
};

// Utility function to write JSON file
const writeJSONFile = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

// Create - POST method
app.post("/articles", (req, res) => {
  const articles = readJSONFile();
  const newArticle = req.body;
  articles.push(newArticle);
  writeJSONFile(articles);
  res.status(201).send(newArticle);
});

// Read - GET method
app.get("/articles", (req, res) => {
  const articles = readJSONFile();
  res.send(articles);
});

app.get("/articles/:slug", (req, res) => {
  const articles = readJSONFile();
  const article = articles.find((a) => a.slug === req.params.slug);
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ message: "Article not found" });
  }
});

// Update - PUT method
app.put("/articles/:slug", (req, res) => {
  const articles = readJSONFile();
  const index = articles.findIndex((a) => a.slug === req.params.slug);
  if (index !== -1) {
    articles[index] = { ...articles[index], ...req.body };
    writeJSONFile(articles);
    res.send(articles[index]);
  } else {
    res.status(404).send({ message: "Article not found" });
  }
});

// Delete - DELETE method
app.delete("/articles/:slug", (req, res) => {
  const articles = readJSONFile();
  const filteredArticles = articles.filter((a) => a.slug !== req.params.slug);
  if (articles.length !== filteredArticles.length) {
    writeJSONFile(filteredArticles);
    res.status(204).send();
  } else {
    res.status(404).send({ message: "Article not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
