var inputs = document.getElementsByTagName("input");
var menu = s("#menu");

drawPrevCanvas(10,0,11,[0,0]);
for(let a of inputs){
	if(small(a.getAttribute("type")) == "range"){
		let parent = a.parentElement;
		let min = parent.getElementsByTagName("min")[0],
			max = parent.getElementsByTagName("max")[0];
	
		let l = parent.previousElementSibling;
		let val = l.getElementsByTagName("div")[0];
	
		min.innerHTML = a.getAttribute("min");
		max.innerHTML = a.getAttribute("max");
		val.innerHTML = a.value;	
		a.addEventListener('input',()=>{
			val.innerHTML = a.value;
		});
	}
}

var config = {
	mass:1,
	size:10,
	charge:1,
	fixed:false,
	velX:0,
	velY:0,
	A:A,
}

for(let a of inputs){
	let id = a.getAttribute("id");
	a.addEventListener('input',()=>{
		if(a.getAttribute("type") == "range"){
			config[id] = parseFloat(a.value);
		}else {
			config[id] = a.checked;
		}
		drawPrevCanvas(config.size,config.charge,config.mass+10,[config.velX,config.velY]);
	});
}
canvas.addEventListener('click',function(e){
	let x = e.clientX;
	let y = e.clientY;
	let p = new Particle({
		x:x,
		y:y,
		mass:config.mass,
		size:config.size,
		charge:config.charge,
		fixed:config.fixed,
		vel:new Vector(config.velX,config.velY),
	});
	
	particles.push(p)
});


var intv = setInterval(init,30);

function openMenu(t){
	let state = t.getAttribute("state");
	if(state == "0"){
		t.setAttribute("state","1");
		pause = true;
		menu.style.visibility = "visible";
	}else {
		t.setAttribute("state","0");
		pause = false;
	}
}

function closeMenu(){
	s("#menu_btn").setAttribute("state","0");
	pause = false;
	menu.style.visibility = "hidden";
}

function init(){
	A = config.A;
	if(!pause){
	
	ctx.clearRect(0,0,cw,ch);
	for(let i=0;i<particles.length;i++){
		let curr = particles[i];
		let nArr = [].concat(particles);
		nArr.splice(i,1);
		
		for(let j=0;j<nArr.length;j++){
			let comp = nArr[j];			
			let r = distSq(curr.pos.x,curr.pos.y,comp.pos.x,comp.pos.y);
			let q1 = curr.charge,
				q2 = comp.charge;
			let f12 = curr.pos.sub(comp.pos);
				f12 = f12.unit();
			let cProd = q1*q2
				f12.mult(A*Math.abs(cProd)/r);				
			if(cProd < 0){
				f12 = f12.invert();
			}			
			let f21 = f12.invert();			
			curr.applyForce(f12);
			comp.applyForce(f21);
			
			
			let collided = circle_collision(curr.pos.x,curr.pos.y,curr.size,comp.pos.x,comp.pos.y,comp.size);		
			if(collided){
				let a = curr;
				let b = comp;
				let colli = new Vector(a.pos.x-b.pos.x,a.pos.y-b.pos.y);
				colli = colli.unit();
				let relV = new Vector(a.vel.x-b.vel.x,a.vel.y-b.vel.y);
				let speed = relV.x * colli.x + relV.y*colli.y;				
				speed *= Math.min(a.energy_lost,b.energy_lost);
				let impulse = (2*speed)/(a.mass+b.mass);	
				a.vel.x -= (impulse * b.mass * colli.x);
				a.vel.y -= (impulse * b.mass *colli.y);
				b.vel.x += (impulse * a.mass * colli.x);
				b.vel.y += (impulse * a.mass *colli.y);	
			}
			
		}
		curr.update();
		curr.show();
	}
	edgeCollision(particles);
	}
}



/*
q1 -------- q2


*/