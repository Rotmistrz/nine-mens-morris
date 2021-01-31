
NineMensMorris.MillComputerPlayer = function(color) {
    this.color = color;

    this.finder = new NineMensMorris.MillMovementFinder();
    this.estimator = new NineMensMorris.MillWorthEstimator();
    this.minmax = new BoardGames.MinMaxAlgorithm(this.estimator, this.color);

    /*this.makeMove = function(board) {
        //var moves = this.finder.find(board, this.color);

        var randomMove = this.getRandomMove(board);


    }*/

    this.getColor = function() {
        return this.color;
    }

    this.getBestMove = function(board) {
        return this.minmax.getBestMove(board);
    }

    this.getBestReplacingMove = function(board) {
        return this.minmax.getBestReplacingMove(board);
    }

    this.getBestFinalMove = function(board) {
        return this.minmax.getBestFinalMove(board);
    }

    this.getPossibleMoves = function(board) {
        return this.minmax.getPossibleMoves(board);
    }

    this.getRandomMove = function(board) {
        var moves = this.finder.find(board, this.color);

        var len = moves.length;

        var randomIndex = getRandomInt(0, len);

        return moves[randomIndex];
    }
}