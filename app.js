let path = require("path")

const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

let rooms = [1, 2, 3, 4],
    roomInfo = {}

for (let room of rooms) {
    roomInfo[room] = {}
}

io.on('connection', (client) => {
    client.emit("rooms", rooms)
    client.on("join", (info) => {
        if (!rooms.includes(parseInt(info.roomId)))
            return

        client.name = info.name
        client.roomId = info.roomId

        client.join(info.roomId)
        console.log(client.id + " joined " + client.roomId)
        client.emit("roomJoinStatus")

        if (roomInfo[client.roomId]['link'])
            client.emit("linkChanged", roomInfo[client.roomId]["link"])
        client.broadcast.to(client.roomId).emit("clientJoined", info.name)
    })
    client.on("linkChange", (id) => {
        roomInfo[client.roomId]["link"] = id
        client.broadcast.to(client.roomId).emit("linkChanged", id)
    })
    client.on("seek", (seekTime) => {
        client.broadcast.to(client.roomId).emit("seek", seekTime)
    })
    client.on("playing", () => {
        client.broadcast.to(client.roomId).emit("playing")
    })
    client.on("pause", () => {
        client.broadcast.to(client.roomId).emit("pause")
    })
    client.on("disconnect", () => {
        console.log(client.name + " disconnected")
    })
    console.log("a user connected")
});

server.listen(port, () => {
    console.log("listening")
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "./dist/index.html")))
app.use(express.static('dist'))


