
NineMensMorris.MillPlayerColor = {
    WHITE: 1,
    BLACK: 2,

    getEnemy: function(color) {
        if (color == this.WHITE) {
            return this.BLACK;
        } else {
            return this.WHITE;
        }
    }
};