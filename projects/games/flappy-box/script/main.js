const scores = {
	easy: 0,
	medium: 0,
	hard: 0,
	best: 0,
}

function checkScores() {
	for (let a of scores.getKeys()) {
		let val = localStorage.getItem(a + "-score");
		if (val == null) {
			localStorage.setItem(a + "-score", scores[a]);
		} else {
			scores[a] = parseInt(val);
		}
		s("#" + a + "HS").innerHTML = scores[a];
	}
}

function setScores() {
	for (let a of scores.getKeys()) {
		localStorage.setItem(a + "-score", scores[a]);
		s("#" + a + "HS").innerHTML = scores[a];
	}
}
checkScores();


const { canvas, ctx, cx, cy, cw, ch } = setUpCanvas(s("#main"), width, height);
const score_elm = s(".score"),
	HomeWindow = s(".home-window"),
	GameWindow = s(".game-window"),
	msgWindow = s(".message"),
	pauseMenu = s(".pause-menu");


const Game_modes = {
	easy: {
		mode: "Easy",
		barVelocity: -50,
		minGap: 120,
		maxGap: 160,
		minDist: 19 * cw,
		maxDist: 28 * cw,
		speedUpTime: 20000,
		speedUpAmount: 10,
	},
	medium: {
		mode: "Medium",
		barVelocity: -80,
		minGap: 80,
		maxGap: 130,
		minDist: 15 * cw,
		maxDist: 24 * cw,
		speedUpTime: 10000,
		speedUpAmount: 10,
	},
	hard: {
		mode: "Hard",
		barVelocity: -110,
		minGap: 60,
		maxGap: 100,
		minDist: 10 * cw,
		maxDist: 19 * cw,
		speedUpTime: 8000,
		speedUpAmount: 12,
	}
}


function initGame(mode) {
	clearCanvas(canvas);
	let props = {
		score: 0,
		stop: false,
		gameEnd: function() {

			resume_btn.style.display = "none";
			setTimeout(() => {
				pauseMenu.style.display = "block";
				setTimeout(() => {
					pauseMenu.style.opacity = 1;
				}, 0);
				pauseHS.innerHTML = props.score;
				props.stop = true;
			}, 1000);
		}
	};

	pauseMenu.style.display = "none";
	pauseMenu.style.opacity = 0;
	resume_btn.style.display = "block";
	msgWindow.style.display = "flex";
	HomeWindow.style.display = "none";
	HomeWindow.style.opacity = 0;

	GameWindow.style.display = "block";
	setTimeout(() => {
		GameWindow.style.opacity = 1;
	}, 0);
	newMsg(mode.mode + " Mode Selected");
	TimerSlide([
		() => {
			newMsg("Starts in 3..")
		},
		() => {
			newMsg("2..");
		},
		() => {
			newMsg("1..");
		},
		() => {
			newMsg("Go!");
		},
		() => {
			msgWindow.style.display = "none";
			gameFrame(mode, props);
		}
	], 500);
	let paused = false;
	pause_btn.onclick = function() {
		pauseMenu.style.display = "block";
		setTimeout(() => {
			pauseMenu.style.opacity = 1;
		}, 0);
		pauseHS.innerHTML = props.score;
		props.stop = true;
		paused = true;
	};

	resume_btn.onclick = function() {
		paused = false;
		pauseMenu.style.display = "none";
		pauseMenu.style.opacity = 0;
		props.stop = false;
	}
	home_btn.onclick = function() {
		if (paused) {
			alert("Your scores will be lost, if you quit.")
		}
		newMsg("Hi");
		pauseMenu.style.display = "none";
		pauseMenu.style.opacity = 0;
		HomeWindow.style.display = "block";
		setTimeout(() => {
			HomeWindow.style.opacity = 1;
		}, 0)
		GameWindow.style.display = "none";
		GameWindow.style.opacity = 0;
	}
}

function gameFrame(mode, props) {
	const properties = {
		barVelocity: new Vector(mode.barVelocity, 0),
	}

	const player = new Player(80, cy, properties);
	const bars = new Bars(player, properties, mode.minGap, mode.maxGap, mode.minDist, mode.maxDist);
	const clouds = new Clouds(Clouds_img_list);

	//Generate Some random clouds;
	for (let i = 0; i < random(5, 10); i++) {
		clouds.add(random(0, cw), random(0, ch))
	}

	canvas.onclick = function() {
		player.moveUp();
	}

	let now;
	let lastTime = Date.now();

	function draw() {
		now = Date.now();
		if (!props.stop) {
			let dt = (now - lastTime) / 1000.0;
			//Main code starts here;
			ctx.clearRect(0, 0, cw, ch);
			ctx.drawImage(Sun_img, 0, 0, 64, 64, 60, 80, 80, 80);

			if ((!player.hasCollision) && (player.pos.y - player.halfSize < 0 || player.pos.y + player.halfSize > ch)) {
				//Collision with the floor or roof;
				player.onCollision();
				player.color = "red"
			}
			clouds.update(dt);
			player.update(dt);
			bars.update(dt);
			player.show();

			props.score = player.score;

			if ((!player.hasCollision) && (now - player.lastSpeedUp > mode.speedUpTime)) {
				properties.barVelocity.x -= mode.speedUpAmount;
				player.lastSpeedUp = now;
			}
			score_elm.innerHTML = player.score;
			if (player.hasCollision) {
				props.gameEnd();
				console.log(player.score)
				if (player.score > scores["best"]) {
					scores["best"] = player.score;
					setScores();
				};
				console.log(scores[small(mode.mode)])
				if (player.score > scores[small(mode.mode)]) {
					scores[small(mode.mode)] = player.score;
					setScores();
				}
			}
		}
		props.animFrame = window.requestAnimationFrame(draw);
		lastTime = now
	};
	draw();
}