let path = require("path")

const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let port = process.env.PORT;

if (port == null || port == "") {
    port = 3000;
}

let rooms = [1,2,3,4], roomlinks = {}

io.on('connection', (client) => {
    client.emit("rooms", rooms)
    client.on("join", (info) => {
        if(!rooms.includes(parseInt(info.roomId)))
            return
        
        client.join(info.roomId)
        client.roomId = info.roomId
        console.log(client.id + " joined " + client.roomId)
        client.emit("roomJoinStatus")
        if (!rooms[client.roomId]) {
            rooms[client.roomId] = {}
        }
        else if (rooms[client.roomId]['link']){
            client.emit("linkChanged", rooms[client.roomId]["link"])
        }
        client.broadcast.to(client.roomId).emit("clientJoined", info.name)
    })
    client.on("linkChange", (id) => {
        rooms[client.roomId]["link"] = id
        client.broadcast.to(client.roomId).emit("linkChanged", id)
    })
    client.on("seek", (seekTime) => {
        console.log("Seek Time changed to " + seekTime + " by " + client.id)
        client.broadcast.to(client.roomId).emit("seek", seekTime)
    })
    client.on("playing", () => {
        console.log("Client " + client.id + " playing")
        client.broadcast.to(client.roomId).emit("playing")
    })
    client.on("pause", () => {
        console.log("Client " + client.id + " paused")
        client.broadcast.to(client.roomId).emit("pause")
    })
    client.on("disconnect", () => {
        console.log("a user disconnected")

    })
    console.log("a user connected")
});

server.listen(port, () => {
    console.log("listening")
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "./dist/index.html")))
app.use(express.static('dist'))


