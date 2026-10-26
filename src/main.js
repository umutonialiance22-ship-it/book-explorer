import { sampleBooks, renderBooks, updateFavoriteButton } from "./ui.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite
} from "./favorites.js";

const bookGrid = document.querySelector("#book-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const emptyMessage = document.querySelector("#empty-message");
const clearSearchButton = document.querySelector("#clear-search");
const resultsStatus = document.querySelector("#results-status");
const favoritesCount = document.querySelector("#favorites-count");
const categoryButtons = document.querySelectorAll("[data-category]");

let activeCategory = "all";
let searchTerm = "";

function updateFavoritesCount() {
  favoritesCount.textContent = getFavorites().length;
}

function getVisibleBooks() {
  return sampleBooks.filter((book) => {
    const searchableText = `${book.title} ${book.author}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesCategory =
      activeCategory === "all" ||
      book.categories.includes(activeCategory);

    return matchesSearch && matchesCategory;
  });
}

function updateCategoryButtons() {
  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === activeCategory;

    button.setAttribute("aria-pressed", String(isActive));

    button.className = isActive
      ? "rounded-full bg-purple-800 px-5 py-2 text-sm font-semibold text-white"
      : "rounded-full border border-purple-200 bg-white px-5 py-2 text-sm text-purple-800 hover:bg-purple-100";
  });
}

function renderHomepage() {
  const visibleBooks = getVisibleBooks();

  renderBooks(bookGrid, visibleBooks);

  emptyMessage.classList.toggle("hidden", visibleBooks.length > 0);

  if (visibleBooks.length === 0) {
    bookGrid.replaceChildren();
  }

  resultsStatus.textContent =
    `${visibleBooks.length} ${visibleBooks.length === 1 ? "book" : "books"} found`;

  updateCategoryButtons();
  updateFavoritesCount();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  searchTerm = searchInput.value.trim().toLowerCase();

  renderHomepage();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();

  renderHomepage();
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    renderHomepage();
  });
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  activeCategory = "all";

  renderHomepage();
});

bookGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");

  if (!button) {
    return;
  }

  const bookId = button.dataset.favoriteId;

  const selectedBook = sampleBooks.find(
    (book) => String(book.id) === String(bookId)
  );

  if (!selectedBook) {
    return;
  }

  if (isFavorite(bookId)) {
    removeFavorite(bookId);
  } else {
    addFavorite(selectedBook);
  }

  updateFavoriteButton(button, isFavorite(bookId));
  updateFavoritesCount();
});

renderHomepage();