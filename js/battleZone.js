class BattleZone {

    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.matrix = null;

    }
    setMatrix(fieldSize, startX, startY) {
        if (this.matrix == null) {
            this.matrix = function() {
                let b = 0;
                let matrix = new Array();
                for (let i = 0; i < 10; i++) {
                    matrix[i] = new Array();
                    for (let j = 0; j < 10; j++) {

                        matrix[i][j] = { x: startX + fieldSize * j, y: startY + fieldSize * i, free: true, fieldSize: fieldSize, ship: undefined, shot: false };
                    }
                }
                return matrix;
            }();
        }

    }
    deleteAllShips() {
        if (this.matrix != null) {
            for (let y = 0; y < this.matrix.length; y++) {
                for (let x = 0; x < this.matrix[y].length; x++) {
                    if (this.matrix[y][x].ship) {
                        this.matrix[y][x].ship.inField = false;
                        this.matrix[y][x].ship = undefined;
                        this.matrix[y][x].free = true;
                    }

                }
            }
        }
    }

    getDataMatrix() {
        return this.matrix;
    }

    updateMatrix() {

        for (let _y = 0; _y < this.matrix.length; _y++) {
            for (let _x = 0; _x < this.matrix[_y].length; _x++) {
                if (this.matrix[_y][_x].ship) {
                    let shipInField = this.matrix[_y][_x].ship.inField
                    let dx = this.matrix[_y][_x].ship.rotateFlag == -90;
                    let dy = this.matrix[_y][_x].ship.rotateFlag == 0;
                    for (let y = _y - 1; y < _y + 1 * dy + dx + 1; y++) {
                        for (let x = _x - 1; x < _x + 1 * dx + dy + 1; x++) {
                            if (0 <= x && x < 10 && 0 <= y && y < 10) {
                                if (shipInField) {
                                    this.matrix[y][x].free = false;
                                } else {

                                    this.matrix[_y][_x].ship = undefined
                                    this.matrix[y][x].free = true;
                                }
                            }
                        }

                    }
                }

            }

        }

    }
    setRandomShipMatrix(ships) {
        this.deleteAllShips();
        let dx = null;
        let dy = null;

        for (let i = 0; i < ships.length; i++) {
            let ship = ships[i];
            let prevRotateFlag = ship.rotateFlag;
            if (ship.numberDecks != 1) {
                ship.rotateFlag = Math.random() < 0.5 ? 0 : -90;

            }
            dx = ship.rotateFlag == -90;
            dy = ship.rotateFlag == 0;

            let x = randomInteger(-100, 100);
            let y = randomInteger(-100, 100);



            if (Number(prevRotateFlag) != Number(ship.rotateFlag)) {
                [ship.width, ship.height] = [ship.height, ship.width];
            }

            while (!this.chekFreePosition(x, y, ship)) {
                x = randomInteger(-100, 100);
                y = randomInteger(-100, 100);
            }
            if (dy) {
                for (let _y = y; _y < y + ship.numberDecks; _y++) {
                    this.matrix[_y][x].ship = ship;
                    ship.startPositionX = this.matrix[y][x].x
                    ship.startPositionY = this.matrix[y][x].y
                }
            }
            if (dx) {
                for (let _x = x; _x < x + ship.numberDecks; _x++) {

                    this.matrix[y][_x].ship = ship;

                    ship.startPositionX = this.matrix[y][x].x;
                    ship.startPositionY = this.matrix[y][x].y + ship.height;
                }

            }

            ship.inField = true;
            ship.endPositionX = ship.startPositionX + ship.width;
            ship.endPositionY = ship.startPositionY + ship.height;



            this.updateMatrix();



        }


    }

    chekFreePosition(_x, _y, ship) {
        let dx = ship.rotateFlag == -90;
        let dy = ship.rotateFlag == 0;
        if (this.matrix[_y][_x].x + ship.width >= (this.endX + 1) || this.matrix[_y][_x].y + ship.height >= (this.endY + 1)) return false;
        for (let y = _y - 1; y < _y + ship.numberDecks * dy + dx + 1; y++) {
            for (let x = _x - 1; x < _x + ship.numberDecks * dx + dy + 1; x++) {
                if (0 <= x && x < 10 && 0 <= y && y < 10) {
                    if (this.matrix[y][x].ship) return false
                }
            }
        }
        return true
    }
    makeShot(y, x, shot) {
        if (!this.matrix[y][x].shot) {
            if (this.matrix[y][x].ship) {
                this.matrix[y][x].ship.health -= 1;
                shot.type = 'hit'
                this.matrix[y][x].shot = shot;
                if (this.matrix[y][x].ship.health == 0) {
                    this.matrix[y][x].ship.inField = false;
                    this.matrix[y][x].shot = shot;
                }
            } else {
                shot.type = 'miss'
                this.matrix[y][x].shot = shot;
            }
            shot.x = this.matrix[y][x].x;
            shot.y = this.matrix[y][x].y;
            return true
        }
        return false

    }
    getFreeCels() {
        let arrayFreeCels = new Array();
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (!this.matrix[y][x].ship) {
                    let item = {
                        y: y,
                        x: x,
                    }
                    arrayFreeCels.push(item);
                }

            }
        }
        return arrayFreeCels
    }
}