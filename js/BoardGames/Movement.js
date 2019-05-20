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