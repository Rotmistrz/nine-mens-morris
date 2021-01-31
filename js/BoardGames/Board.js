BoardGames.Constants = {
    NEUTRAL_VALUE: 0
}

BoardGames.Board = function(dimension) {
    this.dimension = dimension;

    this.board = [];

    this.setBoard = function(values) {
        this.board = values;

        this.dimension = this.board.length;

        return this;
    }

    this.getBoard = function() {
        return this.board;
    }

    this.getDimension = function() {
        return this.dimension;
    }

    this.reset = function() {
        delete this.board;

        this.board = null;
        this.board = [];

        for (var i = 0; i < this.dimension; i++) {
            this.board[i] = [];

            for (var j = 0; j < this.dimension; j++) {
                this.board[i][j] = BoardGames.Constants.NEUTRAL_VALUE;
            }
        }

        return this;
    }

    this.get = function(x, y) {
        var arrayX = x - 1;
        var arrayY = y - 1;

        return this.board[arrayX][arrayY];
    }

    this.getByIndex = function(x, y) {
        return this.get(x + 1, y + 1);
    }

    this.set = function(x, y, value) {
        var arrayX = x - 1;
        var arrayY = y - 1;

        this.board[arrayX][arrayY] = value;

        return true;
    }

    this.setByIndex = function(x, y, value) {
        return this.set(x + 1, y + 1, value);
    }

    this.isFieldOccupied = function(x, y) {
        return this.get(x, y) != BoardGames.Constants.NEUTRAL_VALUE;
    }

    this.present = function() {
        var row = "";

        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                row += "(" + (i + 1) + ", " + (j + 1) + ") " + this.getByIndex(i, j) + " ";
            }

            console.log(row + "\n");
            row = "";
        }
    }

    this.reset();

    this.clone = function() {
        var fields = this.getBoard().slice(0);

        var dimension = this.getDimension();

        var cloned = new BoardGames.Board(dimension);
        cloned.reset();

        for (var i = 0; i < fields.length; i++) {
            for (var j = 0; j < fields.length; j++) {
                cloned.setByIndex(i, j, this.getByIndex(i, j));
            }
        }

        return cloned;
    }

    this.getPlayerPawns = function(color) {
        var pawns = [];
        var current;

        for (var i = 1; i <= this.dimension; i++) {
            for (var j = 1; j <= this.dimension; j++) {
                current = this.get(i, j);

                if (current == color) {
                    pawns.push(new Coordinates.Point(i, j));
                }
            }
        }

        return pawns;
    }
}
