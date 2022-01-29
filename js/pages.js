const mainPage = {
    render: function(pageName) {
        return `<div class="${pageName}-page">
        <a class="game" href='#game'>НОВАЯ ИГРА</a>
        <a class="records" href='#records'>РЕКОРДЫ</a>
        <a class="options" href='#options'>НАСТРОЙКИ</a>
        <a class="help" href='#help'>ПОМОЩЬ</a>
      </div>`
    }
}
const gamePage = {
    render: function(pageName) {
        return `<div class="${pageName}-page bg-page">
        <canvas id="game-canvas"></canvas>
        <div class="menu-game">
        <a href="#" id="start_game"class="glo menu-item">Начать игру</a>
        <a href="#" id="random_ship" class="glo menu-item">Расставить рандомно корабли</a>
        <a href="#" id="stop_game" class="glo menu-item">Сдаться</a>
        <input class="input-name menu-item" type="text" placeholder="Имя игрока" name="player-name">
        <div class ="full-information menu-item">
        <p class="information"></p>
        <p class="timer"></p>
        </div>
        <a href="#menu" id="main_menu" class="glo menu-item">Главное меню</a>
        </div>
      </div>`
    }
}
const recordsPage = {
    render: function(pageName) {
        return `<div class="${pageName}-page bg-page">
        <h2 class="page_title">Таблица лидеров</h2>
          <table class="data_table">
            <thead class="records_head">
              <tr class="records_row">
                <th><button class="btn_sort" data-sort="number">№</button></th>
                <th><button class="btn_sort" data-sort="name">Имя Игрока</button></th>
                <th><button class="btn_sort" data-sort="record">Время</button></th>
              </tr>
            </thead>
            <tbody class="records_body"></tbody>
          </table>
        <a class="menu" href='#menu'>МЕНЮ</a>
      </div>`
    }
}
const optionsPage = {
    render: function(pageName) {
        return `<div class="${pageName}-page bg-page">
            <h2 class="page_title">Настройки</h2>
            <form class="setting_form">

        <label class="setting_item "><span> Повернуть корабль вертикально</span>
        <input class="setting_input" type="button"    id="setting-rotate-vertically" >
      </label>
        <label class="setting_item"><span> Повернуть корабль горизонтально</span>
          <input class="setting_input" type="button"  id="setting-rotate-horizontally" >
        </label>
        <label class="setting_item "><span> Уровень сложности</span>
        <select  id="level-difficulty" >
           <option value="easy">Легкий</option>
            <option value="difficulty">Сложный</option>
        </select>
        </label>
        <label class="setting_item">Громкость Музыки
          <input type="range" id="setting-vol-music" min="0" max="100" >
        </label>
        <label class="setting_item ">Громкость звуков
          <input type="range" id="setting-vol-sound" min="0" max="100" >
        </label>          
        <input class="btn-reset" id="setting-reset" type="button" value="Cбросить настройки">
       </form>
       <a class="menu" href='#menu'>МЕНЮ</a>
      </div>`
    }
}

const helpPage = {
    render: function(pageName) {
        return `<div class="${pageName}-page bg-page">
        <div class="information-text">
        <p>&nbsp&nbsp«Морской бой» — игра для двух участников, в которой игроки по очереди стреляют по координатам на неизвестной им карте соперника. Если у соперника по этим координатам имеется корабль (координаты заняты), то корабль или его часть «топится», а попавший получает право сделать ещё один ход. Цель игрока — первым потопить все корабли противника.</p>
        <p>&nbsp&nbspПравила размещения кораблей:  1 корабль — ряд из 4 клеток («четырёхпалубный») 2 корабля — ряд из 3 клеток («трёхпалубные») 3 корабля — ряд из 2 клеток («двухпалубные») 4 корабля — 1 клетка («однопалубные») При размещении корабли не могут касаться друг друга сторонами и углами.</p>
        <p>&nbsp&nbspПотопление кораблей противника: Если выстрел пришёлся в клетку, не занятую ни одним кораблём противника, то следует «Мимо!» и на чужом квадрате в этом месте ставится точка. Право хода переходит к сопернику. Если выстрел пришёлся в клетку, где находится многопалубный корабль (размером больше чем 1 клетка), то следует «Ранил!» .На  поле в эту клетку ставится крестик. Стрелявший игрок получает право на ещё один выстрел. Если выстрел пришёлся в клетку, где находится однотрубный корабль, или последнюю непоражённую клетку многопалубного корабля, то следует «Убил!» .Стрелявший игрок получает право на ещё один выстрел. Победителем считается тот, кто первым потопит все 10 кораблей противника</p>
        </div>
        <a class="menu" href='#menu'>МЕНЮ</a>
      </div>`
    }
}