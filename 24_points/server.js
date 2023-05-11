const express = require("express");
const fs = require("fs");
const session = require("express-session");
const {createServer} = require("http");
const {Server} = require("socket.io");
const { on } = require("events");
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// session settings
const chatSession = session({
    secret: "24PointGame",
    name: "player",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 9000000 }
});
app.use(chatSession);
io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

// server memories
let rooms = {};

// helper functions
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// server the main page
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json());

// handels requests
app.post("/createRoom", (req, res) => {
    let id;
    do {
        id = makeid(4);
    } while (id in rooms);

    let newRoom = {
        "host": req.body.id,
        "players": {[req.body.id]: {"name":req.body.name, "score":0}},
        "started": false
    }
    rooms[id] = (newRoom);

    req.session.player = {
        "name":req.body.name,
        "id":req.body.id,
        "room": id
    }
    // console.log("new room")
    // console.log(newRoom);
    // console.log("curRooms");
    // console.log(rooms);
    res.json({status: "success", roomCode: id});
})

app.post("/joinRoom", (req, res) => {
    if (req.body.code in rooms) {
        let room = rooms[req.body.code];
        if (room.started){
            res.json({status: "error", error: "This game has started!"});
            return;
        }

        room.players[req.body.id] = {"name":req.body.name, "score":0};
        req.session.player = {
            "name":req.body.name,
            "id":req.body.id,
            "room": req.body.code
        }
        // console.log("new player join room")
        // console.log(room);
        // console.log("curRooms");
        // console.log(rooms);
        res.json({status: "success"});
        return;
    }
    res.json({status: "error", error: "Room not found!"});
})


// socket.io
io.on("connection", (socket) => {

    // check is connection is valid
    if (socket.request.session.player == undefined){
        console.log("rejected a connection");
        socket.disconnect();
        return;
    }
    let room = rooms[socket.request.session.player.room];
    if (!room){
        console.log("rejected a connection");
        socket.disconnect();
        return;
    }

    // connection init
    console.log("connection successful with " + socket.request.session.player.id);
    socket.join(socket.request.session.player.room);
    socket.emit("player list", JSON.stringify(room.players));
    socket.to(socket.request.session.player.room).emit("new player", JSON.stringify(socket.request.session.player));

    // event listening

    socket.on("show room", () => {
        console.log("\n=========================");
        for (const roomID in rooms){
            console.log();
            console.log(roomID)
            console.log(rooms[roomID]);
        }
        console.log("\n=========================");
    });

    socket.on("start", () => {
        let roomID = socket.request.session.player.room;
        let room = rooms[roomID];

        // check if the game is valid to start
        if (room.host != socket.request.session.player.id || Object.keys(room.players).length < 2){
            console.log("start game condition does not meet!");
            return;
        }
        let numbers = {
            "num1":parseInt(Math.random() * 9) + 1,
            "num2":parseInt(Math.random() * 9) + 1,
            "num3":parseInt(Math.random() * 9) + 1,
            "num4":parseInt(Math.random() * 9) + 1, 
        }
        room.started = true;
        room.round = 1;
        room.ns = 0;
        room.nsRound = 0;
        io.to(roomID).emit("game start", JSON.stringify({"numbers":numbers, "round": room.round}));
    })

    socket.on("win", (round) => {
        let room = rooms[socket.request.session.player.room];
        let winner = socket.request.session.player.id;
        if (room.round != parseInt(round)){
            return;
        }
        room.round += 1;
        room.players[winner].score += 10;
        room.players[winner].score += room.ns * 5;
        room.ns = 0;
        let returnData = {
            "numbers": {
                "num1":parseInt(Math.random() * 9) + 1,
                "num2":parseInt(Math.random() * 9) + 1,
                "num3":parseInt(Math.random() * 9) + 1,
                "num4":parseInt(Math.random() * 9) + 1, 
            },
            "winner": winner,
            "round": room.round
        }

        if (room.players[winner].score >= 100){
            returnData = {
                "winner": room.players[winner].name,
                "score": room.players[winner].score,
                "players": room.players
            }
            io.to(socket.request.session.player.room).emit("game end", JSON.stringify(returnData));
            return;
        }

        io.to(socket.request.session.player.room).emit("win", JSON.stringify(returnData));


    })

    socket.on("NS", (round) => {
        let room = rooms[socket.request.session.player.room];
        let userID = socket.request.session.player.id;
        if (room.round != parseInt(round)){
            return;
        }
        room.ns += 1;
        if (room.ns <= parseInt(Object.keys(room.players).length / 2)){
            return;
        }
        room.ns = 0;
        room.round += 1;
        room.nsRound += 1;
        let returnData = {
            "numbers": {
                "num1":parseInt(Math.random() * 9) + 1,
                "num2":parseInt(Math.random() * 9) + 1,
                "num3":parseInt(Math.random() * 9) + 1,
                "num4":parseInt(Math.random() * 9) + 1, 
            },
            "round": room.round
        }
        io.to(socket.request.session.player.room).emit("NS", JSON.stringify(returnData));
    })

    socket.on("disconnecting", (reason) => {
        let room = rooms[socket.request.session.player.room];
        if (!room){
            return;
        }
        
        // remove room is host left
        if (room.host == socket.request.session.player.id){
            delete rooms[socket.request.session.player.room];
            // TODO: tell everyone the room is removed
            console.log("room destroyed!")
            io.to(socket.request.session.player.room).emit("reload");
            return;
        }

        // remove single player
        // if (room.started){
        //     return;
        // }
        io.to(socket.request.session.player.room).emit("player left", JSON.stringify(socket.request.session.player));
        delete room.players[socket.request.session.player.id];
        console.log(socket.request.session.player.id + "player removed!");
    })

})


httpServer.listen(10001, () => {
    console.log("The server has started");
});