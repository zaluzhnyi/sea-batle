class Ships {
    constructor(startPositonX, startPositonY, FIELD_SIZE) {
        this.FIELD_SIZE = FIELD_SIZE;
        this.shipsData = [{
                width: 0,
                height: 0,
                startPositionX: startPositonX,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 4,
                health: 4,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                }

            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE + 5,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 3,
                health: 3,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 2 + 5 * 2,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 3,
                health: 3,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 3 + 5 * 3,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 2,
                health: 2,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 4 + 5 * 4,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 2,
                health: 2,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 5 + 5 * 5,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 2,
                health: 2,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 6 + 5 * 6,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 1,
                health: 1,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 7 + 5 * 7,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 1,
                health: 1,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 8 + 5 * 8,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 1,
                health: 1,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
            {
                width: 0,
                height: 0,
                startPositionX: startPositonX + FIELD_SIZE * 9 + 5 * 9,
                startPositionY: startPositonY,
                endPositionX: 0,
                endPositionY: 0,
                numberDecks: 1,
                health: 1,
                rotateFlag: 0,
                inField: false,
                setEndPositionX: function(value) {
                    this.endPositionX = value;
                },
                setEndPositionY: function(value) {
                    this.endPositionY = value;
                },
                setWidth: function(value) {
                    this.width = value;
                },
                setHeight: function(value) {
                    this.height = value;
                },
            },
        ];
    }
    setSettingsShips() {
        for (let i = 0; i < this.shipsData.length; i++) {
            this.shipsData[i].setWidth(this.FIELD_SIZE);
            this.shipsData[i].setHeight(this.FIELD_SIZE * this.shipsData[i].numberDecks)
            this.shipsData[i].setEndPositionX(this.shipsData[i].startPositionX + this.FIELD_SIZE);
            this.shipsData[i].setEndPositionY(this.shipsData[i].startPositionY + this.FIELD_SIZE * this.shipsData[i].numberDecks);

        }
    }

}