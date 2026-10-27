import { isFavorite } from "./favorites.js";

const HEART_OUTLINE = `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.6 3 5 6.5 5c2 0 3.7 1.1 5.5 3 1.8-1.9 3.5-3 5.5-3C21 5 22.8 8.6 21.5 11.7 19.5 16.4 12 21 12 21z"/></svg>`;
const HEART_FILLED = HEART_OUTLINE.replace('fill="none"', 'fill="currentColor"');
const ARROW = `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

const CATEGORY_LABELS = {
  romantasy: "Romantasy",
  romance: "Romance",
  fantasy: "Fantasy",
  "young-adult": "Young Adult",
  "new-releases": "New"
};

const GRADIENTS = [
  "from-purple-900 to-pink-700",
  "from-indigo-900 to-purple-600",
  "from-rose-900 to-purple-800",
  "from-emerald-900 to-indigo-800"
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function updateFavoriteButton(button, active, mode = "browse") {
  const label = mode === "favorites" ? "Remove" : active ? "Saved" : "Add to Favorites";

  button.setAttribute("aria-pressed", String(active));
  button.innerHTML = `${active ? HEART_FILLED : HEART_OUTLINE}<span>${label}</span>`;
  button.className = active
    ? "inline-flex items-center gap-2 rounded-lg border border-purple-800 bg-purple-800 px-3 py-2 text-xs font-medium text-white hover:bg-purple-900"
    : "inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-3 py-2 text-xs font-medium text-purple-800 hover:bg-purple-50";
}

function createPlaceholder(book) {
  const gradient = GRADIENTS[(book.title || "").length % GRADIENTS.length];
  const box = el(
    "div",
    `flex h-full w-40 flex-col items-center justify-center gap-3 rounded-md bg-gradient-to-br ${gradient} p-4 text-center text-white shadow-md`
  );
  box.append(
    el("span", "text-2xl text-pink-200", "✦"),
    el("span", "font-serif text-lg font-bold leading-tight", book.title),
    el("span", "text-xs uppercase tracking-widest text-purple-200", book.author)
  );
  return box;
}

function createCover(book) {
  const wrapper = el("div", "flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-purple-50 p-3");

  if (book.coverUrl) {
    const img = el("img", "h-full w-auto max-w-full rounded-xl object-contain shadow-md");
    img.src = book.coverUrl;
    img.alt = `Cover of ${book.title}`;
    img.loading = "lazy";
    img.addEventListener("error", () => img.replaceWith(createPlaceholder(book)));
    wrapper.append(img);
  } else {
    wrapper.append(createPlaceholder(book));
  }

  return wrapper;
}

function createCard(book, mode) {
  const card = el(
    "article",
    "flex min-w-0 flex-col rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:shadow-lg"
  );

  card.append(createCover(book));
  card.append(el("h3", "mt-4 line-clamp-2 font-serif text-lg font-bold text-purple-950", book.title));
  card.append(el("p", "mt-1 truncate text-sm text-slate-500", book.author));
  card.append(el("p", "mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600", book.description));

  const tags = el("div", "mt-4 flex flex-wrap gap-2");
  (book.categories || [])
    .filter((c) => CATEGORY_LABELS[c])
    .slice(0, 2)
    .forEach((c) => {
      tags.append(el("span", "rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-800", CATEGORY_LABELS[c]));
    });
  card.append(tags);

  const actions = el("div", "mt-auto flex flex-wrap items-center justify-between gap-2 pt-5");

  const favButton = document.createElement("button");
  favButton.type = "button";
  favButton.dataset.favoriteId = book.id;
  updateFavoriteButton(favButton, mode === "favorites" ? true : isFavorite(book.id), mode);

  const details = el("a", "inline-flex items-center gap-1 text-xs font-semibold text-purple-800 hover:text-purple-950");
  details.href = book.link || `https://openlibrary.org${book.id}`;
  details.target = "_blank";
  details.rel = "noopener noreferrer";
  details.innerHTML = `View Details ${ARROW}`;

  actions.append(favButton, details);
  card.append(actions);

  return card;
}

export function renderBooks(container, books, mode = "browse") {
  container.replaceChildren(...books.map((book) => createCard(book, mode)));
}