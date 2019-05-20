NineMensMorris.MillSeekingResult = function() {
    this.halfMillsAmount = 0;
    this.millsAmount = 0;

    this.getMillsAmount = function() {
        return this.millsAmount;
    }

    this.getHalfMillsAmount = function() {
        return this.halfMillsAmount;
    }

    this.increaseHalfMillsAmount = function() {
        this.halfMillsAmount++;

        return this.halfMillsAmount;
    }

    this.increaseMillsAmount = function() {
        this.millsAmount++;

        return this.millsAmount;
    }
}