
BoardGames.MinMaxAlgorithm = function(estimator, color) {
    this.estimator = estimator;
    this.color = color;

    this.maxTurn = 4;

    this.maxTimeout = 1000;
    this.startTime;

    this.finder = new NineMensMorris.MillMovementFinder();

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

    this.getChildrenMin = function(moves) {
        var move = moves[0];
        var color = this.color;

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

        return this.minmax(this.color, board, turn);
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

                    childrenResults.push(this.minmax(enemy, current.getBoard(), turn + 1));
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