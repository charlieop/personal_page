
let game_init = {
    timeRemaining: 3,
    timeToShowMonster: 1000,
    timeToHideMonster: 1000000,
    life: 3,
    bg_color: "#FFF0F5",
    numOfPic: 15,
}

let timeRemaining = game_init.timeRemaining;          // Amount of time remaining for the countdown
let timeToShowMonster = game_init.timeToShowMonster;   // Amount of time to show the monster
let timeToHideMonster = game_init.timeToHideMonster;   // Amount of time to hide the monster

let removeMonster = {};      // Timeout id for hiding the monster

let bombTime;
let heartTime;

let life = game_init.life;      // The player's life
let score = 0;      // The player's score

$(document).ready(function () {
    // Start the countdown screen
    console.log("page ready");
    $("#countdown-text").html(timeRemaining);
    $(document).css("crusor", "url(\"./img/hammer.png\") 10 55, default");
    // monitor input for game-area
    const gamepad = document.getElementById("game-area");
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        // true for mobile device
        gamepad.addEventListener("touchstart", onClick);
    }
    else{
        // false for not mobile device
        gamepad.addEventListener("click", onClick);
    }
});

function init(){
    console.log("init");
    timeRemaining = game_init.timeRemaining;
    timeToShowMonster = game_init.timeToShowMonster;
    timeToHideMonster = game_init.timeToHideMonster;
    life = game_init.life;
    updateLife();
    removeMonster = {};
    score = 0;

    $("#game-area").hide();
    $("#gameover").hide();
    $("#misses").show();
    $("#replay").hide();
    $("#start-page").hide();
    $("#countdown").show();

    $("body").css("background", game_init.bg_color);
    $("#score").html(0);

    $("#2").appendTo("#game-aera");
    $("#2").hide();
    $("#3").appendTo("#game-aera");
    $("#3").hide();
    $("#4").appendTo("#game-aera");
    $("#4").hide();
    $("#bomb").appendTo($("game-aera"));
    $("#bomb").hide();
    $("#heart").appendTo($("game-aera"));
    $("#heart").hide();

    let num = game_init.numOfPic - 1;
    let name1 = parseInt(Math.random()*num) + 2;
    let name2 = parseInt(Math.random()*num) + 2;
    let name3 = parseInt(Math.random()*num) + 2;
    $("#2").attr("src", "./img/nomore/nomore" + name1 + ".png");
    $("#3").attr("src", "./img/nomore/nomore" + name2 + ".png");
    $("#4").attr("src", "./img/nomore/nomore" + name3 + ".png");

    $("#bg-monster").css("left", "calc(50vw - 47.5vmin)");
    $("#bg-monster").css("bottom", "-8vmin");
    $("#bg-monster").fadeIn(500);

    countdown();
}

function countdown() {
    // Decrease the remaining time
    if (timeRemaining == 1) {
        // monster leave
        $("#bg-monster").animate({left:"100vw"}, 1000);
        $("#bg-monster").fadeOut(1000);
    }
    if (timeRemaining > 0) {
        $("#countdown-text").html(timeRemaining);
        timeRemaining -= 1;
        setTimeout(countdown, 1000);
    }
    else {
        $("#countdown-text").html("Start!");
        startGame();
    }
}

function onClick(event) {
    if (event.target.className == "hole"){
        console.log("clicked: hole");
        if (score > 100){
            score -= 10;
        }
        else if (score > 0){
            score -= 1;
        }
        $("#score").html(score);

        let hole = $(event.target);
        hole.css("transition", "none");
        hole.css("background", "#F08080");
        setTimeout( () => {
            hole.css("transition", "background 0.3s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);
    }
    else if (event.target.id == "bomb"){
        console.log("clicked: bomb");

        $("#bomb").appendTo($("game-aera"));
        $("#bomb").hide();

        score -= 30;
        $("#score").html(score);
        life -= 1;
        if (!updateLife()){
            return;
        }
        let hole = $(".hole");
        hole.css("transition", "none");
        hole.css("background", "red");
        setTimeout( () => {
            hole.css("transition", "background 0.5s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);
    }
    else if (event.target.id == "heart"){
        console.log("clicked: heart");

        $("#heart").appendTo($("game-aera"));
        $("#heart").hide();

        if (life < 4){
            life += 1;
        }
        else if (score > 500){
                score += 10;
                $("#score").html(score);
        }
        updateLife();

        let hole = $(".hole");
        hole.css("transition", "none");
        hole.css("background", "green");
        setTimeout( () => {
            hole.css("transition", "background 0.2s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);
    }
    else if (event.target.className == "monster") {
        console.log("clicked: monster");

        monster = $(event.target);
        monster.hide();

        score += 1;
        $("#score").html(score);

        // change color of the clicked hole
        let hole = monster.parent();
        hole.css("transition", "none");
        hole.css("background", "#90EE90");
        setTimeout( () => {
            hole.css("transition", "background 0.2s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);
        
        clearTimeout(removeMonster[monster.attr("id")]);
        monster.appendTo("#game-area");
        setTimeout(showMonster, timeToShowMonster, monster);
        changeDiff();
    }
    else {
        console.log("clicked: else");
    }
}

function updateLife(){
    switch (life){
        case 4:
            $("#misses").html("🌟 🟢 🟢");
            return true;
        case 3:
            $("#misses").html("🟢 🟢 🟢");
            return true;
        case 2:
            $("#misses").html("❌ 🟢 🟢");
            return true;
        case 1:
            $("#misses").html("❌ ❌ 🟢");
            return true;
        default:
            // If the game is over show the game over screen
            gameOver();
            return false;
    }
}

function startGame() {
    console.log("Game stared");
    // Hide the countdown timer
    $("#1").hide();
    $("#countdown").fadeOut(200);
    // Show the monster the first time
    $("#game-area").show();
    setTimeout(showMonster, timeToShowMonster, $("#1"));
}

function showMonster(monster) {
    console.log("show: " + monster.attr("id"));
    // Find the target div randomly and move the monster
    // to that div
    let pos = parseInt(Math.random() * 9);
    while ($($(".hole")[pos]).children().length > 0){
        console.log("reroll");
        pos = parseInt(Math.random() * 9);
    }
    if (score > 50){
        let name = "./img/nomore/nomore" + (parseInt(Math.random()*game_init.numOfPic) + 1) + ".png";
        monster.attr("src", name);
    }
    monster.appendTo($(".hole")[pos]);
    // Show the monster
    monster.fadeIn(100);
    // Hide the monster later
    removeMonster[monster.attr("id")] = setTimeout(hideMonster, timeToHideMonster, monster);
}

function hideMonster(monster) {
    console.log("hide by timeout");
    // Change the colour of the hole
    let hole = monster.parent();
        hole.css("transition", "none");
        hole.css("background", "black");
        setTimeout( () => {
            hole.css("transition", "background 0.7s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);
    // change life and check game status
    life -= 1;
    if (!updateLife()){
        return;
    }
    // Hide the monster
    monster.hide();
    monster.appendTo("#game-area");
    // Show the monster later again
    setTimeout(showMonster, timeToShowMonster, monster);
}

function showBomb(){
    console.log("bomb appear");
    let pos = parseInt(Math.random() * 9);
    while ($($(".hole")[pos]).children().length > 0){
        console.log("reroll");
        pos = parseInt(Math.random() * 9);
    }
    $("#bomb").appendTo($(".hole")[pos]);
    // Show the bomb
    $("#bomb").fadeIn(100);
    // hide bomb
    setTimeout(() => {
        $("#bomb").appendTo($("game-aera"));
        $("#bomb").hide();
    }, 3000);
    bombTime = setTimeout(() => {
        showBomb();
    }, (10000 + parseInt(Math.random() * 50)*1000));
}

function showHeart(){
    console.log("heart appear");
    let pos = parseInt(Math.random() * 9);
    while ($($(".hole")[pos]).children().length > 0){
        console.log("reroll");
        pos = parseInt(Math.random() * 9);
    }
    $("#heart").appendTo($(".hole")[pos]);
    // Show the heart
    $("#heart").fadeIn(100);
    // hide heart
    setTimeout(() => {
        $("#heart").appendTo($("game-aera"));
        $("#heart").hide();
    }, 1500);
    heartTime = setTimeout(() => {
        showHeart();
    }, (60000 + parseInt(Math.random() * 100)*1000));
}

function changeDiff() {
    switch (score) {
        case 10:
            console.log("monster 2 appear!");
            setTimeout(showMonster, timeToShowMonster, $("#2"));
            break;
        case 50:
            console.log("monster 3 appear!");
            setTimeout(showMonster, timeToShowMonster, $("#3"));
            break;
        case 100:
            console.log("bomb and heart appear!");
            bombTime = setTimeout(showBomb, 1000);
            heartTime = setTimeout(showHeart, (parseInt(Math.random() * 40)*500));
            break;
        case 500:
            console.log("monster 4 appear!");
            setTimeout(showMonster, timeToShowMonster, $("#4"));
            break;
        // change bg color
        case 11:
            $("body").css("background", "#E5CCFF");
            break;
        case 21:
            $("body").css("background", "#CCCCFF");
            break;
        case 41:
            $("body").css("background", "#B8CEE6");
            break;
        case 61:
            $("body").css("background", "#C3F3F3");
            break;
        case 81:
            $("body").css("background", "#C3F3DB");
            break;
        case 111:
            $("body").css("background", "#8AE68A");
            break;
        case 151:
            $("body").css("background", "#F3F392");
            break;
        case 201:
            $("body").css("background", "#F8C795");
            break;
        case 301:
            $("body").css("background", "#F39292");
            break;
        case 401:
            $("body").css("background", "#4169e1");
            break;
        case 501:
            $("body").css("background", "#698B22");
            break;
        case 701:
            $("body").css("background", "#CD950C");
            break;
        case 901:
            $("body").css("background", "#9F79EE");
            break;
        case 1001:
        $("body").css("background", "#F88D00");
        break;
    }
    switch (true) {
        case score > 900:
            timeToShowMonster = 50 + parseInt(Math.random()*100) * 10;
            timeToHideMonster = 1000;
            break;
        case score > 600:
            timeToShowMonster = 100 + parseInt(Math.random()*60) * 10;
            timeToHideMonster = 1100;
            break;
        case score > 300:
            timeToShowMonster = 150 + parseInt(Math.random()*30) * 10;
            timeToHideMonster = 1200;
            break;
        case score > 200:
            timeToShowMonster = 200 + parseInt(Math.random()*30) * 10;
            timeToHideMonster = 1300;
            break;
        case score > 150:
            timeToShowMonster = 300 + parseInt(Math.random()*60) * 10;
            timeToHideMonster = 1300;
            break;
        case score > 80:
            timeToShowMonster = 500 + parseInt(Math.random()*100) * 10;
            timeToHideMonster = 1500;
            break;
        case score > 50:
            timeToShowMonster = 1000 + parseInt(Math.random()*30) * 30;
            timeToHideMonster = 1700;
            break;
        case score > 30:
            timeToShowMonster = 700 + parseInt(Math.random()*50) * 10;
            timeToHideMonster = 1500;
            break;
        case score > 20:
            timeToShowMonster = 1000 + parseInt(Math.random()*20) * 50;
            timeToHideMonster = 1500;
            break;
        case score > 10:
            timeToShowMonster = 1200 + parseInt(Math.random()*20) * 100;
            timeToHideMonster = 2000;
            break;
        case score > 6:
            timeToShowMonster = 1000 + parseInt(Math.random()*20) * 50;
            timeToHideMonster = 2000;
            break;
        case score > 3:
            timeToShowMonster = 1000 + parseInt(Math.random()*15) * 100;
            timeToHideMonster = 2000;
            break;
        default:
            timeToShowMonster = 1000 + parseInt(Math.random()*20) * 100;
            timeToHideMonster = 2000;
            break;
    }
}

function gameOver(){
    console.log("Game Over!");
    clearTimeout(removeMonster[1]);
    clearTimeout(removeMonster[2]);
    clearTimeout(removeMonster[3]);
    clearTimeout(removeMonster[4]);
    clearTimeout(bombTime);
    clearTimeout(heartTime);

    $("#bg-monster").hide();
    $("#misses").hide();
    $("#gameover").fadeIn(1000);
    $("#replay").fadeIn(1000);
    $("#bg-monster").css("left", "calc(50vw - 20vmin)");
    $("#bg-monster").css("bottom", "-23vmin");
    $("#bg-monster").fadeIn(3000);
}

function replay() {
    $("#game-area").hide();
    $("#gameover").hide();
    $("#bg-monster").hide();
    $("#replay").hide();
    $("#start-page").show();
    $("#start").html("Play again!");
    let name = "./img/nomore/nomore" + (parseInt(Math.random()*game_init.numOfPic) + 2) + ".png";
    $("#bg-monster").attr("src", name);
}
