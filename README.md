# Deal Estimation (PWA + Multiplayer + Voice Chat)

A Monopoly Deal-inspired tabletop card game styled after Pocket Estimation, supporting 2–6 players, customizable 3–6 completed set victory rules, automatic deck reshuffling, real-time WebSocket multiplayer rooms, and WebRTC voice chat.

## Quick Local Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3001` in your browser.

## Free Cloud Deployment (Render.com)
1. Upload all files in this repository to GitHub.
2. Create a new **Web Service** on Render connected to your GitHub repo:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. Open your live HTTPS URL on Android (Chrome) or iPhone (Safari) and tap **Add to Home Screen** for full-screen landscape play.
