# Safe Harbor — Homeless-Assistance

A webapp to help elderly people and women facing homelessness find shelter, food,
health care, and legal resources — plus a simple form to request help directly.

## Features

- Browse resources by category (shelter, women's safety, elderly support, food, health, legal aid)
- Search by name or area
- "Ask us directly" form that saves help requests for volunteers to follow up on
- Accessible, mobile-friendly design (keyboard focus states, reduced-motion support)

## Tech stack

- Node.js + Express (backend, serves a small JSON API)
- Vanilla HTML/CSS/JS (frontend, no build step needed)
- Data stored in local JSON files (`data/resources.json`, `data/help-requests.json`) — no database setup required to get started

## Running it locally

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

## Project structure

```
homeless-assistance/
├── server.js              # Express server + API routes
├── data/
│   └── resources.json     # Editable list of shelters/resources
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
└── README.md
```

## Editing resources

Add or update entries in `data/resources.json`. Each resource needs:

```json
{
  "id": "unique-id",
  "name": "Resource name",
  "category": "shelter | women | elderly | food | health | legal",
  "city": "City",
  "description": "Short description",
  "hours": "Opening hours",
  "phone": "Phone number",
  "address": "Address"
}
```

## Pushing this to your GitHub repo

Since your repo (`Homeless-Assistance`) is already created on GitHub, from inside
this project folder run:

```bash
git init
git add .
git commit -m "Initial commit: Safe Harbor resource directory app"
git branch -M main
git remote add origin https://github.com/<your-username>/Homeless-Assistance.git
git push -u origin main
```

(Replace `<your-username>` with your GitHub username. If the remote already exists,
skip `git remote add origin` and just run `git push -u origin main`.)

## Roadmap ideas

- Admin view to manage/approve resource listings
- Map view of nearby resources
- SMS-based help request option for people without internet access
- Multi-language support
