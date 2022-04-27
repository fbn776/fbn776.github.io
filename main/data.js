var data = [
	{
		name:"WhatsApp message tool",
		des:"A simple tool to message numbers without actually saving them in your phone. And also has some other things up its sleeves!",
		src:"whatsapp",
	},{
		name:"Space shooter",
		des:"A simple space based shooter game written in js. It's not that developed. But still playable!",
		src:"shooter"
	},{
		name:"Adding sine waves",
		des:"A simple demonstration of added sine waves.",
		src:"sine-waves",
	},{
		name:"Matrix Calculator",
		des:"A web app for doing calculations on matrices",
		src:"matrix-calculator",
	},{
		name:"Camera to Ascii",
		des: "A live camera to ascii text converter",
		src:"cam-to-ascii"
	}, {
		name: "Falling Sand Game",
		des: "A falling sand game using cellular automata.",
		src: "falling-sand"
	}, {
		name: "Flappy Box",
		des: "Flappy Box; a simple clone of the iconic flappy bird.",
		src: "flappy-box",
	}, {
		name: "Cave Copter",
		des: "A game where you survive with a faulty helicopter in a cave.",
		src: "copter",
	}
];

//Sorts the data:
data.sort(function(a,b){
    if(a.name < b.name){return -1;}
    if(a.name > b.name){return 1;}
    return 0;
})
