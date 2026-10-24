# Twist Lab

A small browser game for practicing a 3×3 Rubik's Cube. Rotate the 3D cube, try turns yourself, generate a scramble, or ask the solver for the next moves.

## Run the game

From this folder, install the packages and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173/`.

## Play

- Drag the cube to change the viewing angle.
- Use the face buttons to make clockwise or counterclockwise turns.
- Select **New scramble** to mix the cube.
- Select **Find a solution**, then use the arrow button to apply each suggested turn.
- Select **Reset cube** to return to the solved position.

The 3D puzzle, scramble generator, and 3×3 solver are powered by [cubing.js](https://js.cubing.net/cubing/).