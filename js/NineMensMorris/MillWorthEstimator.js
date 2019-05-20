NineMensMorris.MillWorthEstimator = function() {
    this.walker = new NineMensMorris.MillWalker();

    this.countPawns = function(board, color) {
        this.walker.start();

        var amount = 0;
        var point;

        while (this.walker.canForward()) {
            point = this.walker.forward();

            if (board.get(point.getX(), point.getY()) == color) {
                amount++;
            }
        }

        return amount;
    }

    this.estimate = function(board, color) {
        var seeker = new NineMensMorris.MillSeeker(board);

        var enemyColor = NineMensMorris.MillPlayerColor.getEnemy(color);

        var millsResult = seeker.seek(color);
        var enemyMillsResult = seeker.seek(enemyColor);

        var pawns = this.countPawns(board, color);
        var enemyPawns = this.countPawns(board, enemyColor);

        var pawnsRatio = pawns - enemyPawns;

        var millsRatio = millsResult.getMillsAmount() - enemyMillsResult.getMillsAmount();
        var halfMillsRatio = millsResult.getHalfMillsAmount() - enemyMillsResult.getHalfMillsAmount();

        var pawnsRatio = pawnsRatio + millsRatio;

        var result = pawnsRatio * 10 + millsRatio * 16  + halfMillsRatio * 3;

        //var result = millsRatio;

        return result;
    }
}