const crafts = [
	{
		name: "Craft1",
		img: Img("sprites/crafts/craft1.png"),
		dim: {
			x: 0,
			y: 0,
			w: 60,
			h: 60,
		},
		rot_time: 20,
		max_rot: 4,
		exhaust: [
			{ x: -10, y: 30 },
			{ x: 10, y: 30 },
		],

		hitbox: [
			{ x: 17, y: 2, w: 25, h: 55 },
			{ x: 2, y: 22, w: 55, h: 25 },
		],
		
		//Craft specs:
		health:100,
		damgeResistance:0,//range: [0,1]
		
		//This craft has no guns:
		noGun:true,
		shield:0,
	},
	
	{
		name: "Craft2",
		img: Img("sprites/crafts/craft2.png"),
		dim: {
			x: 0,
			y: 0,
			w: 60,
			h: 60,
		},
		rot_time: 20,
		max_rot: 5,
		exhaust: [
			{ x: -13, y: 30 },
			{ x: 13, y: 30 },
		],
		hitbox: [
			{ x: 0, y: 2, w: 60, h: 58 }
		],
		guns: [
			{ x: 5, y: 20 },
			{ x: 53, y: 20 }
		],
		maxAmmo:50,
		shield:20,
		//Craft specs
		health:100,
		damgeResistance:0.1,
		bulletColor:"green",
		bulletDamage:20,
	},
	{
		name: "Craft3",
		img: Img("sprites/crafts/craft3.png"),
		dim: {
			x: 0,
			y: 0,
			w: 60,
			h: 60,
		},
		rot_time: 20,
		max_rot: 5,
		exhaust: [
			{ x: 0, y: 32 },
		],
		hitbox: [
			{ x: 12, y: 0, w: 35, h: 60 },
			{ x: 0, y: 17, w: 60, h: 33 },
		],
		
		guns: [
			{ x: 5, y: 20 },
			{ x: 53, y: 20 }
		],
		
		maxAmmo:100,
		shield:30,
		
		//Craft specs
		health:100,
		damgeResistance:0.2,
		bulletColor:"#D50000",
		bulletDamage:30,
	},
]