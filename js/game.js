const game = (function() {
    let gameStartFlag = false;

    function GameModel() {
        const FIELD_SIZE = 30; // размер одной клетки
        const START_SHIP_POSITION_X = 10;
        const START_SHIP_POSITION_Y = START_SHIP_POSITION_X + FIELD_SIZE * 11 + 10;
        let START_BATTLE_ZONA_X = 30; //стартовая позиция по Х для отрисовки поля битвы игрока
        let myView = null;
        let indexSelectedShip = null; //индекс выбранного корабля при растановке 
        let aim = null;
        let player1 = null;
        let player2AI = null;
        let playerTurn = true;
        let time = 0;
        let idStopwatch = null;
        let playerName = undefined;
        let seconds = null;
        let mins = null;
        let canvasWidth = null;
        let canvasHeight = null;
        let idTimeShotAI = null;
        let idTimeShotPlayer = null;
        let levelDifficulty = null;
        let arrayFreeCels = null;
        const mouse = {
            x: 0,
            y: 0,
            clickX: 0,
            clickY: 0,
            left: false,
        }
        let settings = null;
        this.init = function(view, _canvasWidth, _canvasHeight) {
            myView = view;
            settings = JSON.parse(localStorage.getItem('setting'));
            setSoundVolume(settings.soundVol)
            levelDifficulty = settings.level;
            canvasWidth = _canvasWidth;
            canvasHeight = _canvasHeight;
            playerName = undefined;
            myView.activateStopGameBtn(false);
            myView.setInformation('Для старта введите имя игрока и расставьте корабли!!')
            player1 = new Player(START_SHIP_POSITION_X, START_SHIP_POSITION_Y, FIELD_SIZE, START_BATTLE_ZONA_X);
            START_BATTLE_ZONA_X = canvasWidth - FIELD_SIZE * 10 - canvasWidth / 20;
            player2AI = new Player(0, 0, FIELD_SIZE, START_BATTLE_ZONA_X);
            player1.setSettingsShips();
            player2AI.setSettingsShips();
            player1.setMatrix();
            player2AI.setMatrix();
            aim = new Aim();
            idAnimation = requestAnimationFrame(() => myView.drawGame(player1.ships, player2AI.ships, player1.battleZone, player2AI.battleZone, aim, player1.arrayShots, player2AI.arrayShots));
        }
        this.startGame = function() {

            if (!gameStartFlag && playerName) {
                if (levelDifficulty != 'easy') {
                    arrayFreeCels = player1.battleZone.getFreeCels();
                    arrayFreeCels = arrayFreeCels.sort(() => Math.round(Math.random() * 100) - 50);
                }
                myView.activateStopGameBtn(true)
                myView.activateInputPlayerName(true);
                gameStartFlag = true;
                this.setRandomShip();
                this.checkPositionOnField();
                myView.setInformation(`Ход игрока ${playerName}`);
                idStopwatch = setInterval(function() {
                    time++;
                    mins = Math.floor(time / 10 / 60);
                    seconds = Math.floor(time / 10 % 60);
                    if (mins < 10) {
                        mins = "0" + mins;
                    }
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    myView.showStopwatch(seconds, mins)
                }, 100)

            } else {
                myView.setInformation('Введите имя игрока');
            }


        }
        this.stopGame = function(winner) {
            clearInterval(idTimeShotAI);
            clearInterval(idTimeShotPlayer);
            clearInterval(idStopwatch);
            myView.activateStopGameBtn(false)
            gameStartFlag = false;
            playerTurn = true;
            time = 0;
            START_BATTLE_ZONA_X = 30;
            this.init(myView, canvasWidth, canvasHeight)
            this.checkPositionOnField();
            myView.setInformation(`Победил ${winner}`);
            myView.showStopwatch('', '');
            myView.activateInputPlayerName(false);


        }
        this.setPlayerName = function(name) {
            playerName = name;
        }
        this.makeShot = function(x, y) {
            if (playerTurn && mouse.x >= player2AI.battleZone.startX && mouse.x <= player2AI.battleZone.endX - FIELD_SIZE * 0.15 && mouse.y >= player2AI.battleZone.startY && mouse.y <= player2AI.battleZone.endY) {
                x = Math.trunc((x - player2AI.battleZone.startX) / FIELD_SIZE);
                y = Math.trunc((y - player2AI.battleZone.startY) / FIELD_SIZE);

                if (player1.makeShot(y, x, player2AI)) {
                    switch (true) {
                        case player1.arrayShots[player1.arrayShots.length - 1].type == 'hit' && !this.determineWinner(player2AI.ships):
                            hitAudio.play();
                            playerTurn = false;
                            setTimeout(() => playerTurn = true, 3000)
                            return;

                        case player1.arrayShots[player1.arrayShots.length - 1].type == 'hit' && this.determineWinner(player2AI.ships):
                            this.addPlayerRecordinDB();
                            this.stopGame(`игрок ${playerName}`);
                            break;
                        case player1.arrayShots[player1.arrayShots.length - 1].type == 'miss':
                            missAudio.play();
                            playerTurn = false;
                            myView.setInformation('Ход компьютера');
                            idTimeShotAI = setTimeout(this.makeShotAI.bind(this), 3000)

                            break;
                    }

                }

            }
        }
        this.makeShotAI = function() {
            let x = randomInteger(-100, 100);
            let y = randomInteger(-100, 100);
            if (levelDifficulty != 'easy') {
                while (!this.checkFreeCels(y, x)) {
                    x = randomInteger(-100, 100);
                    y = randomInteger(-100, 100);
                }
                while (!player2AI.makeShot(y, x, player1)) {
                    x = randomInteger(-100, 100);
                    y = randomInteger(-100, 100);
                    while (!this.checkFreeCels(y, x)) {
                        x = randomInteger(-100, 100);
                        y = randomInteger(-100, 100);
                    }
                }

            } else {
                while (!player2AI.makeShot(y, x, player1)) {
                    x = randomInteger(-100, 100);
                    y = randomInteger(-100, 100);
                }
            }

            switch (true) {
                case player2AI.arrayShots[player2AI.arrayShots.length - 1].type == 'hit' && !this.determineWinner(player1.ships):
                    hitAudio.play();
                    setTimeout(this.makeShotAI.bind(this), 3000);
                    break;

                case player2AI.arrayShots[player2AI.arrayShots.length - 1].type == 'hit' && this.determineWinner(player1.ships):
                    this.stopGame('компьютер');
                    break;

                case player2AI.arrayShots[player2AI.arrayShots.length - 1].type == 'miss':
                    missAudio.play();
                    idTimeShotPlayer = setTimeout(() => {
                        myView.setInformation(`Ход игрока ${playerName}`);
                        playerTurn = true;
                    }, 2000);



                    break;

            }
        }
        this.checkFreeCels = function(y, x) {
            for (let i = 0; i < 50; i++) {
                if (arrayFreeCels[i].y === y && arrayFreeCels[i].x === x) {
                    return false;
                }
            }
            return true;
        }

        this.selectShips = function(x, y) {
            mouse.clickX = x;
            mouse.clickY = y;


            if (!mouse.left && !(mouse.x >= player1.battleZone.startX && mouse.x <= player1.battleZone.endX && mouse.y >= player1.battleZone.startY && mouse.y <= player1.battleZone.endY)) {
                player1.ships.shipsData.forEach((element, index) => {
                    if (mouse.x >= element.startPositionX && mouse.x <= element.endPositionX && mouse.y >= element.startPositionY && mouse.y <= element.endPositionY) {
                        indexSelectedShip = index;
                        mouse.left = true;
                    }

                    if (mouse.x >= element.startPositionX && mouse.x <= element.endPositionX && mouse.y <= element.startPositionY && mouse.y >= element.endPositionY) {
                        indexSelectedShip = index;
                        mouse.left = true;
                    }


                });
            } else {
                if (!mouse.left && indexSelectedShip == null && (mouse.x >= player1.battleZone.startX && mouse.x <= player1.battleZone.endX && mouse.y >= player1.battleZone.startY && mouse.y <= player1.battleZone.endY)) {
                    player1.ships.shipsData.forEach((element, index) => {
                        if (mouse.x >= element.startPositionX && mouse.x <= element.endPositionX && mouse.y >= element.startPositionY && mouse.y <= element.endPositionY) {
                            indexSelectedShip = index;
                            mouse.left = true;
                        }

                        if (mouse.x >= element.startPositionX && mouse.x <= element.endPositionX && mouse.y <= element.startPositionY && mouse.y >= element.endPositionY) {
                            indexSelectedShip = index;
                            mouse.left = true;
                        }


                    });
                    player1.ships.shipsData[indexSelectedShip].inField = false;

                    if (!player1.ships.shipsData[indexSelectedShip].inField) {
                        this.checkPositionOnField()
                        player1.battleZone.updateMatrix();

                    }



                } else if (mouse.x >= player1.battleZone.startX && mouse.x <= player1.battleZone.endX && mouse.y >= player1.battleZone.startY && mouse.y <= player1.battleZone.endY) {
                    if (this.chekFreePosition()) {
                        player1.ships.shipsData.forEach((element) => {
                            if (mouse.x >= element.startPositionX && mouse.x <= element.endPositionX && mouse.y >= element.startPositionY && mouse.y <= element.endPositionY) {
                                indexSelectedShip = null;
                                mouse.left = false;
                            }

                            if (mouse.x >= element.startPositionX && mouse.x <= element.endPositionX && mouse.y <= element.startPositionY && mouse.y >= element.endPositionY) {
                                indexSelectedShip = null;
                                mouse.left = false;
                            }
                            this.checkPositionOnField();

                        });
                    }





                }


            }

        }
        this.chekFreePosition = function() {
            let startShipX = Math.trunc(mouse.clickX / FIELD_SIZE) - 1;
            let startShipY = Math.trunc(mouse.clickY / FIELD_SIZE) - 1;
            let dx = player1.ships.shipsData[indexSelectedShip].rotateFlag == -90;
            let dy = player1.ships.shipsData[indexSelectedShip].rotateFlag == 0;

            if (player1.battleZone.chekFreePosition(startShipX, startShipY, player1.ships.shipsData[indexSelectedShip])) {
                this.setEndPosition(indexSelectedShip);
                if (dy) {
                    for (let y = startShipY; y < startShipY + player1.ships.shipsData[indexSelectedShip].numberDecks; y++) {
                        const element = player1.battleZone.matrix[y][startShipX];
                        element.ship = player1.ships.shipsData[indexSelectedShip];
                        player1.ships.shipsData[indexSelectedShip].inField = true;
                        player1.battleZone.updateMatrix();

                    }

                } else {
                    for (let x = startShipX; x < startShipX + player1.ships.shipsData[indexSelectedShip].numberDecks; x++) {
                        const element = player1.battleZone.matrix[startShipY][x];
                        element.ship = player1.ships.shipsData[indexSelectedShip];
                        player1.ships.shipsData[indexSelectedShip].inField = true;
                        player1.battleZone.updateMatrix();

                    }
                }
                return true;
            } else {

                return false;
            }

        }
        this.moveShips = function(x, y) {
            mouse.x = x;
            mouse.y = y;
            if (indexSelectedShip != null) {
                if (mouse.x > player1.battleZone.startX && mouse.x <= player1.battleZone.endX && mouse.y >= player1.battleZone.startY && mouse.y <= player1.battleZone.endY) {
                    if (mouse.x + player1.ships.shipsData[indexSelectedShip].width - FIELD_SIZE / 2 <= player1.battleZone.endX && mouse.y + player1.ships.shipsData[indexSelectedShip].height - FIELD_SIZE / 2 <= player1.battleZone.endY) {
                        if (player1.ships.shipsData[indexSelectedShip].rotateFlag == -90) {
                            player1.ships.shipsData[indexSelectedShip].startPositionX = Math.trunc(mouse.x / FIELD_SIZE) * FIELD_SIZE;
                            player1.ships.shipsData[indexSelectedShip].startPositionY = Math.trunc(mouse.y / FIELD_SIZE) * FIELD_SIZE + player1.ships.shipsData[indexSelectedShip].height;
                            this.setEndPosition(indexSelectedShip);
                        } else {
                            player1.ships.shipsData[indexSelectedShip].startPositionX = Math.trunc(mouse.x / FIELD_SIZE) * FIELD_SIZE;
                            player1.ships.shipsData[indexSelectedShip].startPositionY = Math.trunc(mouse.y / FIELD_SIZE) * FIELD_SIZE;
                            this.setEndPosition(indexSelectedShip);
                        }
                    }
                } else {
                    player1.ships.shipsData[indexSelectedShip].startPositionX = -100;
                    player1.ships.shipsData[indexSelectedShip].startPositionY = -1;
                }
            }
        }
        this.moveAim = function(x, y) {
            mouse.x = x;
            mouse.y = y;
            if (mouse.x >= player2AI.battleZone.startX && mouse.x <= player2AI.battleZone.endX - FIELD_SIZE * 0.15 && mouse.y >= player2AI.battleZone.startY && mouse.y <= player2AI.battleZone.endY) {
                aim.x = Math.trunc((mouse.x - player2AI.battleZone.startX) / FIELD_SIZE) * FIELD_SIZE + player2AI.battleZone.startX;
                aim.y = Math.trunc(mouse.y / FIELD_SIZE) * FIELD_SIZE;
            }

        }
        this.rotateShip = function(code) {
            if (mouse.x >= player1.battleZone.startX && mouse.x <= player1.battleZone.endX && mouse.y >= player1.battleZone.startY && mouse.y <= player1.battleZone.endY) {
                if (code === settings.rotateHorizontally && indexSelectedShip != null) {

                    if (player1.ships.shipsData[indexSelectedShip].rotateFlag != -90 && (player1.ships.shipsData[indexSelectedShip].startPositionX + player1.ships.shipsData[indexSelectedShip].numberDecks * FIELD_SIZE) <= player1.battleZone.endX) {
                        player1.ships.shipsData[indexSelectedShip].rotateFlag = -90;
                        player1.ships.shipsData[indexSelectedShip].startPositionY += FIELD_SIZE;
                        this.setWidthAndHeightShip(indexSelectedShip);
                        this.setEndPosition(indexSelectedShip);
                    }

                }
                if (code === settings.rotateVertically && indexSelectedShip != null) {
                    if (player1.ships.shipsData[indexSelectedShip].rotateFlag != 0 && (player1.ships.shipsData[indexSelectedShip].startPositionY + player1.ships.shipsData[indexSelectedShip].numberDecks * FIELD_SIZE) <= player1.battleZone.endY) {
                        player1.ships.shipsData[indexSelectedShip].rotateFlag = 0;
                        player1.ships.shipsData[indexSelectedShip].startPositionY -= FIELD_SIZE;
                        this.setWidthAndHeightShip(indexSelectedShip);
                        this.setEndPosition(indexSelectedShip);
                    }

                }
            }


        }
        this.setWidthAndHeightShip = function(indexSelectedShip) {
            [player1.ships.shipsData[indexSelectedShip].width, player1.ships.shipsData[indexSelectedShip].height] = [player1.ships.shipsData[indexSelectedShip].height, player1.ships.shipsData[indexSelectedShip].width];
        }
        this.setEndPosition = function(indexSelectedShip) {
            if (player1.ships.shipsData[indexSelectedShip].rotateFlag == -90) {
                player1.ships.shipsData[indexSelectedShip].setEndPositionY(player1.ships.shipsData[indexSelectedShip].startPositionY - FIELD_SIZE);
                player1.ships.shipsData[indexSelectedShip].setEndPositionX(player1.ships.shipsData[indexSelectedShip].startPositionX + FIELD_SIZE * player1.ships.shipsData[indexSelectedShip].numberDecks);
            }
            if (player1.ships.shipsData[indexSelectedShip].rotateFlag == 0) {
                player1.ships.shipsData[indexSelectedShip].setEndPositionX(player1.ships.shipsData[indexSelectedShip].startPositionX + FIELD_SIZE);
                player1.ships.shipsData[indexSelectedShip].setEndPositionY(player1.ships.shipsData[indexSelectedShip].startPositionY + FIELD_SIZE * player1.ships.shipsData[indexSelectedShip].numberDecks);
            }
        }
        this.setRandomShip = function() {
            if (!gameStartFlag) {
                player1.battleZone.setRandomShipMatrix(player1.ships.shipsData);
                this.checkPositionOnField();
            } else {
                player2AI.battleZone.setRandomShipMatrix(player2AI.ships.shipsData);
            }
        }
        this.checkPositionOnField = function() {
            let count = 0;
            if (!gameStartFlag) {
                player1.ships.shipsData.forEach(element => {
                    if (element.inField) count++
                });
                if (count == 10) myView.activateStartBtn(true);
                else {


                    myView.activateStartBtn(false);
                    myView.activateRandomBtn(true);
                }

            } else {
                player2AI.ships.shipsData.forEach(element => {
                    if (element.inField) count++
                });
                if (count == 10) {
                    myView.activateStartBtn(false);
                    myView.activateRandomBtn(false);
                } else myView.activateRandomtBtn(true);
            }

        }
        this.determineWinner = function(ships) {
            let count = 0;
            ships.shipsData.forEach(element => {
                if (!element.inField) count++
            });
            if (count == 10) {
                return true;
            } else return false;
        }
        this.addPlayerRecordinDB = function() {
            appDB.ref('score/' + `user_${playerName.replace(/\s/g,'').toLowerCase()}`).set({
                username: `${playerName}`,
                record: `${mins}:${seconds}`
            }).then(function() {
                console.log('Рекорд добавлен');
            }).catch(function(error) {
                console.log('Ошибка добавления' + error);
            })
        }
        this.exitGame = function() {
            gameStartFlag = false;
            clearInterval(idTimeShotAI);
            clearInterval(idTimeShotPlayer);
            clearInterval(idStopwatch);
            window.cancelAnimationFrame(idAnimation);
            myView.stopAnimation();
            START_BATTLE_ZONA_X = 30; //стартовая позиция по Х для отрисовки поля битвы игрока
            myView = null;
            indexSelectedShip = null; //индекс выбранного корабля при растановке 
            aim = null;
            player1 = null;
            player2AI = null;
            playerTurn = true;
            time = 0;
            idStopwatch = null;
            playerName = undefined;
            seconds = null;
            mins = null;
            canvasWidth = null;
            canvasHeight = null;
            settings = null;
        }

    }

    function GameView() {
        const FIELD_SIZE = 30; // размер одной клетки
        const SHOT_RADIUS = FIELD_SIZE / 10;
        let canvas = null;
        let ctx = null;
        let myContainer = null;
        let informationHtml = null;
        let idAnimation = null;
        this.init = function(container, canvasWidth, canvasHeight) {
            myContainer = container;
            canvas = myContainer.querySelector('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            ctx = canvas.getContext('2d');
            this.activateStartBtn(false);

        }
        this.drawGame = function(playerShips, player2Ships, playerBattleZone, player2BattleZone, aim, arrayShots, arrayShotsAI) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawBattleZone(playerBattleZone.startX, playerBattleZone.startY, playerBattleZone.endX, playerBattleZone.endY);
            this.drawBattleZone(player2BattleZone.startX, player2BattleZone.startY, player2BattleZone.endX, player2BattleZone.endY);
            this.drawShips(playerShips);
            if (gameStartFlag)
                this.drawShips(player2Ships);
            this.drawShots(arrayShots);
            this.drawShots(arrayShotsAI);
            this.drawAim(aim);

            idAnimation = requestAnimationFrame(() => this.drawGame(playerShips, player2Ships, playerBattleZone, player2BattleZone, aim, arrayShots, arrayShotsAI))
        }
        this.drawBattleZone = function(startX, startY, endX, endY) {

            ctx.strokeStyle = "black";
            ctx.lineWidth = 1.7;
            for (let i = 0; i <= 10; i++) {
                ctx.beginPath()

                //начальная точка для рисования
                ctx.moveTo(
                        startX + i * FIELD_SIZE,
                        startY
                    )
                    //конечная точка для рисования    
                ctx.lineTo(
                    startX + i * FIELD_SIZE,
                    endY
                )
                ctx.stroke()
            }

            for (let i = 0; i <= 10; i++) {
                ctx.beginPath()

                //начальная точка для рисования
                ctx.moveTo(
                        startX,
                        startY + i * FIELD_SIZE
                    )
                    //конечная точка для рисования    
                ctx.lineTo(
                    endX,
                    startY + i * FIELD_SIZE
                )
                ctx.stroke()
            }
            ctx.textAlign = "center"
            ctx.font = "20px comics sans"
            ctx.fillStyle = "black";

            //буквы
            const alphabet = "АБВГДЕЖЗИК"
            for (let i = 0; i < 10; i++) {
                const letter = alphabet[i]
                ctx.fillText(
                    letter,
                    startX + FIELD_SIZE * 0.5 + i * FIELD_SIZE,
                    startY * 0.8
                )
            }

            //цифры
            for (let i = 0; i <= 9; i++) {
                ctx.fillText(
                    i + 1,
                    startX - FIELD_SIZE * 0.5,
                    startY + i * FIELD_SIZE + FIELD_SIZE * 0.8 - 4
                )
            }
        }
        this.drawShips = function(ships) {
            for (let i = 0; i < ships.shipsData.length; i++) {
                if (ships.shipsData[i].startPositionX >= canvas.width / 2 && !ships.shipsData[i].inField) {
                    ctx.save()
                    ctx.beginPath();
                    ctx.translate(ships.shipsData[i].startPositionX, ships.shipsData[i].startPositionY)
                    ctx.rotate(ships.shipsData[i].rotateFlag * Math.PI / 180)
                    ctx.rect(0, 0, ships.shipsData[i].rotateFlag == 0 ? ships.shipsData[i].width : ships.shipsData[i].height, ships.shipsData[i].rotateFlag == 0 ? ships.shipsData[i].height : ships.shipsData[i].width)
                    ctx.fill();
                    ctx.strokeStyle = "red";
                    ctx.stroke();
                    ctx.restore();

                }
                if (ships.shipsData[i].startPositionX <= canvas.width / 2 && ships.shipsData[i].health != 0) {
                    ctx.save()
                    ctx.beginPath();
                    ctx.translate(ships.shipsData[i].startPositionX, ships.shipsData[i].startPositionY)
                    ctx.rotate(ships.shipsData[i].rotateFlag * Math.PI / 180)
                    ctx.rect(0, 0, ships.shipsData[i].rotateFlag == 0 ? ships.shipsData[i].width : ships.shipsData[i].height, ships.shipsData[i].rotateFlag == 0 ? ships.shipsData[i].height : ships.shipsData[i].width)
                    ctx.fill();
                    ctx.restore();
                } else if (ships.shipsData[i].startPositionX <= canvas.width / 2 && ships.shipsData[i].health == 0) {
                    ctx.save()
                    ctx.beginPath();
                    ctx.translate(ships.shipsData[i].startPositionX, ships.shipsData[i].startPositionY)
                    ctx.rotate(ships.shipsData[i].rotateFlag * Math.PI / 180)
                    ctx.rect(0, 0, ships.shipsData[i].rotateFlag == 0 ? ships.shipsData[i].width : ships.shipsData[i].height, ships.shipsData[i].rotateFlag == 0 ? ships.shipsData[i].height : ships.shipsData[i].width)
                    ctx.fill();
                    ctx.strokeStyle = "red";
                    ctx.stroke();
                    ctx.restore();
                }


            }
        }
        this.drawAim = function(aim) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.strokeRect(aim.x, aim.y, FIELD_SIZE, FIELD_SIZE);
        }
        this.drawShots = function(arrayShots) {
            for (let i = 0; i < arrayShots.length; i++) {

                if (arrayShots[i].type == 'miss') {

                    ctx.save();
                    ctx.fillStyle = "blue";
                    ctx.beginPath();

                    ctx.arc(arrayShots[i].x + FIELD_SIZE / 2, arrayShots[i].y + FIELD_SIZE / 2, SHOT_RADIUS, 0, (Math.PI / 180) * 360);
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.save();
                    ctx.strokeStyle = "red";
                    ctx.beginPath();

                    ctx.moveTo(arrayShots[i].x, arrayShots[i].y);
                    ctx.lineTo(arrayShots[i].x + FIELD_SIZE, arrayShots[i].y + FIELD_SIZE);
                    ctx.moveTo(arrayShots[i].x + FIELD_SIZE, arrayShots[i].y);
                    ctx.lineTo(arrayShots[i].x, arrayShots[i].y + FIELD_SIZE);
                    ctx.stroke();
                    ctx.restore();
                }

            }

        }
        this.activateStartBtn = function(bool) {
            let startBtn = myContainer.querySelector('#start_game');
            if (!bool) {
                startBtn.classList.add('disabled');
            } else
                startBtn.classList.remove('disabled');
        }
        this.activateStopGameBtn = function(bool) {
            let startBtn = myContainer.querySelector('#stop_game');
            if (!bool) {
                startBtn.classList.add('disabled');
            } else
                startBtn.classList.remove('disabled');
        }
        this.activateRandomBtn = function(bool) {
            let randomBtn = myContainer.querySelector('#random_ship');
            if (!bool) {
                randomBtn.classList.add('disabled');
            } else
                randomBtn.classList.remove('disabled');
        }
        this.activateInputPlayerName = function(bool) {

            let inputPlayerName = myContainer.querySelector('.input-name');
            inputPlayerName.disabled = bool;
            if (bool)
                inputPlayerName.style.border = '1px solid grey';

            else {
                inputPlayerName.value = '';
                inputPlayerName.style.border = '1px solid #00C6FF';
            }

        }
        this.setInformation = function(str) {
            informationHtml = myContainer.querySelector('.information');
            informationHtml.textContent = str;
        }
        this.showStopwatch = function(secs, mins) {
            if (secs == '' && mins == '') myContainer.querySelector(".timer").textContent = `Битва окончена`

            else
                myContainer.querySelector(".timer").textContent = `Время битвы  ${mins}:${secs}`;
        }
        this.stopAnimation = function() {

            window.cancelAnimationFrame(idAnimation);
            canvas = null;
            ctx = null;
            myContainer = null;
            informationHtml = null;
            idAnimation = null;
        }

    }

    function GameController() {
        let controller = this;
        let myModel = null;
        let myContainer = null;
        let canvas = null;
        let rect = null;
        let randomBtn = null;
        let startBtn = null;
        let stopGameBtn = null;
        let mainMenuBtn = null;
        let inputPlayerName = null;

        this.init = function(model, container) {
            myModel = model;
            myContainer = container;

            canvas = myContainer.querySelector('canvas');
            randomBtn = myContainer.querySelector('#random_ship');
            startBtn = myContainer.querySelector('#start_game');
            stopGameBtn = myContainer.querySelector('#stop_game');
            mainMenuBtn = myContainer.querySelector('#main_menu');
            inputPlayerName = myContainer.querySelector('.input-name');
            rect = canvas.getBoundingClientRect();
            canvas.addEventListener('click', this.handlerMouseClick);
            canvas.addEventListener('mousemove', this.handlerMouseMove);
            window.addEventListener('keydown', this.handlerKeyDown);
            randomBtn.addEventListener('click', this.handlerRandomBtn);
            startBtn.addEventListener('click', this.handlerGameBtn);
            stopGameBtn.addEventListener('click', this.handlerStopGameBtn);
            inputPlayerName.addEventListener('input', this.hadlerInputPlayerName);
            window.addEventListener('hashchange', this.exitGame, {
                once: true
            });
        }

        this.handlerMouseClick = function(event) {
            if (event.button === 0 && !gameStartFlag)
                myModel.selectShips(event.clientX - rect.left, event.clientY - rect.top);
            if (event.button === 0 && gameStartFlag)
                myModel.makeShot(event.clientX - rect.left, event.clientY - rect.top);
        }
        this.handlerMouseMove = function(event) {
            if (!gameStartFlag)
                myModel.moveShips(event.clientX - rect.left, event.clientY - rect.top);
            else myModel.moveAim(event.clientX - rect.left, event.clientY - rect.top);
        }
        this.handlerKeyDown = function(event) {
            if (!gameStartFlag)
                myModel.rotateShip(event.code);
        }
        this.handlerRandomBtn = function(event) {
            event.preventDefault();
            myModel.setRandomShip();
        }
        this.handlerGameBtn = function(event) {
            event.preventDefault();
            myModel.startGame();
        }
        this.handlerStopGameBtn = function(event) {
            event.preventDefault();
            myModel.stopGame('компьютер')
        }
        this.exitGame = function() {
            myModel.exitGame();
            window.removeEventListener('keydown', controller.handlerKeyDown);
            canvas.removeEventListener('click', this.handlerMouseClick);
            canvas.removeEventListener('mousemove', this.handlerMouseMove);
            randomBtn.removeEventListener('click', this.handlerRandomBtn);
            startBtn.removeEventListener('click', this.handlerGameBtn);
            stopGameBtn.removeEventListener('click', this.handlerStopGameBtn);
            mainMenuBtn.removeEventListener('click', this.handlerMainMenuBtn);
            inputPlayerName.removeEventListener('input', this.hadlerInputPlayerName);
            myModel = null;
            myContainer = null;
            canvas = null;
            rect = null;
            randomBtn = null;
            startBtn = null;
            stopGameBtn = null;
            mainMenuBtn = null;
            inputPlayerName = null;
        }
        this.hadlerInputPlayerName = function(event) {
            myModel.setPlayerName(event.target.value);
        }

    }
    return {
        init: function() {
            let view = new GameView();
            let model = new GameModel();
            let controller = new GameController();
            view.init(document.querySelector('.game-page'), document.querySelector('canvas').offsetWidth, document.querySelector('canvas').offsetHeight);
            model.init(view, document.querySelector('canvas').offsetWidth, document.querySelector('canvas').offsetHeight);
            controller.init(model, document.querySelector('.game-page'));


        }
    }
})();