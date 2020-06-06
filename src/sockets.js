import io from "socket.io-client"
import host from "./variables.js"

export const socket = io(host)

socket.on("connect", () => {
    console.log("Socket connected");
})