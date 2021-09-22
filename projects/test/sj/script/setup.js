const sw = window.innerWidth,
			sh = window.innerHeight,
			sx = sw/2,
			sy = sh/2;


const bg_canvas = setUpCanvas("background_canvas",sw,sh);

const junks_canvas = setUpCanvas("junks_canvas",sw,sh);
const player_canvas = setUpCanvas("player_canvas",sw,sh);
const enemy_canvas = setUpCanvas("enemy_canvas",sw,sh);
//player_canvas = enemy_canvas = junks_canvas;

//HUD:
var hud_health = setUpOgSizeCanvas("health_canvas");
var hud_shield = setUpOgSizeCanvas("shield_canvas");
var hud_ammo = setUpOgSizeCanvas("ammo_canvas");

//Frame rate limiter element:
const maxFps = 60;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;


//Log element:
var lg = new Log(document.getElementsByClassName("log")[0]);


//Sound:
//const player_gun_sound = new Audio("../sounds/player_gun.mp3");

//Scoreboard element:
const scoreboardElm = document.getElementById("scoreboard");
