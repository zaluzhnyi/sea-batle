const missAudio = new Audio('./audio/miss.mp3');
hitAudio = new Audio('./audio/hit.mp3');
backgroundMusic = new Audio('./audio/backgroundMusic.mp3');
backgroundMusic.autoplay = true
backgroundMusic.loop = true;

function setSoundVolume(volume) {
    missAudio.volume = volume / 100;
    hitAudio.volume = volume / 100;
}

function setMusicVolume(volume) {
    backgroundMusic.volume = volume / 100;
}

function playMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        return true
    } else {
        backgroundMusic.pause();
        return false;
    }
}
