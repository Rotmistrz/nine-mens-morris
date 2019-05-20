Coordinates.Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.getX = function() {
        return this.x;
    }

    this.setX = function(x) {
        this.x = x;

        return this;
    }

    this.getY = function() {
        return this.y;
    }

    this.setY = function(y) {
        this.y = y;

        return this;
    }

    this.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
    }

    this.equals = function(another) {
        return this.getX() == another.getX() && this.getY() == another.getY();
    }

    this.equalsTo = function(x, y) {
        return this.getX() == x && this.getY() == y;
    }
}