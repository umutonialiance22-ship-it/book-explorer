import {
  getFavorites,
  removeFavorite
} from "./favorites.js";

import {
  renderBooks,
  updateFavoriteButton
} from "./ui.js";

const favoritesGrid = document.querySelector("#favorites-grid");
const emptyFavorites = document.querySelector("#empty-favorites");
const favoritesStatus = document.querySelector("#favorites-status");

function renderFavoritesPage() {
  const favorites = getFavorites();

  renderBooks(favoritesGrid, favorites, {
    showFavorites: true,
    emptyMessage: "Your collection is empty."
  });

  const hasFavorites = favorites.length > 0;

  emptyFavorites.classList.toggle("hidden", hasFavorites);
  favoritesGrid.classList.toggle("hidden", !hasFavorites);

  favoritesStatus.textContent =
    `${favorites.length} saved ${favorites.length === 1 ? "book" : "books"}`;
}

favoritesGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");

  if (!button) {
    return;
  }

  removeFavorite(button.dataset.favoriteId);

  renderFavoritesPage();
});

renderFavoritesPage();