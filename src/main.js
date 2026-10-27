import { fetchBooks } from "./fetchBooks.js";
import { featuredBooks } from "./featuredbooks.js";
import { renderBooks, updateFavoriteButton } from "./ui.js";
import { getFavorites, addFavorite, removeFavorite, isFavorite } from "./favorites.js";

const DEFAULT_QUERY = "fantasy romance";

const bookGrid = document.querySelector("#book-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const emptyMessage = document.querySelector("#empty-message");
const emptyText = emptyMessage.querySelector("p");
const clearSearchButton = document.querySelector("#clear-search");
const resultsStatus = document.querySelector("#results-status");
const favoritesCount = document.querySelector("#favorites-count");
const categoryButtons = document.querySelectorAll("[data-category]");

const EMPTY_DEFAULT_TEXT = emptyText.textContent;

let books = [];
let activeCategory = "all";
let searchRequest = 0;

function updateFavoritesCount() {
  if (favoritesCount) {
    favoritesCount.textContent = getFavorites().length;
  }
}

function getVisibleBooks() {
  return books.filter(
    (book) => activeCategory === "all" || (book.categories || []).includes(activeCategory)
  );
}

function updateCategoryButtons() {
  categoryButtons.forEach((button) => {
    const active = button.dataset.category === activeCategory;
    button.setAttribute("aria-pressed", String(active));
    button.className = active
      ? "rounded-full bg-purple-800 px-4 py-2 text-sm font-semibold text-white"
      : "rounded-full border border-purple-200 bg-white px-4 py-2 text-sm text-purple-800 hover:bg-purple-100";
  });
}

function removeRetryButton() {
  emptyMessage.querySelector("[data-retry]")?.remove();
}

function renderHomepage() {
  const visibleBooks = getVisibleBooks();
  const hasBooks = visibleBooks.length > 0;

  renderBooks(bookGrid, visibleBooks);

  removeRetryButton();
  emptyText.textContent = EMPTY_DEFAULT_TEXT;
  emptyMessage.classList.toggle("hidden", hasBooks);

  resultsStatus.textContent = hasBooks
    ? `${visibleBooks.length} ${visibleBooks.length === 1 ? "book" : "books"} found`
    : "No matching books were found.";

  updateCategoryButtons();
  updateFavoritesCount();
}

function mergeWithFeatured(query, apiResults) {
  const q = query.toLowerCase();
  const isDefault = query === DEFAULT_QUERY;

  const featuredMatches = featuredBooks.filter(
    (book) => isDefault || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
  );

  const others = apiResults.filter(
    (r) => !featuredMatches.some((f) => f.title.toLowerCase() === r.title.toLowerCase())
  );

  return [...featuredMatches, ...others];
}

async function loadBooks(query = DEFAULT_QUERY) {
  const currentRequest = ++searchRequest;

  resultsStatus.textContent = "Searching the enchanted library...";
  emptyMessage.classList.add("hidden");
  bookGrid.replaceChildren();

  const loadingMessage = document.createElement("p");
  loadingMessage.className = "col-span-full py-12 text-center text-purple-800";
  loadingMessage.textContent = "Discovering magical stories...";
  bookGrid.append(loadingMessage);

  try {
    const results = await fetchBooks(query);
    if (currentRequest !== searchRequest) return;

    books = mergeWithFeatured(query, results);
    renderHomepage();
  } catch (error) {
    if (currentRequest !== searchRequest) return;

    console.error("Book loading error:", error);

    // The API failed, but your featured books can still show.
    books = mergeWithFeatured(query, []);

    if (books.length > 0) {
      renderHomepage();
      resultsStatus.textContent = `${resultsStatus.textContent} (online results unavailable)`;
      return;
    }

    bookGrid.replaceChildren();
    emptyMessage.classList.remove("hidden");
    emptyText.textContent = "We couldn't load the library. Please check your connection and try again.";
    resultsStatus.textContent = "Unable to connect to the book service.";

    removeRetryButton();
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.dataset.retry = "true";
    retryButton.textContent = "Try Again";
    retryButton.className = "mt-4 rounded-lg bg-purple-800 px-5 py-2 text-white hover:bg-purple-950";
    retryButton.addEventListener("click", () => loadBooks(query));
    emptyMessage.append(retryButton);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activeCategory = "all";
  loadBooks(searchInput.value.trim() || DEFAULT_QUERY);
});

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    activeCategory = "all";
    loadBooks(DEFAULT_QUERY);
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
  loadBooks(DEFAULT_QUERY);
});

bookGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");
  if (!button) return;

  const bookId = button.dataset.favoriteId;
  const selectedBook = books.find((book) => String(book.id) === String(bookId));
  if (!selectedBook) return;

  if (isFavorite(bookId)) {
    removeFavorite(bookId);
  } else {
    addFavorite(selectedBook);
  }

  updateFavoriteButton(button, isFavorite(bookId));
  updateFavoritesCount();
});

loadBooks();