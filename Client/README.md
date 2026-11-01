# Client — Tender Management + CRM

This is one React/Vite client containing two separate modules:

- `src/tenders/` — Tender Management UI and its page/component styles.
- `src/tickets/` — CRM / Support Ticket UI and its page/component styles.

The modules share only the Vite entry point, React Router history, and a small document reset. Their CSS is kept separate:

- `src/tenders/tenders.css` is scoped under `.tenders-app`.
- `src/tickets/tickets.css` is scoped under `.tickets-app`.
- Existing component/page CSS files remain next to their components.

The CRM selectors for generic elements such as `button`, `input`, `body`, headings, `.card`, and `.topbar` have been scoped to `.tickets-app`. They no longer style Tender Management pages.

## Run the frontend

From this `Client` folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The Tender Management home page is the module selector. Choose **مدیریت مناقصات** for the tender pages or **مدیریت ارتباط با مشتری** for CRM. The CRM header includes **انتخاب ماژول** to return to the selector.

## Backend connections

Run both backends separately:

| Module | Backend address | Vite path |
|---|---|---|
| Tender Management | `http://localhost:5046` | `/api` |
| CRM / SupportTicketSystem | `http://localhost:5237` | `/crm-api` (rewritten to `/api` by Vite) |

The `.env` file contains:

```env
VITE_API_URL=/api
VITE_CRM_API_URL=/crm-api
VITE_DEFAULT_USER_ROLE_ID=1
```

`vite.config.js` proxies each prefix to the correct backend. This avoids browser CORS calls between the frontend and either backend during local development.

If either backend uses a different port, update the matching proxy target in `vite.config.js` and restart Vite.

## Source structure

```text
Client/
  public/
  src/
    App.jsx
    main.jsx
    index.css
    tenders/
      api/
      components/
      layouts/
      pages/
      routes/
      tenders.css
    tickets/
      api.js
      auth.js
      components/
      constants/
      pages/
      theme.js
      tickets.css
      transferText.js
  .env
  package.json
  vite.config.js
```

The CRM and Tender Management authentication data remain separate: Tender Management stores its current user in `sessionStorage`; CRM stores its user/token in `localStorage`.
