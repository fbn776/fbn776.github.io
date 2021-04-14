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
		name:"ray cast demo",
		des:"A 2D demo of ray casting. With a pre built world, with debug options. Enjoy!",
		src:"projects/other/rayCast/index.html",
	},{
		name:"Quotes v1",
		des:"A simple web app that has some popular quotes that runs like a slideshow",
		src:"projects/other/quoteV1/index.html",
	},{
		name:"Quotes v2",
		des:"Its just like 'quotes v1' but better! Enjoy!",
		src:"projects/other/quoteV2/index.html",
	},{
		name:"Simple particle sim",
		des:"This is a simple charged particles sim written in js. And works using the Coulomb's inverse square law!",
		src:"projects/other/particles_sim/index.html",
	}
];

data.sort(function(a,b){
    if(a.name < b.name){return -1;}
    if(a.name > b.name){return 1;}
    return 0;
})
