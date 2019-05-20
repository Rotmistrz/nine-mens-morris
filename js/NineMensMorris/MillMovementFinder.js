NineMensMorris.MillMovementFinder = function() {
    this.walker = new NineMensMorris.MillWalker();

    this.find = function(board, color) {
        this.walker.start();

        var possibleMovements = [];

        while (this.walker.canForward()) {
            var point = this.walker.forward();

            if (!board.isFieldOccupied(point.getX(), point.getY())) {
                var clonedBoard = board.clone();
                clonedBoard.set(point.getX(), point.getY(), color);

                var movement = new BoardGames.Movement(new Coordinates.Point(point.getX(), point.getY()), clonedBoard);

                possibleMovements.push(movement);
            }
        }

        return possibleMovements;
    }
}