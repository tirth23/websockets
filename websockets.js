const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.static("public"));

/* 
The HTTP module's createServer method here creates an HTTP server instance. This server listens for network
requests and can serve both HTTP and WebSocket requests.

Express App (app): Manages the application logic, routing,
middleware, etc., specic to handling web requests.
HTTP Server (server): Manages the lower-level HTTP
communication between the client and server for
bidirectional communication

*/
const server = http.createServer(app);

const io = new Server(server);
let room;

io.on("connection", (socket) => {
	// Open multiple tabs and all will have different socket ids
	console.log("A user connected", socket.id);
	//send message to client every 2s
	// setInterval(() => {
	// 	socket.emit("message", "message from the server" + socket.id + new Date());
	// }, 2000);
	// socket.emit("message", "message from the server");

	// Broadcasts the received message to all other connected clients except the sender.
	socket.on("message", (data) => {
		socket.broadcast.emit("broadcast", data);
	});

	socket.on("create_grp", (roomId) => {
		console.log("group is created", roomId);
		// first participant
		room = roomId;
		socket.join(room);
	});

	socket.on("join_grp", () => {
		console.log(socket.id, "joined the room ", room);
		socket.join(room);
	});

	socket.on("grp message", (data) => {
		socket.to(room).emit("serv_grp_messsage", data);
	});

	socket.on("leave_room", () => {
		console.log(socket.id + "left the room", room);
		socket.leave(room);
	});

	//if tab is closed ore refresh, disconnect event is fired when a user disconnects from the server
	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});
});

app.get("/", (req, res) => {
	res.send("Hello World");
});

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});
