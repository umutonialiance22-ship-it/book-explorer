import { isFavorite } from "./favorites.js";

export function renderBooks(container, books, options = {}) {
  const {
    showFavorites = true
  } = options;

  container.replaceChildren();

  books.forEach((book) => {
    const card = document.createElement("article");

    card.className =
      "flex flex-col overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl";

    const coverContainer = document.createElement("div");

    coverContainer.className =
      "flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-950 via-purple-800 to-pink-800";

    if (book.coverUrl) {
      const cover = document.createElement("img");

      cover.src = book.coverUrl;
      cover.alt = `Cover of ${book.title}`;
      cover.loading = "lazy";
      cover.className = "h-full w-full object-contain";
      cover.referrerPolicy = "no-referrer";

      cover.addEventListener("error", () => {
        cover.remove();

        const fallback = document.createElement("div");

        fallback.className =
          "flex h-full w-full items-center justify-center p-6 text-center";

        const fallbackTitle = document.createElement("p");

        fallbackTitle.className = "text-2xl font-bold text-white";
        fallbackTitle.textContent = book.title;

        fallback.append(fallbackTitle);
        coverContainer.append(fallback);
      }, { once: true });

      coverContainer.append(cover);
    } else {
      const fallback = document.createElement("div");

      fallback.className =
        "flex h-full w-full items-center justify-center p-6 text-center";

      const fallbackTitle = document.createElement("p");

      fallbackTitle.className = "text-2xl font-bold text-white";
      fallbackTitle.textContent = book.title;

      fallback.append(fallbackTitle);
      coverContainer.append(fallback);
    }

    const content = document.createElement("div");
    content.className = "flex flex-1 flex-col p-5";

    const title = document.createElement("h3");

    title.className = "text-lg font-bold leading-snug text-purple-950";
    title.textContent = book.title;

    const author = document.createElement("p");

    author.className = "mt-2 text-sm text-purple-600";
    author.textContent = book.author || "Author unknown";

    const description = document.createElement("p");

    description.className =
      "mt-3 flex-1 text-sm leading-relaxed text-slate-600";

    description.textContent =
      book.description || "Discover a new story in the library.";

    content.append(title, author);

    if (book.year) {
      const year = document.createElement("p");

      year.className = "mt-1 text-xs text-slate-500";
      year.textContent = `First published: ${book.year}`;

      content.append(year);
    }

    content.append(description);

    const categoryContainer = document.createElement("div");

    categoryContainer.className = "mt-4 flex flex-wrap gap-2";

    (book.categories || []).forEach((category) => {
      const tag = document.createElement("span");

      tag.className =
        "rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-800";

      tag.textContent = category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      categoryContainer.append(tag);
    });

    content.append(categoryContainer);

    if (showFavorites) {
      const favoriteButton = document.createElement("button");

      favoriteButton.type = "button";
      favoriteButton.dataset.favoriteId = String(book.id);

      favoriteButton.className =
        "mt-5 w-full rounded-lg border border-purple-300 px-4 py-2 font-semibold text-purple-800 transition hover:bg-purple-50";

      updateFavoriteButton(favoriteButton, isFavorite(book.id));

      content.append(favoriteButton);
    }

    card.append(coverContainer, content);
    container.append(card);
  });
}

export function updateFavoriteButton(button, saved) {
  button.textContent = saved
    ? "Remove from Favorites"
    : "Add to Favorites";

  button.setAttribute("aria-pressed", String(saved));
}