# martian-robots-vanillaJS

A small, dumb robot that walks around a grid on Mars.  
If it falls off the edge, it leaves a "scent" so other robots don’t fall in the same spot.

## What it does

- You give it a world size (e.g., `5 3` means x from 0..5, y from 0..3)
- Each robot starts at some coordinates facing North, East, South, or West
- You give it a string of letters: `L` = turn left, `R` = turn right, `F` = move forward
- The robot moves until it either finishes its instructions or falls off (LOST)

## How to run

Just open `index.html` in your browser.  
Paste input into the text box, click "Run", and the output appears below.

## Example

**Input:**
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL

**Output:**
1 1 E
3 3 N LOST
2 3 S

## Notes

- Worlds are small (no fancy graphics)
- Scents are per‑cell and per‑direction – robots remember where others fell
- If a robot is about to fall but a scent exists, it just ignores that move and stays put