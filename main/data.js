var data = [
	{
		name:"WhatsApp message tool",
		des:"A simple tool to message numbers without actually saving them in your phone. And also has some other things up its sleeves!",
		src:"projects/apps/whatsapp/index.html",
	},{
		name:"Space shooter",
		des:"A simple space based shooter game written in js. It's not that developed. But still playable!",
		src:"projects/games/shooter/index.html"
	},{
		name:"Adding sine waves",
		des:"A simple demonstration of added sine waves.",
		src:"projects/other/sinWaves/index.html",
	},{
		name:"Simple particle sim",
		des:"This is a simple charged particles sim written in js. And works using the Coulomb's inverse square law!",
		src:"projects/other/particles_sim/index.html",
	},{
		name:"MatrixJS",
		des:"Matrix.js is a simple js library, Using this you can use matrices in your JavaScript code",
		src:"projects/libraries/matrix.js/index.html",
	},{
		name:"Matrix Calculator",
		des:"A web app for doing calculations on matrices",
		src:"projects/apps/matrixCalculator/index.html",
	},{
		name:"Camera to Ascii",
		des: "A live camera to ascii text converter",
		src:"projects/apps/ascii/index.html"
	}
];


//Sorts the data:
data.sort(function(a,b){
    if(a.name < b.name){return -1;}
    if(a.name > b.name){return 1;}
    return 0;
})
