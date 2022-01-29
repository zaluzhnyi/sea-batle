const settings = (function() {
    function SettingsView() {
        let myContainer = null;
        let inputRotateHorizontally = null;
        let inputRotateVertically = null;
        let inputVolMusic = null;
        let inputVolSound = null;
        let selectLevel = null;
        this.init = function(container) {
            myContainer = container;
            inputRotateHorizontally = myContainer.querySelector('#setting-rotate-horizontally');
            inputRotateVertically = myContainer.querySelector('#setting-rotate-vertically');
            inputVolMusic = myContainer.querySelector('#setting-vol-music');
            inputVolSound = myContainer.querySelector('#setting-vol-sound');
            selectLevel = myContainer.querySelector('#level-difficulty');
        }
        this.showSettings = function(settingsData) {
            this.clearSettings();
            inputRotateHorizontally.value = settingsData.rotateHorizontally;
            inputRotateVertically.value = settingsData.rotateVertically;
            inputVolMusic.value = settingsData.musicVol;
            inputVolSound.value = settingsData.soundVol;
            selectLevel.value = settingsData.level
        }
        this.clearSettings = function() {
            inputRotateHorizontally.value = '';
            inputRotateVertically.value = '';
            inputVolMusic.value = '';
            inputVolSound.value = '';
            selectLevel.value = '';
        }
        this.activateBtn = function(nameBtn) {
            if (nameBtn == 'rotateHorizontally') {
                if (!inputRotateHorizontally.style.borderColor) {
                    inputRotateHorizontally.style.borderColor = '#00C6FF';
                    inputRotateVertically.style.borderColor = '';
                } else {
                    inputRotateHorizontally.style.borderColor = '';
                }
            } else {
                if (!inputRotateVertically.style.borderColor) {
                    inputRotateVertically.style.borderColor = '#00C6FF';
                    inputRotateHorizontally.style.borderColor = '';
                } else {
                    inputRotateVertically.style.borderColor = '';
                }
            }
        }
    }

    function SettingsModel() {
        let myView = null;
        let settingsData = null;
        const defaultSettings = {
            rotateVertically: 'KeyE',
            rotateHorizontally: 'KeyQ',
            musicVol: 40,
            soundVol: 60,
            level: 'easy'
        }
        let customSettings = {
            rotateVertically: 'KeyE',
            rotateHorizontally: 'KeyQ',
            musicVol: 40,
            soundVol: 60,
            level: 'easy'
        }
        this.init = function(view) {
            myView = view;
            if (localStorage.getItem('setting')) {
                customSettings = JSON.parse(localStorage.getItem('setting'));
                myView.showSettings(customSettings);
            } else {
                localStorage.setItem('setting', JSON.stringify(defaultSettings));
                myView.showSettings(defaultSettings);
            }

        }
        this.setDefaultSettings = function() {
            customSettings = JSON.stringify(defaultSettings);
            localStorage.setItem('setting', customSettings);
            customSettings = JSON.parse(customSettings);
            myView.showSettings(customSettings);
        }

        this.setSettings = function(nameSettings, value) {

            switch (true) {
                case nameSettings == 'rotateHorizontally':
                    {
                        customSettings.rotateHorizontally = value;
                        this.activateBtn('rotateHorizontally');
                        break;
                    }
                case nameSettings == 'rotateVertically':
                    {
                        customSettings.rotateVertically = value;
                        this.activateBtn('rotateVertically');
                        break;
                    }
                case nameSettings == 'setVolumeSound':
                    {
                        customSettings.soundVol = value;
                        setSoundVolume(customSettings.soundVol)
                        break;
                    }
                case nameSettings == 'setVolumeMusic':
                    {
                        customSettings.musicVol = value;
                        setMusicVolume(customSettings.musicVol)
                        break;
                    }
                case nameSettings == 'setLevelDifficulty':
                    customSettings.level = value
                default:
                    break;
            }

            localStorage.setItem('setting', JSON.stringify(customSettings))
            myView.showSettings(customSettings)
        }
        this.activateBtn = function(nameBtn) {
            myView.activateBtn(nameBtn)
        }
    }

    function SettingsController() {
        let myContainer = null;
        let myModel = null;
        let inputRotateHorizontally = null;
        let inputRotateVertically = null;
        let rangeVolMusic = null;
        let rangeVolSound = null;
        let selectLevel = null;
        let btnReset = null;

        this.init = function(model, container) {
            myContainer = container;
            myModel = model;
            inputRotateHorizontally = myContainer.querySelector('#setting-rotate-horizontally');
            inputRotateVertically = myContainer.querySelector('#setting-rotate-vertically');
            rangeVolMusic = myContainer.querySelector('#setting-vol-music');
            rangeVolSound = myContainer.querySelector('#setting-vol-sound');
            selectLevel = myContainer.querySelector('#level-difficulty');
            btnReset = myContainer.querySelector('#setting-reset')
            btnReset.addEventListener('click', this.setDefaultSettings);
            inputRotateHorizontally.addEventListener('click', this.handlerInputRotateHorizontally);
            inputRotateVertically.addEventListener('click', this.handlerInputRotateVertically);
            rangeVolMusic.addEventListener('mouseup', this.handlerRangeVolMusic);
            rangeVolSound.addEventListener('mouseup', this.handlerRangeVolSound);
            selectLevel.addEventListener('change', this.handlerSelectLevel);
            window.addEventListener('hashchange', this.exitSettings, {
                once: true
            });
        }
        this.handlerInputRotateHorizontally = function(event) {
            event.preventDefault()
            myModel.activateBtn('rotateHorizontally');
            inputRotateHorizontally.addEventListener('keydown', function handler(event) {
                myModel.setSettings('rotateHorizontally', event.code);
                this.removeEventListener('keydown', handler);
            })

        }
        this.handlerInputRotateVertically = function(event) {
            event.preventDefault()
            myModel.activateBtn('rotateVertically');
            inputRotateVertically.addEventListener('keydown', function handler(event) {
                myModel.setSettings('rotateVertically', event.code);
                this.removeEventListener('keydown', handler);
            })
        }
        this.handlerRangeVolMusic = function(event) {
            myModel.setSettings('setVolumeMusic', event.target.value)
        }
        this.handlerRangeVolSound = function(event) {
            myModel.setSettings('setVolumeSound', event.target.value)
        }
        this.handlerSelectLevel = function(event) {
            myModel.setSettings('setLevelDifficulty', event.target.value)
        }
        this.setDefaultSettings = function(e) {
            e.preventDefault()
            myModel.setDefaultSettings()
        }
        this.exitSettings = function() {
            btnReset.removeEventListener('click', this.setDefaultSettings);
            inputRotateHorizontally.removeEventListener('click', this.handlerInputRotateHorizontally);
            inputRotateVertically.removeEventListener('click', this.handlerInputRotateVertically);
            rangeVolMusic.removeEventListener('mouseup', this.handlerRangeVolMusic);
            rangeVolSound.removeEventListener('mouseup', this.handlerRangeVolSound);
            selectLevel.removeEventListener('change', this.handlerSelectLevel);
            window.removeEventListener('hashchange', this.exitSettings);
            myContainer = null;
            myModel = null;
            inputRotateHorizontally = null;
            inputRotateVertically = null;
            rangeVolMusic = null;
            rangeVolSound = null;
        }
    }
    return {
        init: function() {
            let view = new SettingsView();
            let model = new SettingsModel();
            let controller = new SettingsController();
            view.init(document.querySelector('.options-page'));
            model.init(view);
            controller.init(model, document.querySelector('.options-page'));
        }
    }
})()