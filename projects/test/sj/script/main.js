var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//Game over var
var gameOver = false;

//Game animation frame init
var gameFrame = requestAnimationFrame(draw);

//Format: (-1)-> To Left;(0)-> Stop;(1)-> To Right
var player_dir = 0;
//Change player dir on click:

document.body.addEventListener('click', getCursorPos);
document.body.addEventListener('touchmove', getCursorPos);

function getCursorPos(e) {
	let x = e.clientX || e.touches[0].clientX;
	player_dir = 0;
	if (x < sw / 3) {
		player_dir = -1
	} else if (x > (2 * sw) / 3) {
		player_dir = 1
	};
	//Update player directions
	player.setDir(player_dir);

};

/*
toLeft.onclick = function() {
	player_dir = -1;
	player.setDir(player_dir);
}
stopBtn.onclick = function() {
	player_dir = 0;
	player.setDir(player_dir);
}
toRight.onclick = function() {
	player_dir = 1;
	player.setDir(player_dir);
}
*/

//Set the bg to bg canvas:
setBackground(bg_canvas.canvas);

//Game Varibles and objects-------->

//Player object:
var craft = crafts[2];
var player = new Player(player_canvas.ctx, {
	x: sx,
	y: player_area.y + (player_height / 2),
	craft: craft,
	explosionClass: new ExplosionParticles(junks_canvas.ctx, {
		x: this.x,
		y: this.y,
		//	maxAge:[1,35],
		vel: {
			x: [-2, 2],
			y: [-2, 2],
		},
		useEffect: true,
	})
});

player.initDesign();

//Junks object:
var junks = new Junks(junks_canvas.ctx)
//Enemy object:
var enemies = new Enemies(enemy_canvas.ctx, {}, junks);

//Game animation function
function draw() {
	stats.begin();

//	player_canvas.ctx.clearRect(player_area.x, player_area.y - 1, player_area.w, player_area.h + 1);
	junks_canvas.ctx.clearRect(0, 0, sw, sh);
//	enemy_canvas.ctx.clearRect(0, 0, sw, sh);



	junks.add();
	player.update();

	//junks.show();

	player.show();

	enemies.add();
	enemies.update();



	for (let i = 0; i < junks.junks_arr.length; i++) {
		let currJunk = junks.junks_arr[i];

		//Update curr junk:
		let deletedAnything = junks.showIndividual(i);
		if (deletedAnything) {
			i--;
		}
		//Collisions----------->

		if (!gameOver) {

			//player and junks collision:
			if (currJunk.pos.y >= player.posY1 && currJunk.pos.y <= player.posY2) {
				for (let player_box of player.hitbox) {
					let c = hasCollision(currJunk.hitbox, player_box);
					if (c) {
						//Single time call things:
						gameOver = true;
						junks.hitJunk = currJunk;
						player.pauseCtrl();
						player.explodeStart();
						//enemies.stop();
					}
				};
			};

			//Enemy plane , junks and player collision checker:
			for (let j = 0; j < enemies.arr.length; j++) {
				let currEnemy = enemies.arr[j];
				if (!currEnemy.skipThis) {
					for (let hitbox of currEnemy.hitbox) {
						//For player and junks:
						let c = hasCollision(hitbox, currJunk.hitbox);
						if (c) {
							currEnemy.delObj(function() {
								enemies.arr.splice(j, 1);
							});
							junks.junks_arr.splice(i, 1);
						} else {
							//For player-enemy collision:
							for (let player_hitbox of player.hitbox) {
								let c = hasCollision(hitbox, player_hitbox);
								if (c) {
									currEnemy.delObj(function() {
										enemies.arr.splice(j, 1);
									});
									gameOver = true;
									player.pauseCtrl();
									player.explodeStart();
									junks.hitJunk = false;
									break;
								}
							}
						}
					}
				}
			}
		};

	}
	if (gameOver) {
		initGameEnd(junks.hitJunk);
	}
	/*
		if (!gameOver) {
			for (let i = 0; i < junks.junks_arr.length; i++) {
				let junk = junks.junks_arr[i];

				let posY1 = player.pos.y - player.sizeY / 2;
				let posY2 = player.pos.y + player.sizeY / 2;
				//If the 'junk' is near to the player, then do the collision check:
				if (junk.pos.y >= posY1 && junk.pos.y <= posY2) {
					for (let player_box of player.hitbox) {
						let c = hasCollision(junk.hitbox, player_box);
						if (c) {
							//Single time call things:
							gameOver = true;
							junks.hitJunk = junk;
							player.pauseCtrl();
							player.explodeStart();
							//enemies.stop();
						}
					};
				};

				//Collision for enemy crafts:
				for (let j = 0; j < enemies.arr.length; j++) {
					let curr = enemies.arr[j];
					if (!curr.skipThis) {
						for (let hitbox of curr.hitbox) {
							let c = hasCollision(hitbox, junk.hitbox);
							if (c) {
								curr.delObj(function() {
									enemies.arr.splice(j, 1);
									//j--;
								});
								junks.junks_arr.splice(i, 1);
								//i--;
							}
						}
					}
				}
			}
		} else {
			initGameEnd(junks.hitJunk)
		}
	*/

	//When all the game ends, break out of the loop
	if (player.gameEnd) {
		cancelAnimationFrame(gameFrame);
		return false;
	}
	stats.end()
	gameFrame = requestAnimationFrame(draw);
}


function initGameEnd(junk) {
	player.hasCollision = true;
	if (junk) {
		junk.explode();
		junk.update();
	}
	player.explode();
	player.rotateCraft(4);
}