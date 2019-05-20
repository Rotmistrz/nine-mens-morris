NineMensMorris.MillWalker = function() {
    this.fields = [];
    this.dimension = NineMensMorris.Constants.MILL_BOARD_DIMENSION;

    for (var i = 0; i < this.dimension; i++) {
        this.fields[i] = [];

        for (var j = 0; j < this.dimension; j++) {
            this.fields[i][j] = false;
        }
    }

    this.fields[0][0] = true;
    this.fields[0][3] = true;
    this.fields[0][6] = true;

    this.fields[1][1] = true;
    this.fields[1][3] = true;
    this.fields[1][5] = true;

    this.fields[2][2] = true;
    this.fields[2][3] = true;
    this.fields[2][4] = true;

    this.fields[3][0] = true;
    this.fields[3][1] = true;
    this.fields[3][2] = true;
    this.fields[3][4] = true;
    this.fields[3][5] = true;
    this.fields[3][6] = true;

    this.fields[4][2] = true;
    this.fields[4][3] = true;
    this.fields[4][4] = true;

    this.fields[5][1] = true;
    this.fields[5][3] = true;
    this.fields[5][5] = true;

    this.fields[6][0] = true;
    this.fields[6][3] = true;
    this.fields[6][6] = true;

    this.goToRow = function(row) {
        this.x = row;
        this.y = 0;

        return this.forward();
    }

    this.isFieldAllowed = function(point) {
        return this.fields[this.getIndex(point.getX())][this.getIndex(point.getY())];
    }

    this.forward = function() {
        var result = null;

        if (!this.isRowEnded()) {
            this.y++;

            result = new Coordinates.Point(this.x, this.y);

            if (!this.isFieldAllowed(result)) {
                return this.forward();
            } else {
                return result;
            }
        } else if (!this.isColumnEnded()) {
            this.x++;
            this.y = 1;

            result = new Coordinates.Point(this.x, this.y);

            if (!this.isFieldAllowed(result)) {
                return this.forward();
            } else {
                return result;
            }
        } else {
            return result;
        }
    }

    this.backward = function() {
        var result = null;

        if (!this.isRowStarted()) {
            this.y--;

            result = Coordinates.Point(this.x, this.y);

            if (!this.isFieldAllowed(result)) {
                return this.backward();
            } else {
                return result;
            }
        } else if (!this.isColumnStarted()) {
            this.x--;
            this.y = this.dimension;

            result = Coordinates.Point(this.x, this.y);

            if (!this.isFieldAllowed(result)) {
                return this.backward();
            } else {
                return result;
            }
        } else {
            return result;
        }
    }


    this.start = function() {
        this.x = 1;
        this.y = 0;

        return this;
    }

    this.end = function() {
        this.x = this.dimension;
        this.y = this.dimension + 1;

        return this;
    }

    this.canForward = function() {
        return this.x < this.dimension || this.y < this.dimension;
    }

    this.canBackward = function() {
        return this.x > 1 || this.y > 1;
    }

    this.isRowEnded = function() {
        return this.y >= this.dimension;
    }

    this.isRowStarted = function() {
        return this.y <= 1;
    }

    this.isColumnEnded = function() {
        return this.x >= this.dimension;
    }

    this.isColumnStarted = function() {
        return this.x <= 1;
    }

    this.getIndex = function(i) {
        return i - 1;
    }


    this.getNeighbours = function(x, y) {
        var neighbours = {};

        neighbours.north = this.getVerticalNeighbour(x, y, -1);
        neighbours.south = this.getVerticalNeighbour(x, y, 1);

        neighbours.west = this.getHorizontalNeighbour(x, y, -1);
        neighbours.east = this.getHorizontalNeighbour(x, y, 1);

        return neighbours;
    }

    this.getHorizontalLine = function(x, y) {
        var east = this.getHorizontalNeighbour(x, y, 1);
        var west = this.getHorizontalNeighbour(x, y, -1);

        var result = [];
        result.push(new Coordinates.Point(x, y));

        if (west != null && east != null) {
            result.push(new Coordinates.Point(east.getX(), east.getY()));
            result.push(new Coordinates.Point(west.getX(), west.getY()));
        } else if (west == null) {
            var eastEast = this.getHorizontalNeighbour(east.getX(), east.getY(), 1);

            result.push(new Coordinates.Point(east.getX(), east.getY()));
            result.push(new Coordinates.Point(eastEast.getX(), eastEast.getY()));
        } else if (east == null) {
            var westWest = this.getHorizontalNeighbour(west.getX(), west.getY(), -1);

            result.push(new Coordinates.Point(west.getX(), west.getY()));
            result.push(new Coordinates.Point(westWest.getX(), westWest.getY()));
        }

        return result;
    }

    this.getVerticalLine = function(x, y) {
        var south = this.getVerticalNeighbour(x, y, 1);
        var north = this.getVerticalNeighbour(x, y, -1);

        var result = [];
        result.push(new Coordinates.Point(x, y));

        if (south != null && north != null) {
            result.push(new Coordinates.Point(south.getX(), south.getY()));
            result.push(new Coordinates.Point(north.getX(), north.getY()));
        } else if (south == null) {
            var northNorth = this.getVerticalNeighbour(north.getX(), north.getY(), -1);

            result.push(new Coordinates.Point(north.getX(), north.getY()));
            result.push(new Coordinates.Point(northNorth.getX(), northNorth.getY()));
        } else if (north == null) {
            var southSouth = this.getVerticalNeighbour(south.getX(), south.getY(), 1);

            result.push(new Coordinates.Point(south.getX(), south.getY()));
            result.push(new Coordinates.Point(southSouth.getX(), southSouth.getY()));
        }

        return result;
    }

    this.getHorizontalNeighbour = function(x, y, direction) {


        if (direction > 0) {
            var bound = this.dimension;

            if (x == 4 && y < 4) {
                bound = 4;
            }

            for (var i = y + 1; i <= bound; i++) {
                if (this.isFieldAllowed(new Coordinates.Point(x, i))) {
                    return new Coordinates.Point(x, i);
                }
            }
        } else {
            var bound = 0;

            if (x == 4 && y > 4) {
                bound = 4;
            }

            for (var i = y - 1; i > bound; i--) {
                if (this.isFieldAllowed(new Coordinates.Point(x, i))) {
                    return new Coordinates.Point(x, i);
                }
            }
        }

        return null;
    }

    // direction > 0 => downwards
    this.getVerticalNeighbour = function(x, y, direction) {
        var bound = this.dimension;

        if (y == 4 && x < 4) {
            bound = 4;
        }

        if (direction > 0) {
            for (var i = x + 1; i <= bound; i++) {
                if (this.isFieldAllowed(new Coordinates.Point(i, y))) {
                    return new Coordinates.Point(i, y);
                }
            }
        } else {
            var bound = 0;

            if (y == 4 && x > 4) {
                bound = 4;
            }

            for (var i = x - 1; i > bound; i--) {
                if (this.isFieldAllowed(new Coordinates.Point(i, y))) {
                    return new Coordinates.Point(i, y);
                }
            }
        }

        return null;
    }

    this.start();
}
