
BoardGames.MinMaxAlgorithm = function(estimator, color) {
    this.estimator = estimator;
    this.color = color;

    this.maxTurn = 3;

    this.maxTimeout = 800;

    this.extendedMaxTurn = 6;
    this.extendedMaxTimeout = 3000;

    this.startTime;

    this.finder = new NineMensMorris.MillMovementFinder();

    this.alfa = 2;
    this.beta = 4;

    this.getBestMovement = function(board) {

    }

    this.max = function(numbers) {

    }

    this.max = function(array) {
        return Math.max.apply(null, array);
    };

    this.min = function(array) {
        return Math.min.apply(null, array);
    };



    this.getChildrenMin = function(moves) {
        var move = moves[0];
        var color = NineMensMorris.MillPlayerColor.getEnemy(this.color);

        var min = move.estimate(this.estimator, color);
        var minMove = move;

        var worth;

        for (var i = 1; i < moves.length; i++) {
            move = moves[i];

            worth = move.estimate(this.estimator, color);

            //console.log(worth);

            if (worth < min) {
                min = worth;
                minMove = move;
            }
        }

        return {
            value: min,
            move: minMove
        };
    }

    this.getChildrenMax = function(moves) {
        var move = moves[0];
        var color = this.color;

        var max = move.estimate(this.estimator, color);
        var maxMove = move;

        var worth;

        for (var i = 1; i < moves.length; i++) {
            move = moves[i];

            //console.log("RUCH");
            //console.log(move);

            worth = move.estimate(this.estimator, color);

            //console.log(worth);

            if (worth > max) {
                max = worth;
                maxMove = move;
                //console.log("Niby lepsze");
            }

            /**console.log({
                id: i,
                value: max,
                move: maxMove
            });**/
        }

        return {
            value: max,
            move: maxMove
        };
    }

    this.getChildrenMaxExtended = function(moves) {
        var move = moves[0];
        var color = this.color;

        var max = move.move.estimate(this.estimator, color);
        var maxMove = move.move;
        var maxIndex = move.index;

        var worth;

        for (var i = 1; i < moves.length; i++) {
            move = moves[i].move;

            //console.log("RUCH");
            //console.log(move);

            worth = move.estimate(this.estimator, color);

            //console.log(worth);

            if (worth > max) {
                max = worth;
                maxMove = move;
                maxIndex = moves[i].index;
                //console.log("Niby lepsze");
            }

            /**console.log({
                id: i,
                value: max,
                move: maxMove
            });**/
        }

        return {
            value: max,
            move: maxMove,
            index: maxIndex
        };
    }

    this.getChildrenMinExtended = function(moves) {
        var move = moves[0];
        var color = NineMensMorris.MillPlayerColor.getEnemy(this.color);

        var min = move.move.estimate(this.estimator, color);
        var minMove = move.move;
        var minIndex = move.index;

        var worth;

        for (var i = 1; i < moves.length; i++) {
            move = moves[i];

            worth = move.move.estimate(this.estimator, color);

            //console.log(worth);

            if (worth < min) {
                min = worth;
                minMove = move.move;
                minIndex = move.index;
            }
        }

        return {
            value: min,
            move: minMove,
            index: minIndex
        };
    }

    this.estimateBoard = function(board, color) {
        return this.estimator.estimate(board, color);
    }

    this.getCurrentTime = function() {
        var d = new Date();

        return d.getTime();
    }

    this.getBestMove = function(board) {
        var children = this.finder.find(board, this.color);

        var turn = 1;

        this.startTime = this.getCurrentTime();

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(this.color);

        //return this.getChildrenMax(children).move;

        return this.minmaxAlfaBeta(this.color, board, turn);
    }

    this.getPossibleMoves = function(board) {
        return this.finder.findReplacing(board, this.color);
    }

    this.getBestReplacingMove = function(board) {
        var children = this.finder.findReplacing(board, this.color);
        var turn = 1;

        this.extendedMaxTurn = this.getCurrentTime();

        var randomIndex = getRandomInt(0, children.length);

        return children[randomIndex];

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(this.color);

        for (var i = 0; i < children.length; i++) {
            console.log(children[i]);
            console.log(children[i].estimate(this.estimator, this.color));
        }

        var results = [];

        for (var i = 0; i < children.length; i++) {
            results.push(this.minmaxReplacing(this.color, children, board, turn, i));
        }

        var best = this.getChildrenMaxExtended(results);

        console.log(best.index);



        //return best.move;

        return children[best.index];
    }

    this.getBestFinalMove = function(board) {
        var children = this.finder.findFinalMoves(board, this.color);
        var turn = 1;

        this.extendedMaxTurn = this.getCurrentTime();

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(this.color);

        /**for (var i = 0; i < children.length; i++) {
            console.log(children[i]);
            console.log(children[i].estimate(this.estimator, this.color));
        }**/

        //return this.getChildrenMax(children).move;

        var results = [];

        for (var i = 0; i < children.length; i++) {
            results.push(this.minmaxFinal(this.color, children, board, turn, i));
        }

        var best = this.getChildrenMaxExtended(results);

        //console.log(best.index);

        var randomIndex = getRandomInt(0, children.length);

        return children[randomIndex];

        //return best.move;

        return children[best.index];
    }

    /*
    this.getBestMove = function(board) {
        var children = this.finder.find(board, this.color);

        for (var i in children) {
            console.log(children[i]);
        }

        var best = this.getChildrenMax(children);

        return best.move;
    }
     */

    this.getMoves = function(children) {
        /**var moves = [];

        var current;

        for (var i in children) {
            var m;
            current = children[i];

            if (isMax) {
                m = current.estimate(this.estimator, this.color);
            } else {
                m = current.estimate(this.estimator, this.color);
            }

            moves.push(this.)
        }

        return moves;**/
    }

    this.minmaxFinal = function(player, children, board, turn, startingIndex) {
        //console.log("Tura " + turn);

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(player);

        var currentTime = this.getCurrentTime();

        if (player == this.color) {
            // max's turn

            //console.log("max turn");

            if (currentTime - this.startTime > this.extendedMaxTurn) {
                var max = this.getChildrenMax(children);

                return { move: max.move, index: startingIndex };
            }

            if (children.length == 1) {
                return { move: children[0], index: startingIndex };
            } else if (turn >= this.extendedMaxTurn) {
                //console.log(player);
                //console.log("Wracam z tury turn [max]");

                var max = this.getChildrenMax(children);

                return { move: max.move, index: startingIndex };
            } else {
                var childrenResults = [];
                var current;

                for (var i in children) {
                    current = children[i];

                    //console.log(current);

                    var clonedBoard = current.getBoard().clone();
                    var childrenChildren = this.finder.findFinalMoves(clonedBoard, enemy);

                    childrenResults.push(this.minmaxFinal(enemy, childrenChildren, clonedBoard, turn + 1, startingIndex));
                }

                var moves = [];

                for (var j in childrenResults) {
                    moves.push(childrenResults[j].move);
                }

                var maxMovement = this.getChildrenMax(moves);

                return { move: maxMovement.move, index: startingIndex };
            }
        } else {
            // min's turn

            //console.log("min turn");

            if (currentTime - this.startTime > this.extendedMaxTimeout) {
                var max = this.getChildrenMin(children);

                return { move: max.move, index: startingIndex };
            }

            if (children.length == 1) {
                return { move: children[0], index: startingIndex };
            } else if (turn >= this.extendedMaxTurn) {
                var max = this.getChildrenMin(children);

                //console.log(player);
                //console.log("Wracam z tury turn [min]");

                return { move: max.move, index: startingIndex };
            } else {
                var childrenResults = [];
                var current;

                for (var i in children) {
                    current = children[i];

                    var clonedBoard = current.getBoard().clone();
                    var childrenChildren = this.finder.findFinalMoves(clonedBoard, enemy);

                    childrenResults.push(this.minmaxFinal(enemy, childrenChildren, clonedBoard, turn + 1, startingIndex));
                }

                var moves = [];

                for (var j in childrenResults) {
                    moves.push(childrenResults[j].move);
                }

                var minMovement = this.getChildrenMin(moves);

                return { move: minMovement.move, index: startingIndex };
            }
        }
    }

    this.minmaxReplacing = function(player, children, board, turn, startingIndex) {


        //console.log("Tura " + turn);

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(player);

        var currentTime = this.getCurrentTime();

        if (player == this.color) {
            // max's turn

            //console.log("max turn");

            if (currentTime - this.startTime > this.extendedMaxTurn) {
                var max = this.getChildrenMax(children);

                return { move: max.move, index: startingIndex };
            }

            if (children.length == 1) {
                return { move: children[0], index: startingIndex };
            } else if (turn >= this.extendedMaxTurn) {
                //console.log(player);
                //console.log("Wracam z tury turn [max]");

                var max = this.getChildrenMax(children);

                return { move: max.move, index: startingIndex };
            } else {
                var childrenResults = [];
                var current;

                for (var i in children) {
                    current = children[i];

                    //console.log(current);

                    var clonedBoard = current.getBoard().clone();
                    var childrenChildren = this.finder.findReplacing(clonedBoard, enemy);

                    childrenResults.push(this.minmaxReplacing(enemy, childrenChildren, clonedBoard, turn + 1, startingIndex));
                }

                var moves = [];

                for (var j in childrenResults) {
                    moves.push(childrenResults[j].move);
                }

                var maxMovement = this.getChildrenMax(moves);

                return { move: maxMovement.move, index: startingIndex };
            }
        } else {
            // min's turn

            //console.log("min turn");

            if (currentTime - this.startTime > this.extendedMaxTimeout) {
                var max = this.getChildrenMin(children);

                return { move: max.move, index: startingIndex };
            }

            if (children.length == 1) {
                return { move: children[0], index: startingIndex };
            } else if (turn >= this.extendedMaxTurn) {
                var max = this.getChildrenMin(children);

                //console.log(player);
                //console.log("Wracam z tury turn [min]");

                return { move: max.move, index: startingIndex };
            } else {
                var childrenResults = [];
                var current;

                for (var i in children) {
                    current = children[i];

                    var clonedBoard = current.getBoard().clone();
                    var childrenChildren = this.finder.findReplacing(clonedBoard, enemy);

                    childrenResults.push(this.minmaxReplacing(enemy, childrenChildren, clonedBoard, turn + 1, startingIndex));
                }

                var moves = [];

                for (var j in childrenResults) {
                    moves.push(childrenResults[j].move);
                }

                var minMovement = this.getChildrenMin(moves);

                return { move: minMovement.move, index: startingIndex };
            }
        }
    }

    this.minmax = function(player, board, turn) {
        var children = this.finder.find(board, player);

        //console.log("Tura " + turn);

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(player);

        var currentTime = this.getCurrentTime();

        if (player == this.color) {
            // max's turn

            //console.log("max turn");

            if (currentTime - this.startTime > this.maxTimeout) {
                var max = this.getChildrenMax(children);

                return max.move;
            }

            if (children.length == 1) {
                return children[0];
            } else if (turn >= this.maxTurn) {
                //console.log(player);
                //console.log("Wracam z tury turn [max]");

                var max = this.getChildrenMax(children);

                return max.move;
            } else {
                var childrenResults = [];
                var current;

                for (var i in children) {
                    current = children[i];

                    var clonedBoard = current.getBoard().clone();

                    childrenResults.push(this.minmax(enemy, clonedBoard, turn + 1));
                }

                var maxMovement = this.getChildrenMax(childrenResults);

                return maxMovement.move;
            }
        } else {
            // min's turn

            //console.log("min turn");

            if (currentTime - this.startTime > this.maxTimeout) {
                var max = this.getChildrenMin(children);

                return max.move;
            }

            if (children.length == 1) {
                return children[0];
            } else if (turn >= this.maxTurn) {
                var max = this.getChildrenMin(children);

                //console.log(player);
                //console.log("Wracam z tury turn [min]");

                return max.move;
            } else {
                var childrenResults = [];
                var current;

                for (var i in children) {
                    current = children[i];

                    var clonedBoard = current.getBoard().clone();

                    childrenResults.push(this.minmax(enemy, clonedBoard, turn + 1));
                }

                var maxMovement = this.getChildrenMin(childrenResults);

                return maxMovement.move;
            }
        }
    }

    this.minmaxAlfaBeta = function(player, board, turn) {
        var children = this.finder.find(board, player);

        //console.log("Tura " + turn);

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(player);

        var currentTime = this.getCurrentTime();

        if (player == this.color) {
            // max's turn

            //console.log("max turn");

            if (currentTime - this.startTime > this.maxTimeout) {
                var max = this.getChildrenMax(children);

                return max.move;
            }

            if (children.length == 1) {
                return children[0];
            } else if (turn >= this.maxTurn) {
                //console.log(player);
                //console.log("Wracam z tury turn [max]");

                var max = this.getChildrenMax(children);

                return max.move;
            } else {
                var childrenResults = [];
                var current;

                var i = 0;

                for (var i in children) {
                    current = children[i];

                    var clonedBoard = current.getBoard().clone();

                    if (i == 0 || current.estimate(this.estimator, player) >= this.beta) {
                        childrenResults.push(this.minmaxAlfaBeta(enemy, clonedBoard, turn + 1));
                    }

                    //childrenResults.push(this.minmaxAlfaBeta(enemy, clonedBoard, turn + 1));
                    i++;
                }

                var maxMovement = this.getChildrenMax(childrenResults);

                return maxMovement.move;
            }
        } else {
            // min's turn

            //console.log("min turn");

            if (currentTime - this.startTime > this.maxTimeout) {
                var max = this.getChildrenMin(children);

                return max.move;
            }

            if (children.length == 1) {
                return children[0];
            } else if (turn >= this.maxTurn) {
                var max = this.getChildrenMin(children);

                //console.log(player);
                //console.log("Wracam z tury turn [min]");

                return max.move;
            } else {
                var childrenResults = [];
                var current;

                var i = 0;

                for (var i in children) {
                    current = children[i];

                    var clonedBoard = current.getBoard().clone();

                    if (i == 0 || current.estimate(this.estimator, player) <= this.alfa) {
                        childrenResults.push(this.minmaxAlfaBeta(enemy, clonedBoard, turn + 1));
                    }

                    i++;
                }

                var maxMovement = this.getChildrenMin(childrenResults);

                return maxMovement.move;
            }
        }
    }

    this.newminmax = function(player, moves, board, turn, bestMoves) {
        var children = this.finder.find(board, player);

        var enemy = NineMensMorris.MillPlayerColor.getEnemy(player);

        if (player == this.color) {
            // max's turn

            if (children.length == 1) {
                return children[0];
            } else if (turn == this.maxTurn) {
                var max = this.getChildrenMax(children, board);

                bestMoves.push(max);

                return max.move;
            } else {
                var maxMovement = this.getChildrenMax(children, board);

                return this.minmax(enemy, children, maxMovement.move.getBoard(), turn + 1);
            }
        } else {
            // min's turn

            if (children.length == 1) {
                return children[0];
            } else if (turn == this.maxTurn) {
                var min = this.getChildrenMin(children, board);

                return min.move;
            } else {
                var minMovement = this.getChildrenMin(children, board);

                return this.minmax(enemy, children, minMovement.move.getBoard(), turn + 1);
            }
        }
    }
}