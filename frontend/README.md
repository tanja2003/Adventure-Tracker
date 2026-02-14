# adventure-tracker — Frontend

Overview
- This folder contains the adventure-tracker frontend built with Create React App. The UI provides trip overview, TODO management, calendar views, and an interactive map for markers and photos.

Requirements
- Node.js (14+) and npm
- Backend running at `http://localhost:5000` (see `../backend`)

Development
1. Install dependencies:

	npm install

2. Start the dev server:

	npm start

3. Open the app: http://localhost:3000

Notes
- The frontend expects an API at `http://localhost:5000` for authentication, todos, events and markers. JWT tokens are stored in `localStorage` under the key `token`.
- To change the backend URL, update fetch calls in the source or configure a proxy in `package.json`.

Build
- `npm run build` creates an optimized production build in the `build/` folder.

Questions or contributions
- Open an issue or submit a pull request. Describe steps to reproduce and expected behavior.
