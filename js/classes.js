function FieldArea(area, x, y, options) {
    var that = this;

    this.dimension = 7;

    this.area = $(area);
    this.board;

    this.x = x;
    this.y = y;

    this.defaultOptions = {
        onClick: function(fieldArea) {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.bind = function($board) {
        $board.append(this.area);

        return this;
    }

    this.place = function() {
        var width = $board.width();
        var step = width / (this.dimension - 1);

        var left = (this.getY() - 1) * step;
        var top = (this.getX() - 1) * step;

        this.area.css({ left: left + "px", top: top + "px" });
    }

    this.getX = function() {
        return this.x;
    }

    this.setX = function(x) {
        this.x = x;

        this.place();

        return this;
    }

    this.getY = function() {
        return this.y;
    }

    this.setY = function(y) {
        this.y = y;

        this.place();

        return this;
    }

    this.run = function() {
        this.place();

        this.area.click(function(e) {
            that.options.onClick(that);
        });
    }
}

function Pawn(container, x, y, options) {
    FieldArea.call(this, container, x, y, options);

    this.color = options.color;

    this.isBlack = function() {
        return this.color == NineMensMorris.MillPlayerColor.BLACK;
    }

    this.setColor = function(color) {
        this.color = color;

        if (this.isBlack()) {
            this.area.find('.pawn').removeClass('pawn--white');
        } else {
            this.area.find('.pawn').addClass('pawn--white');
        }
    }

    this.setColor(this.color);

    this.getColor = function() {
        return this.color;
    }

    this.destroy = function() {
        this.area.remove();
    }
}

function GameManager(board, options) {
    var that = this;

    this.gameParts = {
        BEGINNING: 0,
        MAIN: 1,
        FINISH: 2,
        END: 3
    };

    this.currentRound = 1;

    this.computer = new NineMensMorris.MillComputerPlayer(NineMensMorris.MillPlayerColor.WHITE);
    this.secondComputer = new NineMensMorris.MillComputerPlayer(NineMensMorris.MillPlayerColor.BLACK);

    this.defaultOptions = {
        onMainStateBegin: function() {},
        onTurnChanged: function(whoseTurn) {},

        onStartRemovingEnemyPawn: function(pawn) {},
        onFinishRemovingEnemyPawn: function(pawn) {},

        whiteResult: $('#white-result'),
        blackResult: $('#black-result')
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.whiteResultContainer = this.options.whiteResult;
    this.blackResultContainer = this.options.blackResult;

    this.result = {
        white: 0,
        black: 0
    }

    this.board = board;

    this.currentPlayer = NineMensMorris.MillPlayerColor.WHITE;
    this.currentPart = this.gameParts.BEGINNING;

    this.removingEnemyPawn = false;

    this.isWon = function() {
        var whites = this.board.getPlayerPawns(NineMensMorris.MillPlayerColor.WHITE);
        var blacks = this.board.getPlayerPawns(NineMensMorris.MillPlayerColor.BLACK);

        console.log("whites: " + whites);
        console.log("blacks: " + blacks);

        if (whites.length < 3) {
            return NineMensMorris.MillPlayerColor.BLACK;
        } else if (blacks.length < 3) {
            return NineMensMorris.MillPlayerColor.WHITE;
        } else {
            return -1;
        }
    }

    this.increaseWhiteResult = function() {
        this.result.white++;

        this.whiteResultContainer.html(this.result.white);

        return this.result.white;
    }

    this.increaseBlackResult = function() {
        this.result.black++;

        this.blackResultContainer.html(this.result.black);

        return this.result.black;
    }

    this.isEnemyPawnBeingRemoved = function() {
        return this.removingEnemyPawn;
    }

    this.startRemovingEnemyPawn = function() {
        this.removingEnemyPawn = true;
    }

    this.finishRemovingEnemyPawn = function() {
        this.removingEnemyPawn = false;

        this.nextTurn();
    }

    this.whoseTurn = function() {
        return this.currentPlayer;
    }

    this.isComputerTurn = function() {
        return true;// this.whoseTurn() == this.computer.getColor();
    }

    this.getPlayerColor = function() {
        return NineMensMorris.MillPlayerColor.getEnemy(this.computer.getColor());
    }

    this.isBlackTurn = function() {
        return this.currentPlayer == NineMensMorris.MillPlayerColor.BLACK;
    }

    this.getGamePart = function() {
        return this.currentPart;
    }

    this.changeStateIntoMain = function() {
        this.currentPart = this.gameParts.MAIN;

        this.options.onMainStateBegin();

        return this;
    }

    this.isBeginningEnded = function(pawnsAmount) {
        return pawnsAmount >= 8;
    }

    this.millFound = function(x, y) {
        console.log("mill found here: (" + x + ", " + y + ")");

        if (this.isComputerTurn()) {
            this.startRemovingEnemyPawn();

            var pawns = this.board.getPlayerPawns(this.getPlayerColor());

            var randomNumber = getRandomInt(0, pawns.length);

            var pawnToRemove = pawns[randomNumber];

            this.board.removePawn(pawnToRemove);

            this.finishRemovingEnemyPawn();
        } else {
            this.startRemovingEnemyPawn();
        }
    }

    this.nextTurn = function() {
        var isWon = this.isWon();

        console.log(this.currentRound);

        this.currentRound++;

        if (this.getGamePart() != this.gameParts.BEGINNING && isWon > -1) {
            var $pawn = $('#winner').find('.pawn');
            var $desc = $('#winner').find('.player-label__description');

            $('.overlayer').css({ display: 'block' });

            if (isWon == NineMensMorris.MillPlayerColor.WHITE) {

            } else {
                $pawn.removeClass('pawn--white');
                $desc.html("Black");
            }
        } else {
            if (this.currentPlayer == NineMensMorris.MillPlayerColor.WHITE) {
                this.currentPlayer = NineMensMorris.MillPlayerColor.BLACK;
            } else {
                this.currentPlayer = NineMensMorris.MillPlayerColor.WHITE;
            }

            this.options.onTurnChanged(this.currentPlayer);

            if (this.board.isFinalMovements(this.currentPlayer)) {
                console.log("ostatnie ruchy");
            }

            var currentAI;

            if (this.currentPlayer == NineMensMorris.MillPlayerColor.WHITE) {
                currentAI = this.computer;
            } else {
                currentAI = this.secondComputer;
            }

            if (this.isComputerTurn()) {
                if (this.getGamePart() == this.gameParts.BEGINNING) {
                    console.log("COMPUTER's TURN");
                    //this.board.board.present();
                    var movement = currentAI.getBestMove(this.board.board);

                    var field = movement.getField();
                    var board = movement.getBoard();

                    board.present();

                    this.makeMovePlaceNewPawn(field.getX(), field.getY(), currentAI.getColor());
                } else if (this.getGamePart() == this.gameParts.MAIN) {
                    var children = currentAI.getPossibleMoves(this.board.board);

                    if (children.length > 0) {
                        var possibleMove;

                        if (this.board.isFinalMovements(this.currentPlayer)) {
                            possibleMove = currentAI.getBestFinalMove(this.board.board);
                        } else {
                            possibleMove = currentAI.getBestReplacingMove(this.board.board);
                        }

                        var pawnToMove = this.board.getPawn(possibleMove.getFrom().getX(),possibleMove.getFrom().getY());

                        this.board.movePawn(pawnToMove);

                        console.log(this.board.placePawn(possibleMove.getTo().getX(), possibleMove.getTo().getY()));
                    } else {
                        this.nextTurn();
                    }
                }
            }
        }

        return this.currentPlayer;
    }

    this.makeMovePlaceNewPawn = function(x, y, color) {
        this.board.placeNewPawn(x, y, color);

        console.log("Pawn placed?");

        if (this.board.isMillHere(x, y)) {
            this.millFound(x, y);
        } else {
            this.nextTurn();
        }
    }

    this.run = function() {

    }
}

function Board(container, board, options) {
    var that = this;

    this.container = $(container);
    this.gameLayer = this.container.find('.mill-board__game-layer');

    this.gameManager;
    this.board = board;

    this.walker = new NineMensMorris.MillWalker();

    this.pawns = [];
    this.dimension = NineMensMorris.Constants.MILL_BOARD_DIMENSION;

    this.pawnToMove = null;

    this.pawnMoving = false;

    this.allPawnsAmount = 0;

    this.pawnsAmount = {
        white: 0,
        black: 0
    };

    for (var i = 0; i < this.dimension; i++) {
        this.pawns[i] = [];

        for (var j = 0; j < this.dimension; j++) {
            this.pawns[i][j] = null;
        }
    }

    this.defaultOptions = {

    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.setBoard = function(board) {
        this.board = board;
    }

    this.isFinalMovements = function(color) {
        if (color == NineMensMorris.MillPlayerColor.WHITE) {
            return this.pawnsAmount.white < 4;
        } else {
            return this.pawnsAmount.black < 4;
        }
    }

    this.getAllPawnsAmount = function() {
        return this.allPawnsAmount;
    }

    this.increaseWhites = function() {
        this.pawnsAmount.white++;
        this.allPawnsAmount++;

        return this.pawnsAmount.white;
    }

    this.decreaseWhites = function() {
        this.pawnsAmount.white--;

        return this.pawnsAmount.white;
    }

    this.increaseBlacks = function() {
        this.pawnsAmount.black++;
        this.allPawnsAmount++;

        return this.pawnsAmount.black;
    }

    this.decreaseBlacks = function() {
        this.pawnsAmount.black--;

        return this.pawnsAmount.black;
    }

    this.getNeighbours = function(x, y) {
        return this.walker.getNeighbours(x, y);
    }

    this.getHorizontalLine = function(x, y) {
        return this.walker.getHorizontalLine(x, y);
    }

    this.getVerticalLine = function(x, y) {
        return this.walker.getVerticalLine(x, y);
    }

    this.countPawns = function() {
        var pawnsAmount = 0;

        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                if (this.pawns[i][j] != null) {
                    pawnsAmount++;
                }
            }
        }

        return pawnsAmount;
    }

    this.setGameManager = function(gm) {
        this.gameManager = gm;

        return this;
    }

    this.isPawnMoving = function() {
        return (this.pawnToMove != null);
    }

    this.getPawnToMove = function() {
        return this.pawnToMove;
    }

    this.movePawn = function(pawn) {
        this.pawnToMove = pawn;
    }

    this.getPawn = function(x, y) {
        var arrayX = x - 1;
        var arrayY = y - 1;

        return this.getPawnByIndex(arrayX, arrayY);
    }

    this.getPawnByIndex = function(x, y) {
        return this.pawns[x][y];
    }

    this.isMillHere = function(x, y) {
        var pawn = this.getPawn(x, y);

        if (pawn != null) {
            var pawnColor = pawn.getColor();

            var horizontal = this.getHorizontalLine(x, y);
            var vertical = this.getVerticalLine(x, y);

            var currPoint;
            var currPawn;

            var success = true;

            for (var i in horizontal) {
                currPoint = horizontal[i];
                currPawn = this.getPawn(currPoint.getX(), currPoint.getY());

                if (currPawn == null || currPawn.getColor() != pawnColor) {
                    success = false;

                    break;
                }
            }

            if (success) {
                return true;
            }

            success = true;

            for (var i in vertical) {
                currPoint = vertical[i];
                currPawn = this.getPawn(currPoint.getX(), currPoint.getY());

                if (currPawn == null || currPawn.getColor() != pawnColor) {
                    success = false;

                    break;
                }
            }

            return success;

            /**if (neighbours.north != null && neighbours.south != null) {
                var north = this.getPawn(neighbours.north.getX(), neighbours.north.getY());
                var south = this.getPawn(neighbours.south.getX(), neighbours.south.getY());

                if (north != null && north.getColor() == pawnColor && south != null && south.getColor() == pawnColor) {
                    return true;
                } else {
                    return false;
                }

            }**/ /**else if (neighbours.west != null && neighbours.east != null) {
                var west = this.getPawn(neighbours.west.getX(), neighbours.west.getY());
                var east = this.getPawn(neighbours.east.getX(), neighbours.east.getY());

                if ((west != null && west.getColor() == pawnColor) && (east != null && east.getColor() == pawnColor)) {
                    return true;
                } else {
                    return false;
                }

            } **/ /***else {
                return false;
            }**/


        } else {
            return false;
        }
    }

    this.isFieldOccupied = function(x, y) {
        return this.board.isFieldOccupied(x, y);
    }

    this.removePawn = function(pawn) {
        if (this.gameManager.isEnemyPawnBeingRemoved()) {
            var x = pawn.getX();
            var y = pawn.getY();

            if (pawn != null && pawn.getColor() != that.gameManager.whoseTurn()) {
                var arrayX = x - 1;
                var arrayY = y - 1;

                this.pawns[arrayX][arrayY] = null;

                this.board.set(x, y, BoardGames.Constants.NEUTRAL_VALUE);

                if (pawn.getColor() == NineMensMorris.MillPlayerColor.WHITE) {
                    this.gameManager.increaseBlackResult();
                    this.decreaseWhites();
                } else {
                    this.gameManager.increaseWhiteResult();
                    this.decreaseBlacks();
                }

                pawn.destroy();

                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    this.placePawn = function(x, y) {
        if (!this.board.isFieldOccupied(x, y)) {
            var recentX = this.pawnToMove.getX();
            var recentY = this.pawnToMove.getY();

            var recentArrayX = recentX - 1;
            var recentArrayY = recentY - 1;

            var arrayX = x - 1;
            var arrayY = y - 1;

            this.pawns[recentArrayX][recentArrayY] = null;

            this.pawns[arrayX][arrayY] = this.pawnToMove;

            this.board.set(recentX, recentY, BoardGames.Constants.NEUTRAL_VALUE);
            this.board.set(x, y, this.pawnToMove.getColor());

            this.pawnToMove.setX(x);
            this.pawnToMove.setY(y);

            this.pawnToMove = null;

            if (this.isMillHere(x, y)) {
                this.gameManager.millFound(x, y);
            } else {
                this.gameManager.nextTurn();
            }

            return true;
        } else {
            console.log("field occupied: " + this.board.get(x, y));

            return false;
        }
    }

    this.placeNewPawn = function(x, y, color) {
        var pawn = new Pawn($('<div class="mill-board__pawn"><div class="pawn"></div></div>'), x, y, {
            onClick: function(fieldArea) {
                var color;

                if (that.gameManager.isComputerTurn()) {
                    return false;
                }

                if (that.gameManager.isWon() < 0) {
                    if (that.gameManager.isEnemyPawnBeingRemoved()) {
                        if (that.removePawn(fieldArea)) {
                            that.gameManager.finishRemovingEnemyPawn();
                        }
                    } else if (that.gameManager.getGamePart() != that.gameManager.gameParts.BEGINNING) {
                        console.log(that.gameManager.getGamePart() + " Pawn [" + color + "]: (" + fieldArea.getX() + ", " + fieldArea.getY() + ")");

                        if ((fieldArea.isBlack() && that.gameManager.isBlackTurn())
                            || !fieldArea.isBlack() && !that.gameManager.isBlackTurn()) {
                            that.movePawn(fieldArea);
                        }
                    }
                }

            },
            color: color
        });
        pawn.bind(this.gameLayer);
        pawn.run();

        this.pawns[(x - 1)][(y - 1)] = pawn;

        if (pawn.isBlack()) {
            console.log("BLACKS: " + this.increaseBlacks());
        } else {
            console.log("WHITES: " + this.increaseWhites());
        }

        console.log("setting... " + this.board.set(x, y, color) + " it was " + this.countPawns() + " pawn");

        if (this.gameManager.isBeginningEnded(this.getAllPawnsAmount())) {
            this.gameManager.changeStateIntoMain();
        }

        this.board.present();
    }

    this.getPlayerPawns = function(color) {
        var pawns = [];

        var pawn;

        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                pawn = this.pawns[i][j];

                if (pawn != null && pawn.getColor() == color) {
                    pawns.push(pawn);
                }
            }
        }

        return pawns;
    }

    this.run = function() {

    }
}