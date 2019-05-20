NineMensMorris.Constants = {
    MILL_BOARD_DIMENSION: 7
}

NineMensMorris.MillBoard = function() {
    BoardGames.Board.call(this, NineMensMorris.Constants.MILL_BOARD_DIMENSION);
}