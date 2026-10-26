import { isFavorite } from "./favorites.js";

export const sampleBooks = [
  {
    id: "court-of-thorns-and-roses",
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    description: "A mortal huntress enters a dangerous faerie world filled with ancient magic, secrets, and unexpected romance.",
    categories: ["fantasy", "romance", "romantasy"],
    theme: "from-indigo-950 via-purple-900 to-pink-800"
  },
  {
    id: "fourth-wing",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    description: "A young woman enters a brutal dragon-rider academy where survival, rivalries, and attraction collide.",
    categories: ["fantasy", "romance", "romantasy"],
    theme: "from-slate-950 via-slate-800 to-blue-900"
  },
  {
    id: "the-cruel-prince",
    title: "The Cruel Prince",
    author: "Holly Black",
    description: "A mortal girl navigates a treacherous faerie court filled with power struggles, deception, and complicated loyalties.",
    categories: ["fantasy", "young-adult"],
    theme: "from-emerald-950 via-green-900 to-rose-900"
  },
  {
    id: "once-upon-a-broken-heart",
    title: "Once Upon a Broken Heart",
    author: "Stephanie Garber",
    description: "A desperate bargain with a mysterious immortal leads to a fairytale adventure where love comes at a price.",
    categories: ["fantasy", "romance", "romantasy", "young-adult"],
    theme: "from-rose-950 via-fuchsia-900 to-purple-800"
  },
  {
    id: "serpent-and-dove",
    title: "Serpent & Dove",
    author: "Shelby Mahurin",
    description: "A witch and a witch hunter are forced into an unexpected marriage in a world where magic can cost everything.",
    categories: ["fantasy", "romance", "romantasy", "young-adult"],
    theme: "from-red-950 via-rose-900 to-orange-800"
  },
  {
    id: "irregular-witches",
    title: "The Very Secret Society of Irregular Witches",
    author: "Sangu Mandanna",
    description: "A solitary witch finds a found family, a mysterious household, and a romance that challenges her lonely life.",
    categories: ["fantasy", "romance"],
    theme: "from-teal-950 via-emerald-900 to-purple-900"
  },
  {
    id: "the-bridge-kingdom",
    title: "The Bridge Kingdom",
    author: "Danielle L. Jensen",
    description: "A princess trained as a spy marries an enemy king, but her mission becomes complicated when feelings emerge.",
    categories: ["fantasy", "romance", "romantasy"],
    theme: "from-amber-950 via-orange-900 to-red-900"
  },
  {
    id: "powerless",
    title: "Powerless",
    author: "Lauren Roberts",
    description: "In a kingdom that prizes magical abilities, an ordinary girl must hide her secret while navigating a dangerous royal world.",
    categories: ["fantasy", "romance", "romantasy", "young-adult"],
    theme: "from-slate-950 via-violet-950 to-pink-900"
  }
];

export function renderBooks(container, books, options = {}) {
  const {
    emptyMessage = "No books found. Try another search.",
    showFavorites = true
  } = options;

  container.replaceChildren();

  if (books.length === 0) {
    const message = document.createElement("p");
    message.className = "col-span-full py-12 text-center text-slate-600";
    message.textContent = emptyMessage;
    container.append(message);
    return;
  }

  books.forEach((book) => {
    const card = document.createElement("article");

    card.className =
      "flex flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

    const cover = document.createElement("div");
    cover.className =
      `mb-4 flex min-h-48 items-center justify-center rounded-xl bg-gradient-to-br ${book.theme || "from-purple-900 to-indigo-900"} p-5 text-center`;

    const coverTitle = document.createElement("p");
    coverTitle.className = "text-xl font-bold text-white";
    coverTitle.textContent = book.title;
    cover.append(coverTitle);

    const title = document.createElement("h3");
    title.className = "text-lg font-bold text-purple-950";
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "mt-1 text-sm text-purple-600";
    author.textContent = book.author || "Author unknown";

    const description = document.createElement("p");
    description.className = "mt-3 flex-1 text-sm leading-relaxed text-slate-600";
    description.textContent = book.description || "Discover this story and its magical world.";

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

    card.append(cover, title, author, description, categoryContainer);

    if (showFavorites) {
      const favoriteButton = document.createElement("button");

      favoriteButton.type = "button";
      favoriteButton.dataset.favoriteId = String(book.id);
      favoriteButton.className =
        "mt-5 w-full rounded-lg border border-purple-300 px-4 py-2 font-semibold text-purple-800 hover:bg-purple-50";

      updateFavoriteButton(favoriteButton, isFavorite(book.id));

      card.append(favoriteButton);
    }

    container.append(card);
  });
}

export function updateFavoriteButton(button, saved) {
  button.textContent = saved ? "Remove from Favorites" : "Add to Favorites";
  button.setAttribute("aria-pressed", String(saved));
}