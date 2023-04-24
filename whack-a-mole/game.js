
let game_init = {
    timeRemaining: 3,
    timeToShowMonster: 2000,
    timeToHideMonster: 2000,
    life: 3,
    bg_color: "#FFF0F5",
}

let timeRemaining = game_init.timeRemaining;          // Amount of time remaining for the countdown
let timeToShowMonster = game_init.timeToShowMonster;   // Amount of time to show the monster
let timeToHideMonster = game_init.timeToHideMonster;   // Amount of time to hide the monster

let removeMonster = {};      // Timeout id for hiding the monster

let life = game_init.life;      // The player's life
let score = 0;      // The player's score


$(document).ready(function () {
    // Start the countdown screen
    $("#countdown-text").html(timeRemaining);
});

function init(){
    console.log("init");
    timeRemaining = game_init.timeRemaining;
    timeToShowMonster = game_init.timeToShowMonster;
    timeToHideMonster = game_init.timeToHideMonster;
    life = game_init.life;
    removeMonster = {};
    score = 0;

    $("#game-area").hide();
    $("#gameover").hide();
    $("#misses").show();
    $("#replay").hide();
    $("#start-page").hide();
    $("#countdown").show();

    $(".monster").off("click");
    $(".hole").off("click");

    $("body").css("background", game_init.bg_color);
    $("#misses").html("🟢 🟢 🟢");
    $("#score").html(0);
    $("#2").appendTo("#game-aera");
    $("#3").appendTo("#game-aera");
    $("#2").hide();
    $("#3").hide();

    $("#bg-monster").fadeIn(500);
    $("#bg-monster").css("left", "calc(50vw - 47.5vmin)");
    $("#bg-monster").css("bottom", "-8vmin");
    countdown();
}

function countdown() {
    // Decrease the remaining time
    if (timeRemaining == 1) {
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
    // Continue the countdown if there is still time;
    // otherwise, start the game when the time is up
}

function startGame() {
    console.log("Game stared");
    // Hide the countdown timer
    $("#1").hide();
    $("#countdown").fadeOut(200);
    // Show the monster the first time
    $("#game-area").show();
    setTimeout(showMonster, timeToShowMonster, $("#1"));

    // Set up the click handler of the monster
    // - Clear the previous timeout
    // - Hide the monster
    // - Adjust the monster time
    // - Show the monster later again

    // $(".monster").on("tap click", function (event) {
    //     monster = $(event.currentTarget);
    //     console.log(monster.attr("id"));
    //     monster.hide();
    //     score += 1;
    //     $("#score").html(score);
    //     // change color of the clicked hole
    //     let hole = monster.parent();
    //     hole.css("transition", "none");
    //     hole.css("background", "#90EE90");
    //     setTimeout( () => {
    //         hole.css("transition", "background 0.2s ease-in-out");
    //         hole.css("background", "rgba(255, 248, 220, 0.9)");
    //     }, 50);

    //     clearTimeout(removeMonster[monster.attr("id")]);
    //     setTimeout(showMonster, timeToShowMonster, monster);
    //     // changeDiff();

    // });

    // change the color of a block if no monster in it
    $(".hole").on("tap click", (event) => {
        if ( event.currentTarget == event.target){
            let hole = $(event.currentTarget);
            hole.css("transition", "none");
            hole.css("background", "#F08080");
            if (score > 0){
                score -= 1;
            }
            $("#score").html(score);
            setTimeout( () => {
                hole.css("transition", "background 0.3s ease-in-out");
                hole.css("background", "rgba(255, 248, 220, 0.9)");
            }, 50);
        }
        else {
            console.log(event);
            console.log(event.target);
            monster = $(event.target);
            console.log(monster.attr("id"));
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
            setTimeout(showMonster, timeToShowMonster, monster);
            changeDiff();
        }
    });
}

function showMonster(monster) {
    console.log("show" + monster.attr("id"));
    // Find the target div randomly and move the monster
    // to that div
    let pos = parseInt(Math.random() * 9);
    while ($($(".hole")[pos]).children().length > 0){
        console.log("reroll");
        pos = parseInt(Math.random() * 9);
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
    switch (life){
        case 2:
            $("#misses").html("❌ 🟢 🟢");
            break;
        case 1:
            $("#misses").html("❌ ❌ 🟢");
            break;
        default:
            // If the game is over show the game over screen
            gameOver();
            return;
    }
    // Hide the monster
    monster.hide();
    console.log(life);
    // Show the monster later again
    setTimeout(showMonster, timeToShowMonster, monster);
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
            $("body").css("background", "#007AF3");
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
        case score > 500:
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
            timeToShowMonster = 1000 + parseInt(Math.random()*20) * 100;
            timeToHideMonster = 2000;
            break;
        default:
            timeToShowMonster = 1000 + parseInt(Math.random()*30) * 100;
            timeToHideMonster = 2000;
            break;
    }
}

function gameOver(){
    console.log("Game Over!");
    console.log(removeMonster);

    clearTimeout(removeMonster[1]);
    clearTimeout(removeMonster[2]);
    clearTimeout(removeMonster[3]);

    $("#bg-monster").hide();
    $("#misses").hide();
    $("#gameover").fadeIn(1000);
    $("#replay").fadeIn(1000);
    $("#bg-monster").css("left", "calc(50vw - 20vmin)");
    $("#bg-monster").css("bottom", "-23vmin");
    $("#bg-monster").fadeIn(3000);
}

function replay() {
    init();
}
