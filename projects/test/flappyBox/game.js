var canvas = s("#canvas");

var ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;
var cw = canvas.width,
	ch = canvas.height;	
var cx = cw/2,
	cy = ch/2;


var difficultyObj = {
	easy: {
		playerSize:10,
		nextThreshMin:180,
		nextThreshMax:280,
		level_thresh:800,
		wall_vel:-1,
		wall_vel_incr:-0.5,
		max_wall_vel:-10,
		gapMin:160,
		gapMax:260
	},
	medium: {
		playerSize:10,
		nextThreshMin:140,
		nextThreshMax:240,
		level_thresh:400,
		wall_vel:-1,
		wall_vel_incr:-0.5,
		max_wall_vel:-10,
		gapMin:80,
		gapMax:180
	},
	hard: {
		playerSize:10,
		nextThreshMin:70,
		nextThreshMax:130,
		level_thresh:200,
		wall_vel:-2.5,
		wall_vel_incr:-0.8,
		max_wall_vel:-20,
		gapMin:60,
		gapMax:140,
	},
}

/*
var playerSize = 10,
	nextThreshMin = 140,
	nextThreshMax = 240,
	level_thresh = 400,
	wall_vel = -1,
	wall_vel_incr = -0.5,
	max_wall_vel = -10,
	gapMin = 80,
	gapMax = 180;
*/
var g = new Vector(0,0.8);

function startGame(lost,diff){
	//Control variables
	
	var diffObj = difficultyObj[diff];
	
	var playerSize = diffObj.playerSize || 10,
		playerStartPos = 50,
		count = 0,
		nextThresh = 50,
		nextThreshMin = diffObj.nextThreshMin || 140,
		nextThreshMax = diffObj.nextThreshMax || 240,
		level = 0,
		level_count = 0,
		level_thresh = diffObj.level_thresh || 400,
		score = 0,
		wall_vel = diffObj.wall_vel || -1,
		wall_vel_incr = diffObj.wall_vel_incr || -0.5,
		max_wall_vel = diffObj.max_wall_vel || -10,
		gapMin = diffObj.gapMin || 80,
		gapMax = diffObj.gapMax || 180;
	
	
	//Player class
	var player = new Player(playerStartPos,playerSize,"red");
	//An array to store the poles;
	var walls = [];
	
	function gameOver(type){
		clearInterval(intervalFrames);
		var arr = ["Ops..","Oh no..","Ah..","What the.."];
		var msg = arr[Math.floor(Math.random()*arr.length)];
		message(msg);
		setTimeout(()=>{
			message(type);
			ctx.clearRect(0,0,canvas.width,canvas.height);
			lost();
		},1200);
		return true;
	}
	
	var intervalFrames = setInterval(innit,30);
	function innit(timestamp){
		ctx.clearRect(0,0,canvas.width,canvas.height);	
		
		count++;
		level++;
		
		//Code for going up;
		canvas.onclick = function(){
		 	player.applyUpForce();
		};
		
		//Code for poles
		if(count === nextThresh){
			walls.push(new Walls(canvas.width,gapMin,gapMax));
			nextThresh = Math.floor(random(nextThreshMin,nextThreshMax));
			count = 0;
		}
		
		//Code for increasing the speed of the game with time
		if(level > level_thresh && wall_vel > max_wall_vel){
			wall_vel += wall_vel_incr;
			level = 0;
			level_count++;
		}
		//End game if the player is above or below the screen
		if(player.pos.y <= 0){
			gameOver("You went off the screen",intervalFrames);
		};
		if(player.pos.y >= canvas.height){
			gameOver("You fell to the ground");
		};
		
		//Display the player
		player.show();
		
		//Code for poles
		for(let i=walls.length-1;i>=0;i--){
			walls[i].show(wall_vel);
			let curr = walls[i];
			if(curr.dim){
				let top = curr.dim.top;
				let bottom = curr.dim.bottom;			
				let p = {
					x:player.pos.x,
					y:player.pos.y,
					w:player.size,
					h:player.size,
				};
				//Check if the player collides with any poles
				//Top:
				if(((top.x < (p.x+p.w)) && ((p.x+p.w) < top.x+top.width)) && ((top.y+top.height) > p.y)){
					gameOver("You hit the top pole!!");				
				}
				//Bottom:
				if(((bottom.x < (p.x+p.w)) && ((p.x+p.w) < bottom.x+bottom.width)) && (bottom.y < (p.y+p.h))){
					gameOver("You hit the bottom pole!!");
				}				
				//Score counter
				if((top.x+(top.width/2)) < p.x && curr.passed === false){
					curr.passed = true;
					score++;
				};
			};
			//Remove the poles which are outside the screen;
			if(walls[i].x <= -walls[i].width){
				walls.splice(i,1);
			}
		};
		elms.score_count.innerHTML = score;
		if(score > highest_score){
			highest_score = score;
			localStorage.setItem("high_score",score);
			elms.high_score.innerHTML = highest_score;
		};
	}
	this.score = function(){return score};
	this.pauseGame = function(){
		clearInterval(intervalFrames);
	};
	this.clearCanvas = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);	
	};
	this.resumeGame = function(){
		intervalFrames = setInterval(innit,10);
	};
}