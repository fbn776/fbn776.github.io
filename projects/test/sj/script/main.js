var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


//Game animation frame init
var gameFrame = requestAnimationFrame(draw);

//Format: (-1)-> To Left;(0)-> Stop;(1)-> To Right
var player_dir = 0;
//Change player dir on click:
document.body.addEventListener('click', getCursorPos);
document.body.addEventListener('touchmove', getCursorPos);

function getCursorPos(e) {
	let x = e.clientX || e.touches[0].clientX;
	if (x < sw / 3) {
		player_dir = -1
	} else if (x > (2 * sw) / 3) {
		player_dir = 1
	} else {
		player_dir = 0
	}
	//Update player directions
	player.setDir(player_dir)
};


//Set the bg to bg canvas:
setBackground(bg_canvas.canvas);

//Game Varibles and objects-------->

//Player objects

var craft = crafts[0];

var player = new Player(player_canvas.ctx, {
	x: sx,
	y: player_area.y + (player_height / 2),
	craft: craft,
});
player.initDesign();

var junks = new Junks(junks_canvas.ctx, {

})

let cps = 0;
let time = [];

//Game animation function
function draw() {
	stats.begin();

	player_canvas.ctx.clearRect(player_area.x, player_area.y - 1, player_area.w, player_area.h + 1);
	junks_canvas.ctx.clearRect(0, 0, sw, sh);

	junks.add();
	junks.show();

	player.update();
	player.show();


	for (let junk of junks.junks_arr){
		let posY1 = player.pos.y - player.sizeY/2;
		let posY2 = player.pos.y + player.sizeY/2;
		
		//If the 'junk' is near to the player, then do the collision check:
		if (junk.pos.y >= posY1 && junk.pos.y <= posY2) {
			junks_canvas.ctx.box(junk.hitbox.x, junk.hitbox.y, junk.hitbox.w, junk.hitbox.h, {color: "green",fill: "transparent"});
		
			for (let player_box of player.hitbox) {
				player_canvas.ctx.box(player_box.x, player_box.y, player_box.w, player_box.h, {color: "red",fill: "transparent"});
				
				let c = hasCollision(junk.hitbox, player_box);
				if (c) {
					junks_canvas.ctx.box(junk.hitbox.x, junk.hitbox.y, junk.hitbox.w, junk.hitbox.h, {color: "red",fill: "transparent"});
				}
			}
		};
	}
	
	stats.end()

	gameFrame = requestAnimationFrame(draw);
}