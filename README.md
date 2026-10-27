# Enchanted Reads

A responsive, API-powered book discovery app for readers who love fantasy and romance. Browse books, search by title, filter by category, and save your favorites. Built as the Book Explorer capstone project.

## Features

- Responsive Home, Favorites, and About pages (mobile, tablet, desktop)
- Books fetched from the [Open Library API](https://openlibrary.org/developers/api)
- Hand-picked featured books with custom covers
- Search for books by title
- Category filters: All, Romantasy, Fantasy, Young Adult, New Releases
- Add and remove favorites, saved in `localStorage` so they persist after refresh
- Loading, "no results", and error messages with a Try Again button

## Built With

- HTML5
- Tailwind CSS v4
- JavaScript (ES modules, async/await, DOM events)
- Vite
- Open Library API

## Getting Started

```bash
git clone https://github.com/umutonialiance22-ship-it/book-explorer.git
cd book-explorer
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

## Project Structure

```
capstone/
├── index.html           # Home page
├── favorites.html       # Favorites page
├── about.html           # About page
├── public/
│   ├── hero.jpg         # Hero background image
│   └── covers/          # Custom book covers
└── src/
    ├── main.js          # Home page logic (search, filters, favorites)
    ├── favoritespage.js # Favorites page logic
    ├── about.js         # Favorites counter for the About page
    ├── fetchBooks.js    # API module (fetch + async/await)
    ├── featuredBooks.js # Featured books with custom covers
    ├── favorites.js     # Add/remove/check favorites (localStorage)
    ├── ui.js            # Book card rendering
    └── style.css        # Tailwind import and small custom styles
```

## How It Works

- `fetchBooks.js` calls the Open Library search endpoint and turns the results into book objects, keeping only fantasy and romance books that have covers.
- `favorites.js` exports `getFavorites`, `addFavorite`, `removeFavorite`, and `isFavorite`, all backed by `localStorage`.
- `main.js` combines the featured books with API results and handles searching, filtering, and favorite clicks.
- `ui.js` builds the book cards using safe DOM methods (`textContent`) instead of `innerHTML` for API data.

## Git Workflow

Work was done on feature branches (`feature/search`, `feature/ui-redesign`, `feature/covers-and-hero`) and merged through pull requests. Tasks were tracked with GitHub Projects and Issues.

## Author

Umutoni Aliance
- GitHub: [umutonialiance22-ship-it](https://github.com/umutonialiance22-ship-it)
