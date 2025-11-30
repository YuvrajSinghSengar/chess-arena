Chess Arena – Mini Project (v3)

This folder contains a complete web mini-project for a chess platform.

Main features:

- Welcome page with typewriter intro text.
- Login / Sign Up with hierarchical dropdowns:
  Country → State → City/District → Locality → Institute.
  (Pre-filled with India (Uttar Pradesh, Kanpur + others) and a few other countries.)
- Dashboard showing user name and rating (starts at 1000).
- Play vs Robot:
  * Chess.com-style board colours.
  * Official-like piece movement for all pieces.
  * Pawns move 1 or 2 steps from start, capture diagonally, basic promotion.
  * Robot plays simple but legal moves.
  * Rating changes automatically:
      win +20, loss -20, draw +5, quit in the middle -15.
- Learn section:
  * Multiple lessons with content opened in a new page.
  * Per-user completion tracking stored in Firestore.
- Play Online:
  * Finds a random opponent near your rating.
  * Shows top players table.
- Play with Friends:
  * Host a room (friendly or rated) with a unique 6-digit code.
  * Friend can join using that code.
  * Rooms stored in Firestore; board is separate (you can play on the Robot board or any board).
- Host Tournament Game:
  * Organiser generates a match code.
  * Two players register as White and Black using the code.
  * Host can see both players and their ratings (no rating changes, tournament style).
- AI Chess Guide:
  * Generates training advice based on rating.
  * Shows sample positions on a board with hints for best move.
- Rankings:
  * View top players globally or filtered by country/state/city/institute with ratings.

How to run:

1. Create a Firebase project, enable Firestore Database (test mode).
2. In the Firebase console create a Web app and copy the config.
3. Paste the config into firebase-config.js (replace the YOUR_* placeholders).
4. Host this folder on GitHub Pages, Netlify, or run a simple static server and open index.html.

