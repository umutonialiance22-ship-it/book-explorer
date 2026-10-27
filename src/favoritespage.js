import {
  getFavorites,
  removeFavorite
} from "./favorites.js";

import { renderBooks } from "./ui.js";

const favoritesGrid = document.querySelector("#favorites-grid");
const emptyFavorites = document.querySelector("#empty-favorites");
const favoritesStatus = document.querySelector("#favorites-status");

function renderFavorites() {
  const favorites = getFavorites();

  renderBooks(favoritesGrid, favorites);

  const hasFavorites = favorites.length > 0;

  emptyFavorites.classList.toggle("hidden", hasFavorites);

  favoritesStatus.textContent = hasFavorites
    ? `${favorites.length} saved ${favorites.length === 1 ? "book" : "books"}`
    : "Your favorites collection is empty.";
}

favoritesGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");

  if (!button) {
    return;
  }

  const bookId = button.dataset.favoriteId;

  removeFavorite(bookId);

  renderFavorites();
});

renderFavorites();