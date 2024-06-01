document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("article-form");
  const articlesList = document.getElementById("articles-list");

  const quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    },
  });

  // Fetch and display articles
  const fetchItems = async () => {
    const res = await fetch("/articles");
    const articles = await res.json();
    articlesList.innerHTML = "";
    articles.forEach((item) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("item");
      articleDiv.innerHTML = `
      <h2>${item.title}</h2>
      <p><strong>Description:</strong> ${item.description}</p>
      <p><img src="${item.img}" alt="${item.title}" width="100"></p>
      <button onclick="deleteItem('${item.slug}')">Delete</button>
      `;
      articlesList.appendChild(articleDiv);
    });
  };

  // Add new article
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newArticle = {
      title: form.title.value,
      slug: form.slug.value,
      img: form.img.value,
      description: form.description.value,
      body: quill.root.innerHTML, // Get HTML from Quill editor
    };
    await fetch("/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    });
    form.reset();
    quill.setContents([]); // Clear Quill editor
    fetchItems();
  });

  // Delete article
  window.deleteItem = async (slug) => {
    await fetch(`/articles/${slug}`, {
      method: "DELETE",
    });
    fetchItems();
  };

  fetchItems();
});
