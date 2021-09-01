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
		]
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
		]
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
			{x:0,y:32},
		],
		hitbox: [
			{x:12,y:0,w:35,h:60},
			{x:0,y:17,w:60,h:33},
		]
	},
]