const sw = window.innerWidth,
			sh = window.innerHeight,
			sx = sw/2,
			sy = sh/2;


const bg_canvas = setUpCanvas("background_canvas",sw,sh);

const junks_canvas = setUpCanvas("junks_canvas",sw,sh);

const player_canvas = setUpCanvas("player_canvas",sw,sh);





var lg = new Log(document.getElementsByClassName("log")[0])