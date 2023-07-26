// const express = require("express");
// const app = express();
// const http = require("http");
// const socketIO = require("socket.io");
// const port = 3002;
// // Middleware
// app.use(express.json());

// // Routes
// // Add your routes here

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Internal Server Error" });
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Attach socket.io to the server
// const io = socketIO(server);

// // Socket.io event handling
// io.on("connection", (socket) => {
//   // Handle join room event
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     // Emit an event to the room to inform other users that someone has joined
//     io.to(roomId).emit("userJoined", { roomId, userId: socket.id });
//   });

//   // Handle leave room event
//   socket.on("leaveRoom", (roomId) => {
//     socket.leave(roomId);
//     // Emit an event to the room to inform other users that someone has left
//     io.to(roomId).emit("userLeft", { roomId, userId: socket.id });
//   });

//   // Timer for the game
//   let timerSeconds = 30;
//   let timer;

//   // Start the game timer
//   function startGameTimer() {
//     timer = setInterval(() => {
//       if (timerSeconds > 0) {
//         timerSeconds--;
//         // Emit the timer event to all connected clients
//         io.to(roomId).emit("timer", timerSeconds);
//       } else {
//         clearInterval(timer);
//         // Emit the game over event when the timer reaches 0
//         io.to(roomId).emit("gameOver");
//       }
//     }, 1000);
//   }

//   // Handle user answers
//   socket.on("userAnswer", (answer) => {
//     // Store the answer in the server's data structure
//     // ...
//     // Set a flag to indicate that the user has sent an answer
//     // ...
//   });

//   // Handle user not sending an answer
//   socket.on("userNotSentAnswer", () => {
//     // Handle the case when a user doesn't send an answer
//     // ...
//   });

//   // Other socket event handlers and logic as needed
// });

// // Start the server
// server.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory storage for registered users
const users = [];

// Register endpoint
app.post("/register1", (req, res) => {
  const { name, mobile } = req.body;

  // Validation: Ensure name and mobile are provided
  if (!name || !mobile) {
    return res
      .status(400)
      .json({ error: "Name and mobile number are required." });
  }

  // Validation: Ensure mobile number is numeric
  if (isNaN(mobile)) {
    return res.status(400).json({ error: "Mobile number must be numeric." });
  }

  // Create new user object
  const user = { name, mobile };

  // Store the user in the in-memory array
  users.push(user);

  return res.status(200).json({ message: "Registration successful." });
});

// Start the server
const port = 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
