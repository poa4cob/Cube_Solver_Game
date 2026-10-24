# Twist Lab

A small browser game for practicing a 3×3 Rubik's Cube. Rotate the 3D cube, try turns yourself, generate a scramble, or ask the solver for the next moves.

## Run the game

From this folder, install the packages and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173/`.

## Deploy

The GitHub Actions workflow builds and deploys the app to GitHub Pages whenever
you push to `main`. Before the first deployment, open the repository's
**Settings → Pages** and set **Build and deployment → Source** to **GitHub
Actions**.

To open the running app after a deployment:

1. Open the repository on GitHub and select **Actions**.
2. Select the completed **Build and deploy to GitHub Pages** workflow run for
   your push.
3. On the run's summary page, select the **github-pages** deployment link (or
   the **github-pages** environment). This opens the published app.

You can also find the URL under **Settings → Pages**. The deployment may take a
few minutes to finish after pushing to `main`.

## Play

- Drag the cube to change the viewing angle.
- Use the face buttons to make clockwise or counterclockwise turns.
- Select **New scramble** to mix the cube.
- Select **Find a solution**, then use the arrow button to apply each suggested turn.
- Select **Reset cube** to return to the solved position.

The 3D puzzle, scramble generator, and 3×3 solver are powered by [cubing.js](https://js.cubing.net/cubing/).