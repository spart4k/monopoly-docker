const http = require("http");
const express = require( "express");
const WebSocket = require( "ws");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const User = require('./src/models/user_model.js');
const UserClass = require('./src/classes/User');
const UserOop = new UserClass()
mongoose.connect("mongodb://mongo:27017/testusers", { useNewUrlParser: true });

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });
mongoose.connection.on('connected', ()=>{
  console.log('MongoDB connected at port 27017');
  app = express();
});
webSocketServer.on('connection', async (ws) => {
  const getElements = async () => {
    const result = await UserOop.getElemets()
    console.log(result)
    ws.send(JSON.stringify({ event: "start", payload: { message:  result }}));
  }
  console.log('connect')
  const testresult = await UserOop.createDocument({name: 'test', surname: 'test2'})
  console.log(testresult)
  //getElements()
   ws.on('message', async (m) => {
    let data = JSON.parse(m)
    let message = data.payload.message
    if (data.event === 'add-user') {
      const result = await UserOop.createDocument(message)
      webSocketServer.clients.forEach(client => client.send(JSON.stringify({ event: "add-user", payload: { result }})));
    }
    if (data.event === 'remove-user') {
      let _id = data.payload.id
      console.log(_id)
      const result = await UserOop.removeElement(_id)
      console.log(result)
      webSocketServer.clients.forEach(client => client.send(JSON.stringify({ event: "remove-user", payload: { _id, result }})));
      //webSocketServer.clients.forEach(client => client.send(JSON.stringify({ event: "remove-user", payload: { result }})));
      //ws.send(JSON.stringify({ event: "remove-user", payload: { message:  { _id, result  } }}));
    }
    if (data.event === 'update-user') {
      const _id = data.payload._id
      const item = data.payload.item
      const result = await UserOop.updateElement(_id, item)
      webSocketServer.clients.forEach(client => client.send(JSON.stringify({ event: "update-user", payload: { _id, result: 200, user: result }})));
      //ws.send(JSON.stringify({ event: "remove-user", payload: { message:  { _id, result  } }}));
    }
   });
   ws.on("error", e => ws.send(e));
});

server.listen(3000, '0.0.0.0', () => console.log("Server started"))
