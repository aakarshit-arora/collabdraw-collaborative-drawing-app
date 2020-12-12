//jshint esversion:6

document.addEventListener("DOMContentLoaded",function(){
//object for tracking mouse actions
  var mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: false
  };

//setting up canvas
const canvas = document.getElementById('drawing');
const context = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
const socket = io.connect();
var color='black';

//making dimensions of canvas the dimensions of page
canvas.width = width;
canvas.height = height;

//event handlers
document.getElementById('black').addEventListener("click",()=>{
  color='black';
});
document.getElementById('red').addEventListener("click",()=>{
  color='red';
});
document.getElementById('green').addEventListener("click",()=>{
  color='green';
});
document.getElementById('blue').addEventListener("click",()=>{
  color='blue';
});
document.getElementById('trash').addEventListener("click",()=>{
  socket.emit('clear',{});
});

canvas.onmousedown = (e)=>{
  mouse.click = true;
};
canvas.onmouseup = (e)=>{
  mouse.click = false;
};

canvas.onmousemove = (e)=>{
  mouse.pos.x = e.clientX / width;
  mouse.pos.y = e.clientY / height;
  mouse.move = true;
};

//socket.io events
socket.on('draw_line',(data)=>{
  const line = data.line;
  const txtcolor=data.txtcolor;
  context.beginPath();
  context.moveTo(line[0].x * width, line[0].y * height);
  context.lineTo(line[1].x * width, line[1].y * height);
  context.strokeStyle=txtcolor;
  context.stroke();
});

socket.on('clear',()=>{
  context.beginPath();
  context.clearRect(0, 0, width, height);
});

//looping function which will constantly check whether user draws or not
function mainLoop(){
  if(mouse.click && mouse.move && mouse.pos_prev){
      socket.emit('draw_line',{line:[mouse.pos,mouse.pos_prev],txtcolor:color});
      mouse.move = false;
  }
  mouse.pos_prev = {x:mouse.pos.x,y:mouse.pos.y};
  setTimeout(mainLoop,25);
}
mainLoop();

});
