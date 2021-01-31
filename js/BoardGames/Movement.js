BoardGames.Movement = function(field, board) {
    this.field = field;
    this.board = board;

    this.getField = function() {
        return this.field;
    }

    this.getBoard = function() {
        return this.board;
    }

    this.estimate = function(estimator, color) {
        return estimator.estimate(this.getBoard(), color);
    }
}

BoardGames.ReplacingMovement = function(from, to, board) {
    this.from = from;
    this.to = to;
    this.board = board;

    this.getFrom = function() {
        return this.from;
    }

    this.getTo = function() {
        return this.to;
    }

    this.getBoard = function() {
        return this.board;
    }

    this.estimate = function(estimator, color) {
        return estimator.estimate(this.getBoard(), color);
    }
}