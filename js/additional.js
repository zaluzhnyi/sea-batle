function randomInteger(min, max) {

    let rand = min + Math.random() * (max + 1 - min);


    while (!(Math.floor(rand) >= 0) || !(Math.floor(rand) < 10)) {
        rand = min + Math.random() * (max + 1 - min);
    }
    return Math.floor(rand);
}