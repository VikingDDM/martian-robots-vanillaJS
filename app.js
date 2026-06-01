const leftMap = { N: "W", W: "S", S: "E", E: "N" };
const rightMap = { N: "E", E: "S", S: "W", W: "N" };
const delta = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] };

class World {
    constructor(maxX, maxY) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.scents = new Set();
    }
    inside(x, y) { return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY; }
    hasScent(x, y, dir) { return this.scents.has(`${x},${y},${dir}`); }
    addScent(x, y, dir) { this.scents.add(`${x},${y},${dir}`); }
}

class Robot {
    constructor(x, y, dir, world) {
        this.x = x; this.y = y; this.dir = dir;
        this.world = world; this.lost = false;
    }
    turnLeft() { this.dir = leftMap[this.dir]; }
    turnRight() { this.dir = rightMap[this.dir]; }
    forward() {
        let [dx, dy] = delta[this.dir];
        let nx = this.x + dx, ny = this.y + dy;
        if (this.world.inside(nx, ny)) {
            this.x = nx; this.y = ny;
            return;
        }
        if (this.world.hasScent(this.x, this.y, this.dir)) return;
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
        }
    }
    status() {
        let base = `${this.x} ${this.y} ${this.dir}`;
        return this.lost ? base + " LOST" : base;
    }
}

function parsePos(line) {
    let parts = line.trim().split(/\s+/);
    return { x: parseInt(parts[0]), y: parseInt(parts[1]), dir: parts[2] };
}

function solve(input) {
    let lines = input.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return "";
    let [maxX, maxY] = lines[0].split(/\s+/).map(Number);
    let world = new World(maxX, maxY);
    let results = [];
    for (let i = 1; i < lines.length; i += 2) {
        let posLine = lines[i], instrLine = lines[i + 1];
        if (!posLine || !instrLine) continue;
        let { x, y, dir } = parsePos(posLine);
        let bot = new Robot(x, y, dir, world);
        bot.run(instrLine);
        results.push(bot.status());
    }
    return results.join("\n");
}