// Mars robot thing
// TODO: maybe add more error handling later

const leftMap = {
    N: "W",
    W: "S",
    S: "E",
    E: "N",
};

const rightMap = {
    N: "E",
    E: "S",
    S: "W",
    W: "N",
};

// dx, dy for each direction
const delta = {
    N: [0, 1],
    E: [1, 0],
    S: [0, -1],
    W: [-1, 0],
};

// world grid with scents
class WorldGrid {
    constructor(maxX, maxY) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.scents = new Set(); // store "x,y,dir" strings
    }

    inside(x, y) {
        return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
    }

    hasScent(x, y, dir) {
        return this.scents.has(`${x},${y},${dir}`);
    }

    addScent(x, y, dir) {
        this.scents.add(`${x},${y},${dir}`);
    }
}

// robot class
class Robot {
    constructor(x, y, dir, world) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.world = world;
        this.lost = false;
    }

    turnLeft() {
        this.dir = leftMap[this.dir];
    }

    turnRight() {
        this.dir = rightMap[this.dir];
    }

    forward() {
        let [dx, dy] = delta[this.dir];
        let nx = this.x + dx;
        let ny = this.y + dy;

        if (this.world.inside(nx, ny)) {
            this.x = nx;
            this.y = ny;
            return;
        }

        // if there's a scent, ignore the move (don't fall)
        if (this.world.hasScent(this.x, this.y, this.dir)) {
            return;
        }

        // otherwise mark scent and robot is lost
        this.world.addScent(this.x, this.y, this.dir);
        this.lost = true;
    }

    run(instructions) {
        for (let i = 0; i < instructions.length; i++) {
            if (this.lost) break;
            let cmd = instructions[i];
            if (cmd === 'L') this.turnLeft();
            else if (cmd === 'R') this.turnRight();
            else if (cmd === 'F') this.forward();
            // ignore invalid commands (just skip)
        }
    }

    status() {
        let base = `${this.x} ${this.y} ${this.dir}`;
        return this.lost ? base + " LOST" : base;
    }
}

// parse initial position line
function parsePos(line) {
    let parts = line.trim().split(/\s+/);
    return {
        x: parseInt(parts[0]),
        y: parseInt(parts[1]),
        dir: parts[2]
    };
}

// main solve function
function solve(input) {
    let lines = input.trim().split(/\r?\n/);
    // remove empty lines
    lines = lines.filter(l => l.trim().length > 0);
    if (lines.length === 0) return "";

    let first = lines[0].split(/\s+/);
    let maxX = parseInt(first[0]);
    let maxY = parseInt(first[1]);
    let world = new WorldGrid(maxX, maxY);

    let results = [];

    // process each robot (two lines per robot)
    for (let i = 1; i < lines.length; i += 2) {
        let posLine = lines[i];
        let instrLine = lines[i + 1];
        if (!posLine || !instrLine) continue; // skip incomplete

        let { x, y, dir } = parsePos(posLine);
        let bot = new Robot(x, y, dir, world);
        bot.run(instrLine);
        results.push(bot.status());
    }

    return results.join("\n");
}

// DOM stuff - quick and dirty
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const testBtn = document.getElementById("testButton");

testBtn.addEventListener("click", () => {
    let raw = inputEl.value;
    let out = solve(raw);
    outputEl.textContent = out;
});