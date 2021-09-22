var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//console.log(stats.dom)
stats.dom.style.left = "";
stats.dom.style.right = "0px";
stats.dom.style.top = "120px"


//Game over var
var gameOver = false;

//Game animation frame init
var gameFrame; // requestAnimationFrame(draw);
startAnimating(maxFps, draw);

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

//Set the bg to bg canvas:
setBackground(bg_canvas.canvas);

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

var scoreCount = 0;
var regularCount = 0;

//Junks object:
var junks = new Junks(junks_canvas.ctx)
//Enemy object:
var enemies = new Enemies(enemy_canvas.ctx, {}, junks);



fire.onclick = function() {
	player.fireBullet();
}


/*junks_canvas.canvas.onclick = function(e) {
	enemies.add(true, e.clientX, e.clientY)
}
*/


//Array for holding all the shock wave stuffs:
const shockWaveArr = [];

//Game animation function
function draw() {
	gameFrame = requestAnimationFrame(draw);

	now = Date.now();
	elapsed = now - then;
	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);

		stats.begin();

		player_canvas.ctx.clearRect(player_area.x, player_area.y - 1, player_area.w, player_area.h + 1);
		junks_canvas.ctx.clearRect(0, 0, sw, sh);
		enemy_canvas.ctx.clearRect(0, 0, sw, sh);
		//HUD clearer:
		hud_health.ctx.clearRect(0, 0, hud_health.cw, hud_health.ch);
		hud_shield.ctx.clearRect(0, 0, hud_shield.cw, hud_shield.ch);
		hud_health.ctx.clearRect(0, 0, hud_ammo.cw, hud_ammo.ch);



		junks.add();
		player.update();
		player.show();
		enemies.add();
		enemies.update();

		//For player and enemy collision:
		for (let j = 0; j < enemies.arr.length; j++) {
			let currEnemy = enemies.arr[j];
			if (!currEnemy.skipThis) {
				for (let hitbox of currEnemy.hitbox) {
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
							player.health = 0;
							player.shield = 0;
							break;
						}
					}
				}
			}
		};

		//Collision for player bullet and enemy:
		if (player.hasGun) {
			for (let k = 0; k < player.bulletArr.length; k++) {
				let currBullet = player.bulletArr[k];
				//Loop through all the enemies
				for (let l = 0; l < enemies.arr.length; l++) {
					let currEnemy = enemies.arr[l];
					if (!currEnemy.skipThis) {
						//Lopp through all the hitbox of enemy
						for (let hitbox of currEnemy.hitbox) {
							let c = hasCollisionCR({
								x: currBullet.pos.x,
								y: currBullet.pos.y,
								r: currBullet.radius,
							}, hitbox);

							if (c) {
								currEnemy.health -= player.bulletDamage;
								shockWaveArr.push(new ShockWave(junks_canvas.ctx, {
									x: currBullet.pos.x,
									y: currBullet.pos.y,
									num: 3,
									interval: 3,
									count: 10,
								}));
								if (currEnemy.health <= 0) {
									currEnemy.delObj(function() {
										enemies.arr.splice(l, 1);
										l--;
									});
								}
								player.bulletArr.splice(k, 1);
								k--;
							}
						}
					}
				}
			}
		}
		//Mainly for collision detection thats involves junks:
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
							//Works with thr shield:
							if (player.shield > 0) {
								let totalHealth = player.health + player.shield;
								totalHealth -= 100;
								player.health = totalHealth;
								player.shield = 0;

								//Sheild destroyed shockwave:
								shockWaveArr.push(new ShockWave(junks_canvas.ctx, {
									x: player.pos.x,
									y: player.pos.y,
									num: 3,
									interval: 3,
									count: 40,
									colors: [[121, 134, 203], [48, 63, 159], [26, 35, 126], [40, 53, 147]],
								}));
								//Junk destroyed shockwave:
								shockWaveArr.push(new ShockWave(junks_canvas.ctx, {
									x: currJunk.pos.x,
									y: currJunk.pos.y,
									num: 3,
									interval: 3,
									count: 20,
								}));
							} else {
								player.health = 0;
							};

							if (player.health <= 0) {
								//Single time call things:
								gameOver = true;
								//player.shield = 0;
								junks.hitJunk = currJunk;
								player.explodeStart();
								player.pauseCtrl();
							};
							junks.junks_arr.splice(i, 1);
							//enemies.stop();
						}
					};
				};
			};
			//Enemy plane - junks collision checker:
			for (let j = 0; j < enemies.arr.length; j++) {
				let currEnemy = enemies.arr[j];
				if (!currEnemy.skipThis) {
					//Enemy and junks collision
					for (let hitbox of currEnemy.hitbox) {
						//For enemy and junks:
						let c = hasCollision(hitbox, currJunk.hitbox);
						if (c) {
							currEnemy.delObj(function() {
								enemies.arr.splice(j, 1);
							});
							junks.junks_arr.splice(i, 1);
						};
					};
					//Enemy bullet and junks
					if (currEnemy.hasGun) {
						let isInsideView = hasCollision(currJunk.hitbox, currEnemy.frontViewRect);
						if (isInsideView) {
							currEnemy.fireBullet();
						};

						//Main collision:
						for (let m = 0; m < currEnemy.bulletArr.length; m++) {
							let currBullet = currEnemy.bulletArr[m];
							let cB = hasCollisionCR({
								x: currBullet.pos.x,
								y: currBullet.pos.y,
								r: currBullet.radius
							}, currJunk.hitbox);

							if (cB) {
								//Put a shockwave in the contact position
								shockWaveArr.push(new ShockWave(junks_canvas.ctx, {
									x: currBullet.pos.x,
									y: currBullet.pos.y,
									num: 3,
									interval: 3,
									count: 20,
								}));
								junks.junks_arr.splice(i, 1);
								currEnemy.bulletArr.splice(m, 1);
								i--;
								m--;
							}
						}
					}
				}
			};
			//Player Bullet - Junks collision:
			if (player.hasGun) {
				for (let k = 0; k < player.bulletArr.length; k++) {
					let currBullet = player.bulletArr[k];
					let c = hasCollisionCR({
						x: currBullet.pos.x,
						y: currBullet.pos.y,
						r: currBullet.radius,
					}, currJunk.hitbox);

					if (c) {
						//Put a shockwave in the contact position
						shockWaveArr.push(new ShockWave(junks_canvas.ctx, {
							x: currBullet.pos.x,
							y: currBullet.pos.y,
							num: 3,
							interval: 3,
							count: 20,
						}));

						junks.junks_arr.splice(i, 1);
						player.bulletArr.splice(k, 1);
						i--;
						k--;
					}
				}
			}
		};
		if (!gameOver) {
			//Enemy bullet and player collision:
			for (let j = 0; j < enemies.arr.length; j++) {
				let currEnemy = enemies.arr[j];
				if (!currEnemy.skipThis) {
					//Fire on junks if there is any junks ahead of the enemy
					if (currEnemy.hasGun) {
						let isInsideView = hasCollision(player.mainHitbox, currEnemy.frontViewRect);
						if (isInsideView) {
							currEnemy.fireBullet();
						};
						//Main collision:
						for (let m = 0; m < currEnemy.bulletArr.length; m++) {
							let currBullet = currEnemy.bulletArr[m];
							let cB = hasCollisionCR({
								x: currBullet.pos.x,
								y: currBullet.pos.y,
								r: currBullet.radius
							}, player.mainHitbox);
							if (cB && !gameOver) {
								if (player.health <= 0) {
									//Single time call things:
									player.pauseCtrl();
									player.explodeStart();
									gameOver = true;
									player.hitJunk = false;
									break;

								} else {
									let currDamage = currEnemy.bulletDamage * (1 - player.damgeResistance);
									if (player.shield > 0) {
										player.shield -= currDamage;
									} else {
										player.health -= currDamage;
									}
									//Put a shockwave in the contact position
									shockWaveArr.push(new ShockWave(junks_canvas.ctx, {
										x: currBullet.pos.x,
										y: currBullet.pos.y,
										num: 3,
										interval: 3,
										count: 10,
									}));
								}
								currEnemy.bulletArr.splice(m, 1);
								m--;
							}
						}
					}
				}
			}
		}
		//End game if player health is 0:
		if (player.health <= 0) {
			gameOver = true;
			player.pauseCtrl();
			if (!player.shockWave) {
				player.explodeStart();
			}
			//player.hitJunk = false;
		}

		//Game Over stuff
		if (gameOver) {
			let hitThing = player.hitJunk ? junks.hitJunk : false;
			initGameEnd(hitThing);
		}

		//Display all the additional shockwaves:
		for (let i = 0; i < shockWaveArr.length; i++) {
			let curr = shockWaveArr[i];

			if (curr.finished) {
				shockWaveArr.splice(i, 1);
			}
			curr.show();
		}
		//When all the game ends, break out of the loop
		if (player.gameEnd) {
			cancelAnimationFrame(gameFrame);
			return false;
		}


		//HUD stuffs:
		let health_size = (player.health / 100) * hud_health.cw;
		hud_health.ctx.box(0, 0, health_size, hud_health.ch, {
			fill: "rgba( 211, 47, 47 ,0.8)",
		});
		let bullet_size = (player.bulletCount / player.maxAmmo) * hud_ammo.cw;
		hud_ammo.ctx.box(0, 0, bullet_size, hud_ammo.ch, {
			fill: "rgba( 0, 150, 136, 0.8)",
		});
		let shield_size = (player.shield / 100) * hud_shield.cw;
		hud_shield.ctx.box(0, 0, shield_size, hud_shield.ch, {
			fill: "rgba( 63, 81, 181 ,0.8)",
		});


		//Scoreboard counter and displayer:
		if (regularCount > 100) {
			scoreCount++;
			let str = String(scoreCount);
			scoreboardElm.innerHTML = `${str[str.length-4]||''}${str[str.length-3]||0}${str[str.length-2]||0}${str[str.length-1]}`;
			regularCount = 0;
		};
		regularCount ++;

		//Manage frame rate:
		var sinceStart = now - startTime;
		stats.end();
	}
}


//End game thingy
let rot_incr = 0;
function initGameEnd(junk) {
	player.hasCollision = true;
	rot_incr += 4;
	player.rotateCraft(rot_incr);
	if (junk) {
		//junk.explode();
		junk.update();
	}
	player.explode();
}