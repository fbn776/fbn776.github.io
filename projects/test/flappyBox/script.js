var highest_score = 0;
if(localStorage.hasOwnProperty('high_score')){
	highest_score = parseInt(localStorage.getItem('high_score'));
}
elms.high_score.innerHTML = highest_score;

const win = {
	main:s(".window_main"),
	level:s(".window_level_selector"),
	game:s(".window_game"),
	pause:s(".pause_menu"),
	pause_bg:s(".pause_menu_bg"),
	lost:s(".lost_menu"),
	lost_bg:s(".lost_menu_bg"),
}
function message(msg){
	elms.msg.style.opacity = 1;
	let angles = [20,-20,15,-15,18,-18,25,-25];
	let rot = angles[Math.floor(Math.random()*angles.length)];
	elms.msg.style.transform = `scale(1) rotate(${rot}deg)`;
	elms.msg.innerHTML = msg;
	
	setTimeout(()=>{
		elms.msg.style.opacity = 0;		
		elms.msg.style.transform = `scale(0) rotate(0deg)`;
	},1000);
}

function goToLevelSec(){
	winOp(win.main,"close");
	setTimeout(()=>{
		winOp(win.level,"open");
	},200)
}
function goBackToMain(){
	winOp(win.pause,"close");
	winOp(win.pause_bg,"close");
	winOp(win.lost,"close");
	winOp(win.lost_bg,"close");
	winOp(win.level,"close");
	setTimeout(()=>{
		winOp(win.main,"open");
	},200)
}

function startGameOn(t){
	var difficulty = small(t);
	winOp(win.level,"close");
	setTimeout(()=>{
		winOp(win.game,"open");		
		setTimeout(()=>{
			message("Game starts in 3!!");
			setTimeout(()=>{
				message("Game starts in 2!!");
				setTimeout(()=>{
					message("Game starts in 1!!");
					setTimeout(()=>{
						message("Start!!!");
						var gameFunc = new startGame(onFail,difficulty);
						function onFail(){
							elms.lost.curr_score.innerHTML = gameFunc.score();
							winOp(win.lost,"open");
							winOp(win.lost_bg,"open");
							elms.lost.home.onclick = function(){
								winOp(win.lost,"close");
								winOp(win.lost_bg,"close");
								winOp(win.game,"close");
								winOp(win.pause,"close");
								winOp(win.pause_bg,"close");
								gameFunc.clearCanvas();
								setTimeout(()=>{
									winOp(win.main,"open");
								},200);
							}
							elms.lost.replay.onclick = function(){					
								
								winOp(win.lost,"close");
								winOp(win.lost_bg,"close");
								winOp(win.pause,"close");
								winOp(win.pause_bg,"close");
								setTimeout(()=>{
									startGameOn(difficulty);
								},200);
							}
						}
						elms.pause_ic.onclick =function(){
						
							winOp(win.pause,"open");
							winOp(win.pause_bg,"open");
							winOp(win.lost,"close");
							winOp(win.lost_bg,"close");
							elms.pause.curr_score.innerHTML = gameFunc.score();
							gameFunc.pauseGame();
							elms.pause.home.onclick = function(){
								winOp(win.pause,"close");
								winOp(win.pause_bg,"close");
								winOp(win.game,"close");
								gameFunc.clearCanvas();
								winOp(win.pause,"close");
								winOp(win.pause_bg,"close");
								winOp(win.lost,"close");
								winOp(win.lost_bg,"close");
								setTimeout(()=>{
									winOp(win.main,"open");
								},200);
							};
							elms.pause.restart.onclick = function(){
								winOp(win.pause,"close");
								winOp(win.pause_bg,"close");
								winOp(win.lost,"close");
								winOp(win.lost_bg,"close");
								startGameOn(difficulty);
							};
							elms.pause.resume.onclick = function(){
								winOp(win.pause,"close");
								winOp(win.pause_bg,"close");
								winOp(win.lost,"close");
								winOp(win.lost_bg,"close");
								setTimeout(()=>{
									message("Starts in..");
									setTimeout(()=>{
										message("2");
										setTimeout(()=>{
											message("1");
											setTimeout(()=>{
												message("Start!!!");
												gameFunc.resumeGame();
											},1000)
										},1000)
									},1000)
								},200);
							};
						};
					},1000);
				},1000);
			},1000);			
		},0);		
	},200);
}