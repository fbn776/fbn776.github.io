const canvas = s("#main_canvas");
const ctx = canvas.getContext("2d");

const sw = window.innerWidth;
const sh = window.innerHeight;

canvas.width = sw;
canvas.height = sh;


const cw = canvas.width,
      ch = canvas.height,
      cx = canvas.width/2,
      cy = canvas.height/2;