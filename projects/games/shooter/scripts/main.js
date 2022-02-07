/****/
const { canvas, ctx, cx, cy, cw, ch } = setUpCanvas(s("#main"), width, height);
const bg = setUpCanvas(s("#background"), width, height);


setBackground(bg.canvas)

let startBtn = s("#startGameBtn");
let top_text = s("#top_text");
let highscore = s("#highscore");

document.body.onload = function() {
	let highscore_value = localStorage.getItem("highscore");
	highscore.innerHTML = highscore_value?highscore_value:"0";
	
	
	function startGame() {
		const player = new Player(ctx, cx, cy);
		document.body.onclick = function(e) {
			player.fireAt(e.clientX, e.clientY)
		}
		document.body.ontouchmove = function(e) {
			player.fireAt(e.touches[0].clientX, e.touches[0].clientY)
		}

		const enemies = new Enemies(ctx, player)
		player.enemies = enemies;
		let lastEnemySpawnTime = 0;
		let now;
		let lastTime = Date.now();

		function draw() {
			now = Date.now();
			let dt = (now - lastTime) / 1000.0;

			if (player.gameEnd && (now - player.endTime > 4000)) {
				startBtn.parentElement.style.visibility = "visible";
				startBtn.parentElement.style.opacity = 1;
				startBtn.innerHTML = "Restart"
				top_text.innerHTML = "Game Over";
				localStorage.setItem("highscore",player.score);
				highscore.innerHTML = player.score
				return false;
			}

			ctx.clearRect(0, 0, cw, ch)
			player.show()
			player.update(dt);

			if (Math.random() < 0.05 && (now - lastEnemySpawnTime) > 300) {
				enemies.add();
				lastEnemySpawnTime = now;
			}
			enemies.update(dt);

			//Score:
			ctx.showText(cw - 50, 50, player.score, {
				color: "white",
				font: "20px monospace"
			});


			window.requestAnimationFrame(draw);
			lastTime = now;
		};
		draw();
	}

	startBtn.onclick = function() {
		startBtn.parentElement.style.opacity = 0;
		setTimeout(function() {
			startBtn.parentElement.style.visibility= "hidden";
			startGame();
		}, 300)
	}
}
