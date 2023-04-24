
let game_init = {
    timeRemaining: 3,
    timeToShowMonster: 2000,
    timeToHideMonster: 2000,
    life: 3
}

let timeRemaining = game_init.timeRemaining;          // Amount of time remaining for the countdown

let timeToShowMonster = game_init.timeToShowMonster;   // Amount of time to show the monster
let timeToHideMonster = game_init.timeToHideMonster;   // Amount of time to hide the monster

let removeMonster;         // Timeout id for hiding the monster

let life = game_init.life;                   // The player's life
let score = 0;          // The player's score


function hideMonster() {
    // Change the life and the colour of the holes
    let hole = $("#monster").parent();
        hole.css("transition", "none");
        hole.css("background", "black");
        setTimeout( () => {
            hole.css("transition", "background 0.7s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);

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
            console.log("Game Over!");
            $("#bg-monster").hide();
            $("#misses").hide();
            $("#gameover").fadeIn(1000);
            $("#replay").fadeIn(1000);
            $("#bg-monster").css("left", "calc(50vw - 20vmin)");
            $("#bg-monster").css("bottom", "-23vmin");
            $("#bg-monster").fadeIn(3000);
            return;
    }

    // Hide the monster
    $("#monster").hide();
    console.log("hide by timeout");
    console.log(life);

    // Show the monster later again
    newMonster = setTimeout(showMonster, timeToShowMonster);
}

function showMonster() {
    // Find the target div randomly and move the monster
    // to that div
    let pos = parseInt(Math.random() * 9);
    let monster = $("#monster");
    monster.appendTo($(".hole")[pos]);
    // Show the monster
    monster.fadeIn(100);
    console.log("appear");

    // Hide the monster later
    removeMonster = setTimeout(hideMonster, timeToHideMonster);

}

function startGame() {
    // Hide the countdown timer
    $("#monster").hide();
    $("#countdown").fadeOut(200);
    // Show the monster the first time
    $("#game-area").show();
    setTimeout(showMonster, timeToShowMonster);
    // Set up the click handler of the monster
    // - Clear the previous timeout
    // - Hide the monster
    // - Adjust the monster time
    // - Show the monster later again
    $("#monster").on("click", function () {
        $("#monster").hide();
        console.log("hide");
        score += 1;
        $("#score").html(score);

        switch (true) {
            case score > 100:
                timeToShowMonster = 200 + parseInt(Math.random()*5) * 10;
                timeToHideMonster = 600;
                break;
            case score > 50:
                timeToShowMonster = 200 + parseInt(Math.random()*5) * 20;
                timeToHideMonster = 700;
                break;
            case score > 35:
                timeToShowMonster = 300 + parseInt(Math.random()*10) * 20;
                timeToHideMonster = 800;
                break;
            case score > 25:
                timeToShowMonster = 500 + parseInt(Math.random()*10) * 50;
                timeToHideMonster = 800;
                break;
            case score > 15:
                timeToShowMonster = 700 + parseInt(Math.random()*5) * 100;
                timeToHideMonster = 1200;
                break;
            case score > 10:
                timeToShowMonster = 1000 + parseInt(Math.random()*6) * 100;
                timeToHideMonster = 1500;
                break;
            case score > 5:
                timeToShowMonster = 1300 + parseInt(Math.random()*10) * 100;
                timeToHideMonster = 2000;
                break;
            default:
                timeToShowMonster = 1500 + parseInt(Math.random()*10) * 100;
                timeToHideMonster = timeToShowMonster + 1000;
                break;
        }

        let hole = $("#monster").parent();
        hole.css("transition", "none");
        hole.css("background", "#90EE90");
        setTimeout( () => {
            hole.css("transition", "background 0.2s ease-in-out");
            hole.css("background", "rgba(255, 248, 220, 0.9)");
        }, 50);

        clearTimeout(removeMonster);
        setTimeout(showMonster, timeToShowMonster);
    });
}

function countdown() {
    $("#start-page").hide()
    $("#countdown").show();
    $("#bg-monster").fadeIn(500);
    $("#bg-monster").css("left", "calc(50vw - 47.5vmin)");
    $("#bg-monster").css("bottom", "-8vmin");

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

$(document).ready(function () {
    // Start the countdown screen
    $("#countdown-text").html(timeRemaining);

    // change the color of a block if no monster in it
    $(".hole").on("click", (event) => {
        if ( event.currentTarget == event.target){
            let hole = $(event.currentTarget);
            hole.css("transition", "none");
            hole.css("background", "#F08080");
            score -= 1;
            $("#score").html(score);
            setTimeout( () => {
                hole.css("transition", "background 0.3s ease-in-out");
                hole.css("background", "rgba(255, 248, 220, 0.9)");
            }, 50);
        }
    });

});

function replay() {
    timeRemaining = game_init.timeRemaining;
    timeToShowMonster = game_init.timeToShowMonster;
    timeToHideMonster = game_init.timeToHideMonster;
    life = game_init.life;

    $("#game-area").hide();
    $("#gameover").hide();
    $("#monster").off("click");

    $("#misses").show();
    $("#misses").html("🟢 🟢 🟢");
    $("#score").html(0);
    score = 0;

    clearTimeout(removeMonster);
    $("#replay").hide();
    console.log("restart!");
    countdown();
}


