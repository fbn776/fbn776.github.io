setUpCanvas("canvas",window.innerWidth,window.innerHeight);
enableMouse({
	save:false,
});

const game_lost_elm = s("#game_lost");
const game_score_elm = s("#game_score");
const restart_btn = s("#restart_btn");
s("start").addEventListener('click',function(){
	this.remove();
	fullscreen(document.body);
	
	//Variables:
	let animFrame;

	const background = new Background();
	background.setup(cw,ch);

	var player = new Player();

	//Game variables:
	var bullets_arr = [];
	let last_bullet_time = 0,
		max_bullet_time = 10;


	var enemy_arr = [];
	var max_enemy_count = 10;
	var explosions = [];

	var player_dead = false;
	var player_dead_timer = 50;

	//Scores:
	let highscore_id = "player_highscore"
	let total_kills = 0,
		bullets_used = 0;
	let highscore = parseInt(localStorage.getItem(highscore_id)) || 0;

	function handleScores(){
		let elms = game_score_elm.getElementsByTagName("div");
		for(let a of elms){
			let child = a.children[0];
			let txt = child.getAttribute("key");
			let evaled = eval(txt);
			child.innerHTML = evaled;
		}
	}
	restart_btn.addEventListener('click',restartGame);
	function restartGame(){	
		game_lost_elm.setStyle({
			visibility:`hidden`,
			transform:`translateX(-300px) scale(0)`,
			opacity:0,
		});
		s("#restart_btn").setStyle({
			transform:`translateY(-200px)`,
			opacity:0,
		});
		animFrame = undefined;
		player = new Player();
	
	 	bullets_arr = [];
		last_bullet_time = 0,
		
		enemy_arr = [];
		explosions = [];
	
		player_dead = false;
		player_dead_timer = 100;
		total_kills = 0;
		bullets_used = 0;
		animFrame = window.requestAnimationFrame(interval);
	};


	function interval(){
		clear();
		//Draw the bg
		background.draw();
		player.draw();
	
		//Bullet code:
		if(!player_dead){
			if(last_bullet_time > 0){
				last_bullet_time -= 1;
			}
			let bullet_time_bar = ((max_bullet_time - last_bullet_time)/max_bullet_time)*(2*(player.size-10));
			ctx.box(player.x-(player.size-10),player.y+player.size+5,bullet_time_bar,2,{
				color:"red",
				bg:"white",
			});	
			if(mouseX){
				if(last_bullet_time < 1){
					let diffX = mouseX - player.x,
						diffY = mouseY - player.y;
					let angle = Math.atan2(diffY,diffX);		
					player.gunDir = angle;
					bullets_arr.push(new Bullet(player.x,player.y,angle,4));
					bullets_used++;
				}
				if(last_bullet_time == 0){
					last_bullet_time = max_bullet_time;
				}
			}
			for(let i=0;i<bullets_arr.length;i++){
				let curr = bullets_arr[i];
					curr.update();
					curr.draw();
				let posX = curr.pos.x,
					posY = curr.pos.y;
				if((posX > cw) || (posX < 0) || (posY > ch) || (posY < 0)){
					bullets_arr.splice(i,1);
				}
			}
			//Enemy code:
			if(enemy_arr.length < max_enemy_count){
				for(let i=0;i<random(1,6);i++){
					if(Math.random() < 0.1 && enemy_arr.length < max_enemy_count){
						let theta = rad(random(0,360));
						let x = ((cw+50)*Math.cos(theta))+player.pos.x;
						let y = ((ch+50)*Math.sin(theta))+player.pos.y;			
						enemy_arr.push(new Enemy(x,y,{
							p:player,
							size:random(6,15),
							color:random(0,360),
						}));
					}
				}
			}
		}else {
			player_dead_timer--;		
			if(player_dead_timer < 0){
				handleScores();
				window.cancelAnimationFrame(animFrame);
				game_lost_elm.setStyle({
					visibility:`visible`,
					transform:`translateX(0px) scale(1)`,
					opacity:1,
				});
				setInterval(()=>{
					s("#restart_btn").setStyle({
						transform:`translateY(0px)`,
						opacity:1,
					});
				},300);
				var fader = setInterval(fadeCanvas,0);
				function fadeCanvas(){
					ctx.beginPath();
						ctx.fillStyle = `rgba(0,0,0,0.1)`;
						ctx.fillRect(0,0,cw,ch);
					ctx.closePath();
				};
				setTimeout(()=>{
					clearInterval(fader);
				},1000);
				return false;
			}
		}
		for(let i=0;i<enemy_arr.length;i++){
			let curr = enemy_arr[i];
			curr.update();
			curr.show();		
		
			let player_collided = circle_collision(curr.pos.x,curr.pos.y,curr.size,player.pos.x,player.pos.y,player.size);
			if(player_collided){
				explosions.push(new Explosion({
					x:curr.pos.x,
					y:curr.pos.y,
					life:100,
				}));
				enemy_arr.splice(i,1);
				player_dead = true;
			}
		
			//Check for collision b/w bullet and enemy:
			for(let j=0;j<bullets_arr.length;j++){
				let shot = bullets_arr[j];
				let collided = circle_collision(curr.pos.x,curr.pos.y,curr.size,shot.pos.x,shot.pos.y,shot.size);
				let size_range = [1,curr.size/4];
				let life = curr.size*4;
				if(collided){
					explosions.push(new Explosion({
						x:shot.pos.x,
						y:shot.pos.y,
						size_range:size_range,
						p_life:life,
					}));
					total_kills++;
					if(total_kills > highscore){
						highscore = total_kills;
						localStorage.setItem(highscore_id,total_kills);
					};
					enemy_arr.splice(i,1);
					bullets_arr.splice(j,1);
				}
			}
		}
		//Show the explosion particles:
		if(explosions.length > 3){
			explosions.splice(0,1);
		}
		for(let i=0;i<explosions.length;i++){
			let curr = explosions[i];
			curr.update();	
			if(curr.dead){
				explosions.splice(i,1);
			}	
		}	
		//Draw the gun:
		player.gun();
		//End code:
		mouseX = mouseY = undefined;
		animFrame = window.requestAnimationFrame(interval);
	}
	animFrame = window.requestAnimationFrame(interval);
});
