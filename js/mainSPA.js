const mySPA = (function() {
    const routers = {
        menu: mainPage,
        game: gamePage,
        records: recordsPage,
        options: optionsPage,
        help: helpPage,

    }



    function ModelSPA() {
        let myViewSPA = null;
        this.init = function(view) {
            myViewSPA = view;

            let promise = backgroundMusic.play();
            promise
                .then(function() {
                    myViewSPA.showMute('onmute');
                })
                .catch(function() {
                    myViewSPA.showMute('mute');

                })
        }
        this.updateState = function(pageName) {
            myViewSPA.renderContent(pageName)
            if (pageName === 'game') {
                game.init()
            }
            if (pageName === 'records') {
                records.init()
            }
            if (pageName === 'options') {
                settings.init()
            }
        };
        this.playMusic = function() {
            if (playMusic()) {
                myViewSPA.showMute('onmute')
            } else {
                myViewSPA.showMute('mute');
            }
        }
    }

    function ViewSPA() {
        let containerSPA = null;
        let divContent = null;
        let buttonMuteHtml = null;
        this.init = function(container) {
            containerSPA = container;
            divContent = document.createElement('div');
            divContent.classList.add('content');
            containerSPA.append(divContent);
            buttonMuteHtml = document.createElement('button');
            buttonMuteHtml.classList.add('mute-btn');
            containerSPA.appendChild(buttonMuteHtml);

        }
        this.renderContent = function(pageName) {
            if (!pageName) pageName = 'menu';
            console.log(pageName)
            divContent.innerHTML = routers[pageName].render(pageName);
        }
        this.showMute = function(condition) {
            if (condition == 'mute') {
                buttonMuteHtml.style.backgroundImage = 'url(./svg/mute.svg)';
            } else
                buttonMuteHtml.style.backgroundImage = 'url(./svg/onmute.svg)';
        }
    }

    function ControllerSPA() {
        let containerSPA = null;
        let myModel = null;
        let buttonMuteHtml = null;

        this.init = function(container, model) {
            containerSPA = container;
            myModel = model;

            window.addEventListener("hashchange", this.updateState);
            buttonMuteHtml = containerSPA.querySelector('.mute-btn')
            buttonMuteHtml.addEventListener('click', this.handlerButtonMute);


            this.updateState();
        }
        this.updateState = function() {
            const hashPageName = location.hash.slice(1).toLowerCase();
            myModel.updateState(hashPageName);
        }
        this.handlerButtonMute = function() {
            myModel.playMusic()
        }
    }

    return {
        init: function() {

            let viewSPA = new ViewSPA();
            let modelSPA = new ModelSPA();
            let controllerSPA = new ControllerSPA();

            viewSPA.init(document.querySelector('#spa'));
            modelSPA.init(viewSPA);
            controllerSPA.init(document.querySelector('#spa'), modelSPA);

        }
    }
})();
document.addEventListener("DOMContentLoaded", mySPA.init());