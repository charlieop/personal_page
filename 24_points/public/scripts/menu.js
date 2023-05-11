const Menu = (function() {
    let playerName = undefined;
    let roomCode = undefined;
    let playerID = undefined;
    let host = false;

    const getPlayerID = function () { 
        return playerID;
     }

    const getPlayerName = function() {
        return playerName;
    }

    const getRoomCode = function() {
        return roomCode;
    }

    const isHost = function () {  
        return host;
    }

    // generate playerID
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    const init = function() {

        playerID = makeid(10);

        $("#startAnyway").on("click", (e) => {
            $("#menu").hide();
            $("#room").hide();
            $("#game-aera").show();
            Game.init();
        })

        // input player name
        $("#input-name-form").on("submit", (e) => {
            e.preventDefault();
            playerName = $("#input-name").val();
            console.log(playerName);
            $("#input-name").val("");
            $("#input-name-form").toggle();
            $("#room-options").toggle();
        })

        // create room
        $("#create-room").on("click", (e) => {
            console.log("create room");
            $("#room-options").toggle();

            fetch("/24_points/createRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"name": playerName, "id": playerID})
            })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success"){
                    roomCode = json.roomCode;
                    host = true;
                    Socket.init();
                    enterRoom();
                }
                else{
                    console.log(json.error);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        })

        // join room
        $("#join-room").on("click", (e) => {
            $("#room-options").toggle();
            $("#input-code-form").toggle();
        })

        $("#input-code-form").on("submit", (e) => {
            e.preventDefault();
            roomCode = $("#input-code").val().toUpperCase().trim();
            if (roomCode.length != 4){
                console.log("code length invalid")
                $("#notice").show();
                $("#notice").html("code length invalid");
                return;
            }
            $("#input-code").val("");

            fetch("/24_points/joinRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"name": playerName, "id": playerID, "code": roomCode})
            })
            .then((res) => res.json())
            .then((json) => {
                if (json.status == "success"){
                    $("#input-code-form").toggle();
                    Socket.init();
                    enterRoom();
                }
                else{
                    $("#notice").show();
                    $("#notice").html(json.error);
                    console.log(json.error);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        })

        // start game
        $("#start-game").on("click", (e) => {
            console.log("start game clicked!");
            Socket.getSocket().emit("start");
        })

    };

    function enterRoom() {
        $("#menu").hide()
        $("#room").show()
        $("#room-code").html("Room Code is: <strong>" + roomCode + "</strong>");

    }
    
    const reload = function() {
        location.reload();
    }

    const startGame = function(roundInfo) {
        $("#room").hide();
        $("#game-aera").show();
        Game.init(roundInfo);
    }


    return {init, getPlayerName, getRoomCode, getPlayerID, isHost, reload, startGame};

})();