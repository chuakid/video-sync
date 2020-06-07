import { socket } from "./sockets.js"

const joinBtn = document.getElementById("joinRoom")
const roomIdInput = document.getElementById("roomSelect")
const roomDiv = document.getElementById("join")
const viewerDiv = document.getElementById("viewer")
const nameInput = document.getElementById("name")

joinBtn.onclick = () => {
    socket.emit("join", {
        roomId: roomIdInput.value,
        name: nameInput.value
    })
}

socket.on("roomJoinStatus", (status) => {
    roomDiv.style.display = "none"
    viewerDiv.style.display = "block"
})




