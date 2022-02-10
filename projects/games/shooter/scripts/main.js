/****/
const { canvas, ctx, cx, cy, cw, ch } = setUpCanvas(s("#main"), width, height);
const bg = setUpCanvas(s("#background"), width, height);


setBackground(bg.canvas)

let startBtn = s("#startGameBtn");
let top_text = s("#top_text");
let highscore = s("#highscore");



const audio = [];

/*document.body.onclick = function() {
	for (let a of c) {
		setTimeout(() => {
			//print(a)
			a.play();
		}, 100);
	}
}*/


document.body.onload = function() {
	let highscore_value = localStorage.getItem("highscore");
	highscore.innerHTML = highscore_value ? highscore_value : "0";




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


			for (let l = 0; l < audio.length; l++) {
				let curr = audio[l]
				if (curr.ended) {
					audio.splice(l, 1);
					l--;
					continue;
				};
				
				try {
					audio[l].play();
				}catch {
					audio.splice(l, 1);
					l--;
					continue;
				}
			};
			
			if (player.gameEnd && (now - player.endTime > 4000)) {
				startBtn.parentElement.style.visibility = "visible";
				startBtn.parentElement.style.opacity = 1;
				startBtn.innerHTML = "Restart"
				top_text.innerHTML = "Game Over";
				localStorage.setItem("highscore", player.score);
				highscore.innerHTML = player.score
				return false;
			}

			ctx.clearRect(0, 0, cw, ch)
			player.show()
			player.update(dt);


			//ctx.showText(100,100,audio.length,{color:"red"});


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
		fullscreen(document.body);

		startBtn.parentElement.style.opacity = 0;
		setTimeout(function() {
			startBtn.parentElement.style.visibility = "hidden";
			startGame();
		}, 300)
	}
}
