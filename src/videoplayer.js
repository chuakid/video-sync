import axios from "axios"
import Plyr from "plyr"
import { socket } from "./sockets.js"

const player = new Plyr('#player')
const change = document.getElementById("change")

let youtubeLinkInput = document.getElementById("youtubelink")

function changeVideo(id = null) {
    if (!id) {
        let link = youtubeLinkInput.value
        id = link != "" ? link.split("?v=")[1] : "dQw4w9WgXcQ"
    }

    player.source = {
        type: 'video',
        sources: [
            {
                src: id,
                provider: 'youtube',
            },
        ],
    };
    emitSeek = true
    emitPause = true
    return id
}

change.onclick = () => {
    let id = changeVideo()
    socket.emit("linkChange", id)
}
youtubeLinkInput.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
        let id = changeVideo()
        socket.emit("linkChange", id)
    }
})

let emitSeek = true, emitPause = true;
//Change link if someone else changes link
socket.on("linkChanged", (link) => {
    changeVideo(link)
})

socket.on("seek", (data) => {
    emitSeek = false
    player.currentTime = data
})
player.on("seeked", () => {
    if (emitSeek)
        socket.emit("seek", player.currentTime);
    emitSeek = true
})

player.on("playing", () => {
    socket.emit("playing")
})
socket.on("playing", () => {
    player.play()
})

player.on("pause", () => {
    if (emitPause)
        socket.emit("pause")
    else
        emitPause = true
})
socket.on("pause", () => {
    emitPause = false
    player.pause()
})

socket.on("clientJoined", (name) => {
    let notification = document.createElement("div")
    notification.className += "notification"

    // let delBtn = document.createElement("btn")
    // delBtn.className += "delete"
    // notification.appendChild(delBtn)

    notification.innerHTML += name + " joined the room"
    document.getElementsByTagName("main")[0].appendChild(notification)
    
    setTimeout(() => {
        notification.style.opacity = '0'
        notification.addEventListener("transitionend", () => notification.remove())
    }, 1000)
})

