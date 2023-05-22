const Socket = (function () {
  let socket = null;

  const getSocket = function () {
    return socket;
  };

  const init = function () {
    socket = io({
      path: "/socket.io/24_points",
    });

    socket.on("connect", () => {
      console.log("conection established with server");
    });

    socket.on("player list", (players) => {
      let playerList = JSON.parse(players);
      console.log("incooming player lists");
      console.log(playerList);
      for (const playerID in playerList) {
        let tempPlayer = playerList[playerID];
        tempPlayer.id = playerID;
        appendPlayer(tempPlayer);
      }
    });

    socket.on("new player", (player) => {
      console.log("incoming new player");
      let newPlayer = JSON.parse(player);
      console.log(newPlayer);
      appendPlayer(newPlayer);
    });

    socket.on("player left", (player) => {
      console.log("player left");
      let leftPlayer = JSON.parse(player);
      console.log(leftPlayer);
      removePlayer(leftPlayer);
    });

    socket.on("reload", () => {
      console.log("reload page");
      Menu.reload();
    });

    socket.on("game start", (roundInfo) => {
      console.log("game started!");
      Menu.startGame(JSON.parse(roundInfo));
    });

    socket.on("win", (roundInfo) => {
      let temp = JSON.parse(roundInfo);
      Game.reset(temp.numbers);
      Game.setRound(temp.round);
    });

    socket.on("NS", (roundInfo) => {
      let temp = JSON.parse(roundInfo);
      Game.reset(temp.numbers);
      Game.setRound(temp.round);
    });

    socket.on("game end", (gameInfo) => {
      let info = JSON.parse(gameInfo);
      $("#game-aera").hide();
      $("#settlement").show();
      $("#winner-name").text(info.winner);
      $("#winner-score").text(info.score);
    });
  };

  function appendPlayer(player) {
    $("#players-list").append(
      "<li id='playerID-" + player.id + "'>" + player.name + "</li>"
    );
    if (Menu.isHost() && $("#players-list").children().length > 1) {
      $("#start-game").show();
    }
  }

  function removePlayer(player) {
    $("#players-list")
      .find("#playerID-" + player.id)
      .remove();
    if (($("#players-list").children().length = 1)) {
      $("#start-game").hide();
    }
  }

  const win = function (round) {
    socket.emit("win", round);
  };

  const noSolution = function (round) {
    socket.emit("NS", round);
  };

  return { getSocket, init, win, noSolution };
})();
