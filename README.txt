Chess Arena – Mini Project

This folder contains a complete web-based chess mini project:

- index.html      : Welcome page with typewriter animation
- auth.html       : Login / Sign Up
- dashboard.html  : Main dashboard after login
- chess.html      : Play vs basic robot (simplified chess engine)
- rankings.html   : Rating / ranking leaderboard
- styles.css      : Global styling
- firebase-config.js : Firebase project config (fill with your own keys)
- auth.js         : Sign up + login logic (Firestore)
- dashboard.js    : Load user, show rating, navigation
- chess.js        : Simple chess engine + robot opponent + rating updates
- rankings.js     : Leaderboard by global / country / state / city / institute

How to run (for demo):

1. Create a Firebase project (Firestore, Web app).
2. Copy your Firebase config into firebase-config.js.
3. Open index.html with Live Server (VS Code) or host on any static hosting.
4. Sign up a user.
5. Go to "Play vs Robot" to play and change rating.
6. Check rankings page to view leaderboard.
