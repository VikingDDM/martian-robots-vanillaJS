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