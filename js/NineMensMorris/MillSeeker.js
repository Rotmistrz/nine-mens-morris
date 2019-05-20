NineMensMorris.MillSeeker = function(board) {
    this.board = board;

    this.setBoard = function(board) {
        this.board = board;

        return this;
    }

    this.checkRow = function(color, row, columns) {
        if (this.board.get(row, columns[0]) == color
            && this.board.get(row, columns[1]) == color
            && this.board.get(row, columns[2]) == color) {
            return 3;
        } else if (this.board.get(row, columns[0]) == color
            && this.board.get(row, columns[1]) == color) {
            return 2;
        } else if (this.board.get(row, columns[1]) == color
            && this.board.get(row, columns[2]) == color) {
            return 2;
        } else {
            return 0;
        }
    }

    this.checkColumn = function(color, column, rows) {
        if (this.board.get(rows[0], column) == color
            && this.board.get(rows[1], column) == color
            && this.board.get(rows[2], column) == color) {
            return 3;
        } else if (this.board.get(rows[0], column) == color
            && this.board.get(rows[1], column) == color) {
            return 2;
        } else if (this.board.get(rows[1], column) == color
            && this.board.get(rows[2], column) == color) {
            return 2;
        } else {
            return 0;
        }
    }

    this.seek = function(color) {
        var result = new NineMensMorris.MillSeekingResult();

        var columns = [];

        // horizontal
        columns[0] = 1;
        columns[1] = 4;
        columns[2] = 7;

        if (this.checkRow(color, 1, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 1, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 2;
        columns[1] = 4;
        columns[2] = 6;

        if (this.checkRow(color, 2, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 2, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 3;
        columns[1] = 4;
        columns[2] = 5;

        if (this.checkRow(color, 3, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 3, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 1;
        columns[1] = 2;
        columns[2] = 3;

        if (this.checkRow(color, 4, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 4, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 5;
        columns[1] = 6;
        columns[2] = 7;

        if (this.checkRow(color, 4, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 4, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 3;
        columns[1] = 4;
        columns[2] = 5;

        if (this.checkRow(color, 5, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 5, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 2;
        columns[1] = 4;
        columns[2] = 6;

        if (this.checkRow(color, 6, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 6, columns) == 2) {
            result.increaseHalfMillsAmount();
        }

        columns[0] = 1;
        columns[1] = 4;
        columns[2] = 7;

        if (this.checkRow(color, 7, columns) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkRow(color, 7, columns) == 2) {
            result.increaseHalfMillsAmount();
        }


        var rows = [];

        // vertical
        rows[0] = 1;
        rows[1] = 4;
        rows[2] = 7;

        if (this.checkColumn(color, 1, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 1, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 2;
        rows[1] = 4;
        rows[2] = 6;

        if (this.checkColumn(color, 2, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 2, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 3;
        rows[1] = 4;
        rows[2] = 5;

        if (this.checkColumn(color, 3, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 3, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 1;
        rows[1] = 2;
        rows[2] = 3;

        if (this.checkColumn(color, 4, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 4, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 5;
        rows[1] = 6;
        rows[2] = 7;

        if (this.checkColumn(color, 4, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 4, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 3;
        rows[1] = 4;
        rows[2] = 5;

        if (this.checkColumn(color, 5, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 5, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 2;
        rows[1] = 4;
        rows[2] = 6;

        if (this.checkColumn(color, 6, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 6, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        rows[0] = 1;
        rows[1] = 4;
        rows[2] = 7;

        if (this.checkColumn(color, 7, rows) == 3) {
            result.increaseMillsAmount();
        } else if (this.checkColumn(color, 7, rows) == 2) {
            result.increaseHalfMillsAmount();
        }

        return result;
    }
}