var NineMensMorrisTest = {};


console.log("=================");

var board = new NineMensMorris.MillBoard();

var walker = new NineMensMorris.MillWalker();

var point;

var valueToSet = 2;

while (walker.canForward()) {
    point = walker.forward();

    board.set(point.getX(), point.getY(), valueToSet);
}

board.present();

console.log(board.get(1, 1) == valueToSet);
console.log(board.get(1, 4) == valueToSet);
console.log(board.get(1, 7) == valueToSet);

console.log(board.get(2, 2) == valueToSet);
console.log(board.get(2, 4) == valueToSet);
console.log(board.get(2, 6) == valueToSet);

console.log(board.get(3, 3) == valueToSet);
console.log(board.get(3, 4) == valueToSet);
console.log(board.get(3, 5) == valueToSet);

console.log(board.get(4, 1) == valueToSet);
console.log(board.get(4, 2) == valueToSet);
console.log(board.get(4, 3) == valueToSet);

console.log(board.get(4, 5) == valueToSet);
console.log(board.get(4, 6) == valueToSet);
console.log(board.get(4, 7) == valueToSet);

console.log(board.get(5, 3) == valueToSet);
console.log(board.get(5, 4) == valueToSet);
console.log(board.get(5, 5) == valueToSet);

console.log(board.get(6, 2) == valueToSet);
console.log(board.get(6, 4) == valueToSet);
console.log(board.get(6, 6) == valueToSet);

console.log(board.get(7, 1) == valueToSet);
console.log(board.get(7, 4) == valueToSet);
console.log(board.get(7, 7) == valueToSet);


console.log("=================");

board.reset();

var i = 0;

walker.start();

while (walker.canForward()) {
    point = walker.forward();

    board.set(point.getX(), point.getY(), i++);
}

board.present();

console.log("=================");


board.reset();

var white = NineMensMorris.MillPlayerColor.WHITE;

board.set(1, 1, white);
board.set(1, 4, white);
board.set(1, 7, white);

board.set(4, 2, white);
board.set(6, 2, white);

var seeker = new NineMensMorris.MillSeeker(board);

var result = seeker.seek(white);

board.present();

console.log(1 == result.getHalfMillsAmount());
console.log(1 == result.getMillsAmount());

board.set(4, 5, white);
board.set(4, 6, white);

result = seeker.seek(white);

console.log(2 == result.getHalfMillsAmount());

console.log("=================");

var estimator = new NineMensMorris.MillWorthEstimator();

console.log(estimator.estimate(board, white));
console.log(estimator.estimate(board, NineMensMorris.MillPlayerColor.BLACK));


console.log("=================");

var movementFinder = new NineMensMorris.MillMovementFinder();

var possibleMovements = movementFinder.find(board, NineMensMorris.MillPlayerColor.WHITE);

console.log("Possible moves:");

for (var i in possibleMovements) {
    console.log("(" + possibleMovements[i].getField().getX() + ", " + possibleMovements[i].getField().getY() + ")");
    possibleMovements[i].getBoard().present();
}

var minmax = new BoardGames.MinMaxAlgorithm(estimator, NineMensMorris.MillPlayerColor.WHITE);

var values = [12, 17, 102, 2, 24, 5];

console.log(minmax.max(values) == 102);
console.log(minmax.min(values) == 2);

console.log("=================");

console.log(minmax.getChildrenMax(possibleMovements, board));
console.log(minmax.getChildrenMin(possibleMovements, board));

console.log("=================");

var clonedBoard = board.clone();

clonedBoard.set(4, 5, NineMensMorris.MillPlayerColor.BLACK);

console.log(clonedBoard.get(4, 5) != board.get(4, 5));

console.log("=================");

var computer = new NineMensMorris.MillComputerPlayer(NineMensMorris.MillPlayerColor.BLACK);

var randomMove = computer.getRandomMove(board);

console.log("(" + randomMove.getField().getX() + ", " + randomMove.getField().getY() + ")");