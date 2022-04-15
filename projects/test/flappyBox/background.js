const imgs = {
	main:{
		sun:"img/sun.png",
	},
	bush:[
		"img/bush0.png",
		"img/bush1.png",
	],
	cloud:[
		"img/cloud0.png",
		"img/cloud1.png",
	],
	tree:[
		"img/tree0.png",
		"img/tree1.png",
	]
}
function setImg(url,style){
	var img = new Image();
	img.src = url;
	img.style = style;
	return img;
}

//sun:
elms.bg.appendChild(setImg(imgs.main.sun,`
	top:10%;
	left:10%;
	width:120px;
`));

//Clouds
var cloud_pos = [
	[210,60,119],[300,180,119],[180,150,88],[240,270,112],[60,180,99]
];
for(let xy of cloud_pos){
	elms.bg.appendChild(setImg(imgs.cloud.getRandom(),`
		top:${xy[1]-(xy[2]/2)}px;
		left:${xy[0]-(xy[2]/2)}px;
		width:${xy[2]}px;
	`));	
};

var bush_pos = [
	[0,80],
	[30,70],
	[100,100],
	[140,70],
	[180,80],
	[300,100],
	[250,70],
	[canvas.width-50,120],
];
for(let xy of bush_pos){
	let x = xy[0],
		size = xy[1];
	elms.bg.appendChild(setImg(imgs.bush.getRandom(),`
		bottom:-2px;
		left:${x-(size/2)}px;
		width:${size}px;
	`));
};


var tree_pos = [
	[10,200,0,1],
	[canvas.width/2,140,-4,0],
	[canvas.width-50,170,0,1],
];
for(let tree of tree_pos){
	let x = tree[0];
	let size = tree[1];
	let zIndex = tree[2];
	let type = tree[3];
	elms.bg.appendChild(setImg(imgs.tree[type],`
		bottom:-2px;
		left:${x-(size/2)}px;
		height:${size}px;
		z-index:${zIndex};
	`));
};