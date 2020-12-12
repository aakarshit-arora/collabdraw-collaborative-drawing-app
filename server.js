//jshint esversion:6
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app=express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(__dirname + "/public"));

//lines array
const lines = [];

//user connected to server
io.on('connection',function(socket){
  lines.forEach((lineelement)=>{
    socket.emit('draw_line',{line:lineelement.line,
                            txtcolor:lineelement.txtcolor});
  });

//new line drawn by one user
  socket.on('draw_line',(data)=>{
    lines.push({line:data.line,
                txtcolor:data.txtcolor});
    io.emit('draw_line',{line:data.line,
                         txtcolor:data.txtcolor});

  });
  //clear canvas
  socket.on('clear',()=>{
  lines.splice(0,lines.length);
  io.emit('clear',{});
       });
});
const PORT = process.env.PORT||3000;
server.listen(PORT,function(req,res){
  console.log(`server started on port ${PORT}`);
});
