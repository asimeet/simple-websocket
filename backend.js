const http = require("http");
const WebSocketServer = require("websocket").server;

const server = http.createServer((req, res) => {
  const html = require("fs").readFileSync("./frontend.html");
  res.write(html);
  res.end();
});

server.listen(9898, () => {
  console.log(
    `Server started ! Click on http://localhost:9898 to open application`
  );
});

const wsServer = new WebSocketServer({
  httpServer: server,
});

const process = (referenceId, connection) => {
  setTimeout(() => {
    connection.send(`
          Your message with Reference id: <b>${referenceId}</b> is now PROCESSED!
        `);
  }, 4000);
};

wsServer.on("request", function (request) {
  const connection = request.accept(null, request.origin);

  connection.on("message", function (message) {
    message = message.utf8Data;
    console.log("Received Message:", message);
    const referenceId = Math.floor(Math.random() * 100000);
    connection.send(
      `Hello from Chatbot!! - I have received the following query:
         <i>${message}</i> <br>
         The Reference id of the query is <b>${referenceId}</b> <br>
         I will process it in 4 seconds and give you a response
         `
    );
    process(referenceId, connection);
  });
  connection.on("close", function (reasonCode, description) {
    console.log("Client has disconnected.");
  });
});
