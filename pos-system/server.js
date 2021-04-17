const express = require("express");
const http = require("http");
const port = 3000;
const server = http.createServer(app);
const bodyParser = require("body-parser");
const io = require("socket.io")(server);
liveCart;
console.log("Real time POS running");
console.log("server started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type, Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});
app.get("/", function (req, res) {
  res.send("Real Time POS web app running");
});

app.use("/api/inventory", require("./api/inventory"));
app.use("/api", require("./api/transaction"));

//Websocket logic for live Cart

io.on("connection", function (socket) {
  socket.on("cart-transaction-complete", function () {
    socket.broadcast.emit("update-live-cart-display", {});
  });

  //on page load, show user current cart
  socket.on("live-cart-page-loaded", function () {
    socket.emit("update-live-cart-display", liveCart);
  });

  //when client connected, make client update live cart
  socket.emit("update-live-cart-display", liveCart);

  //When cart data is updated by POS
  socket.on("update-live-cart", function (cartData) {
    liveCart = cartData;

    //broadcast updated live cart to all websocket clients

    socket.emit("update-live-cart-display", liveCart);
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
