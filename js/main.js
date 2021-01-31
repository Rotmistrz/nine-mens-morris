
var millBoard = new NineMensMorris.MillBoard();

/**onsole.log("MillBoard.length = " + millBoard.dimension);

console.log(millBoard.set(2, 2, 2));
console.log(millBoard.set(3, 3, 3));

millBoard.present();**/

var walker = new NineMensMorris.MillWalker();

var $board = $('#mill-board');
var $boardLayer = $board.find('.mill-board__board-layer');
var $gameLayer = $board.find('.mill-board__game-layer');

var boardWidth = $boardLayer.outerWidth();

var step = boardWidth / (millBoard.getDimension() - 1);

var x = 0;
var y = 0;
var point;

var i = 0;
var pawnColor = NineMensMorris.MillPlayerColor.BLACK;

var whoseTurnLabel = $('.whose-turn-label');
var currentTurnPawn = whoseTurnLabel.find('.pawn');
var currentTurnDescription = whoseTurnLabel.find('.player-label__description');

var gameBoard = new Board($board, millBoard, {});

var gameManager = new GameManager(gameBoard, {
    onMainStateBegin: function() {
        console.log("zaczelismy glowny stan");
    },
    onTurnChanged: function(color) {
        if (color == NineMensMorris.MillPlayerColor.BLACK) {
            currentTurnPawn.removeClass('pawn--white');
            currentTurnDescription.html("Black");
        } else {
            currentTurnPawn.addClass('pawn--white');
            currentTurnDescription.html("White");
        }
    }
});

gameBoard.setGameManager(gameManager);

while (walker.canForward()) {
    var $field = $('<div class="mill-board__field"></div>');

    point = walker.forward();

    x = (point.getX() - 1) * step;
    y = (point.getY() - 1) * step;

    var fieldArea = new FieldArea($('<div class="mill-board__field-area"></div>'), point.getX(), point.getY(), {
        onClick: function(fieldArea) {

            if (gameManager.isComputerTurn()) {
                return false;
            }

            var currX = fieldArea.getX();
            var currY = fieldArea.getY();

            if (gameManager.isEnemyPawnBeingRemoved()) {

            } else if (gameManager.getGamePart() == gameManager.gameParts.BEGINNING) {
                //gameBoard.placeNewPawn(fieldArea.getX(), fieldArea.getY(), gameManager.whoseTurn());

                /**if (gameBoard.isMillHere(currX, currY)) {
                    gameManager.millFound(currX, currY);
                } else {
                    gameManager.nextTurn();
                }**/

                gameManager.makeMovePlaceNewPawn(currX, currY, gameManager.whoseTurn());
            } else if (gameBoard.isPawnMoving()) {
                console.log("proba ruszenia piona");

                var pawnToMove = gameBoard.getPawnToMove();

                var neighbours = walker.getNeighbours(pawnToMove.getX(), pawnToMove.getY());

                if (neighbours.north != null && neighbours.north.equalsTo(currX, currY)
                && !gameBoard.isFieldOccupied(currX, currY)) {
                    gameBoard.placePawn(currX, currY);
                } else if (neighbours.south != null && neighbours.south.equalsTo(currX, currY)
                    && !gameBoard.isFieldOccupied(currX, currY)) {
                    gameBoard.placePawn(currX, currY);
                } else if (neighbours.west != null && neighbours.west.equalsTo(currX, currY)
                    && !gameBoard.isFieldOccupied(currX, currY)) {
                    gameBoard.placePawn(currX, currY);
                } else if (neighbours.east != null && neighbours.east.equalsTo(currX, currY)
                    && !gameBoard.isFieldOccupied(currX, currY)) {
                    gameBoard.placePawn(currX, currY);
                } else if (gameBoard.isFinalMovements(pawnToMove.getColor())) {
                    gameBoard.placePawn(currX, currY);
                } else {
                    console.log("Nie wolno tu ruszać!");
                }
            }
        }
    });
    fieldArea.bind($gameLayer);
    fieldArea.run();

    /**if (i % 2 == 0) {
        pawnColor = NineMensMorris.MillPlayerColor.BLACK;
    } else {
        pawnColor = NineMensMorris.MillPlayerColor.WHITE;
    }

    var pawn = new Pawn($('<div class="mill-board__pawn"><div class="pawn"></div></div>'), point.getX(), point.getY(), {
        onClick: function(fieldArea) {
            var color;

            if (fieldArea.isBlack()) {
                color = "czarny";
            } else {
                color = "biały";
            }

            console.log("Pawn [" + color + "]: (" + fieldArea.getX() + ", " + fieldArea.getY() + ")");
        },
        color: pawnColor
    });
    pawn.bind($gameLayer);
    pawn.run();**/

    $field.css({ left: x + "px", top: y + "px" });



    $boardLayer.append($field);

    i++;
}

gameManager.nextTurn();