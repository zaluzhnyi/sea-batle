class Player {
    constructor(startShipX, startShipY, fieldSize, startBattleZoneX) {
        this.fieldSize = fieldSize;
        this.battleZone = new BattleZone(startBattleZoneX, fieldSize, startBattleZoneX + fieldSize * 10, fieldSize + fieldSize * 10);
        this.ships = new Ships(startShipX, startShipY, fieldSize);
        this.arrayShots = new Array();
    }
    setSettingsShips() {
        this.ships.setSettingsShips();
    }
    setMatrix() {
        this.battleZone.setMatrix(this.fieldSize, this.battleZone.startX, this.battleZone.startY);
    }
    makeShot(y, x, player) {
        let shot = new Shot(y, x)
        if (player.battleZone.makeShot(y, x, shot)) {
            this.arrayShots.push(shot);
            return true
        } else return false;
    }
}