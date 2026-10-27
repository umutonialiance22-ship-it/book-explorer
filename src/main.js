import { fetchBooks } from "./fetchBooks.js";

import {
  renderBooks,
  updateFavoriteButton
} from "./ui.js";

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

let books = [];
let activeCategory = "all";
let searchRequest = 0;

function updateFavoritesCount() {
  if (favoritesCount) {
    favoritesCount.textContent = getFavorites().length;
  }
}

function getVisibleBooks() {
  return books.filter((book) => {
    if (activeCategory === "all") {
      return true;
    }

    return (book.categories || []).includes(activeCategory);
  });
}

function updateCategoryButtons() {
  categoryButtons.forEach((button) => {
    const active = button.dataset.category === activeCategory;

    button.setAttribute("aria-pressed", String(active));

    button.className = active
      ? "rounded-full bg-purple-800 px-5 py-2 text-sm font-semibold text-white"
      : "rounded-full border border-purple-200 bg-white px-5 py-2 text-sm text-purple-800 hover:bg-purple-100";
  });
}

function renderHomepage() {
  const visibleBooks = getVisibleBooks();

  renderBooks(bookGrid, visibleBooks);

  const hasBooks = visibleBooks.length > 0;

  emptyMessage.classList.toggle("hidden", hasBooks);

  if (!hasBooks) {
    bookGrid.replaceChildren();
  }

  resultsStatus.textContent =
    `${visibleBooks.length} ${visibleBooks.length === 1 ? "book" : "books"} found`;

  updateCategoryButtons();
  updateFavoritesCount();
}

async function loadBooks(query = "fantasy romance") {
  const currentRequest = ++searchRequest;

  resultsStatus.textContent = "Searching the enchanted library...";
  emptyMessage.classList.add("hidden");

  bookGrid.replaceChildren();

  const loadingMessage = document.createElement("p");

  loadingMessage.className =
    "col-span-full py-12 text-center text-purple-800";

  loadingMessage.textContent = "Discovering magical stories...";

  bookGrid.append(loadingMessage);

  try {
    const results = await fetchBooks(query);

    if (currentRequest !== searchRequest) {
      return;
    }

    books = results;
    renderHomepage();

    if (books.length === 0) {
      resultsStatus.textContent = "No matching fantasy or romance books were found.";
    }
  } catch (error) {
    if (currentRequest !== searchRequest) {
      return;
    }

    console.error("Book loading error:", error);

    books = [];
    bookGrid.replaceChildren();
    emptyMessage.classList.remove("hidden");

    const heading = emptyMessage.querySelector("p");

    if (heading) {
      heading.textContent =
        "We couldn't load the library. Please check your connection and try again.";
    }

    resultsStatus.textContent = "Unable to connect to the book service.";

    const retryButton = document.createElement("button");

    retryButton.type = "button";
    retryButton.textContent = "Try Again";
    retryButton.className =
      "mt-4 rounded-lg bg-purple-800 px-5 py-2 text-white hover:bg-purple-950";

    retryButton.addEventListener("click", () => loadBooks(query));

    emptyMessage.append(retryButton);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  activeCategory = "all";

  const query = searchInput.value.trim() || "fantasy romance";

  loadBooks(query);
});

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    activeCategory = "all";
    loadBooks("fantasy romance");
  }
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    renderHomepage();
  });
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "all";

  loadBooks("fantasy romance");
});

bookGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");

  if (!button) {
    return;
  }

  const bookId = button.dataset.favoriteId;

  const selectedBook = books.find(
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

loadBooks();