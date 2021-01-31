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

    this.findFinalMoves = function(board, color) {
        var pawns = board.getPlayerPawns(color);

        this.walker.start();

        var current;

        var possibleMovements = [];

        for (var i in pawns) {
            current = pawns[i];

            while (this.walker.canForward()) {
                var point = this.walker.forward();

                if (!board.isFieldOccupied(point.getX(), point.getY())) {
                    var currentPoint = current;

                    possibleMovements.push(this.createReplacingMovement(currentPoint, point, board));
                }
            }
        }

        return possibleMovements;
    }

    this.findReplacing = function(board, color) {
        var pawns = board.getPlayerPawns(color);

        this.walker.start();

        var current;

        var possibleMovements = [];

        for (var i in pawns) {
            current = pawns[i];

            var neighbours = walker.getNeighbours(current.getX(), current.getY());

            var currentPoint = current;

            if (neighbours.north != null && !board.isFieldOccupied(neighbours.north.getX(), neighbours.north.getY())) {
                possibleMovements.push(this.createReplacingMovement(currentPoint, neighbours.north, board));
            }

            if (neighbours.south != null && !board.isFieldOccupied(neighbours.south.getX(), neighbours.south.getY())) {
                possibleMovements.push(this.createReplacingMovement(currentPoint, neighbours.south, board));
            }

            if (neighbours.west != null && !board.isFieldOccupied(neighbours.west.getX(), neighbours.west.getY())) {
                possibleMovements.push(this.createReplacingMovement(currentPoint, neighbours.west, board));
            }

            if (neighbours.east != null && !board.isFieldOccupied(neighbours.east.getX(), neighbours.east.getY())) {
                possibleMovements.push(this.createReplacingMovement(currentPoint, neighbours.east, board));
            }
        }

        return possibleMovements;
    }

    this.createReplacingMovement = function(from, to, board) {
        var clonedBoard = board.clone();
        var color = clonedBoard.get(from.getX(), from.getY());

        clonedBoard.set(from.getX(), from.getY(), BoardGames.Constants.NEUTRAL_VALUE);
        clonedBoard.set(to.getX(), to.getY(), color);

        return new BoardGames.ReplacingMovement(from, to, clonedBoard);
    }
}