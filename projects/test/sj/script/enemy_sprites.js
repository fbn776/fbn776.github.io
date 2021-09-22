const enemy_sprites = [
	{
		name: "Enemy1",
		img: Img("sprites/enemy/enemy1.png"),
		dim: { x: 0, y: 0, w: 60, h: 60 },
		exhaust: [
			{ x: 0, y: -32 },
		],
		hitbox: [
			{x:12,y:0,w:35,h:60},
			{x:0,y:12,w:60,h:35}
		],
		hasGun:true,
		guns: [
			{x:10,y:48},
			{x:49,y:48},
		],
		
		bulletDamge:20,
	},
];