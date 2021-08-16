function saveWindow(){
	let refer = this;
	this.nameMaxLen = 20;
	this.window = new createElm("window",{
		attr:{class:"saveWindow"},
	});	
	//Top part things:
	this.upper = new createElm("div",{
		attr:{
			class:"upper-cont",
		},
		childs:[
			new createElm("header",{text:"Save Matrix"}),
		],
	});
	this.nameCont = new createElm("div",{
		attr:{class:"inputCont"},
		childs:[
			new createElm("label",{text:"Name:"}),
			new createElm("input",{attr:{placeholder:"Enter name"}}),
		]
	});
	this.displayLabel = new createElm("label",{text:"Matrix:",attr:{class:"matrix-display-label"}});
	this.display = new createElm("div",{
		attr:{class:"matrix-display-cont"},
		childs:[
			new createElm("div",{attr:{class:"display"}}),
		]
	});
	this.upper.addChild([this.nameCont,this.displayLabel,this.display]);
	//Bottom part things:
	this.lower = new createElm("div",{
		attr:{class:"lower-cont"},
		childs:[
			new createElm("button",{text:"Cancel"}),
			new createElm("button",{text:"Save"}),			
		]
	});
	this.window.addChild([this.upper,this.lower]);	
	document.body.appendChild(this.window.elm);
	
	this.nameElm = this.nameCont.childs[1].elm;
	this.matrixElm = this.display.childs[0].elm;
	this.saveBtn = this.lower.childs[1].elm;
	this.cancelBtn = this.lower.childs[0].elm;
	
	this.displayMatrix = function(matrix){
		refer.matrixElm.innerHTML = "";
		var table = convertToTable(matrix);
		this.matrixElm.appendChild(table)
	};
	this.clearAll = function(){
		refer.nameElm.value = "";
		refer.matrixElm.innerHTML = "";
	}
	this.saveData = {};
	this.callback = undefined;
	this.open = function(data = false,call){
		if(data){
			let win = refer.window.elm;
			win.setStyle({
				visibility:"visible",
				transform:"translateY(0%)",
				opacity:1,
			});
			refer.displayMatrix(data);
			refer.saveData = data;
			if(call){
				refer.callback = call;
			}else {
				refer.callback = undefined;
			}
		}else {
			refer.saveData = {}
			new createMessage("No matrix found");
		}	
	};
	this.highlightName = function(){
		refer.nameElm.classList.add("saveAlertClass");
	};
	refer.nameElm.addEventListener('focus',function(){
		refer.nameElm.classList.remove("saveAlertClass");
	})
	this.close = function(){
		let win = refer.window.elm;
		refer.callback = undefined;
		refer.saveData = {}
		win.setStyle({
			transform:"translateY(100%)",
			opacity:0,
		});
		setTimeout(function(){
			refer.clearAll();
			win.style.visibility = "hidden";
		},300);
	};
	
	this.cancelBtn.onclick = function(){
		let wantConf = refer.nameElm.value?true:false;
		let youSure = true;
		if(wantConf){
			youSure = confirm("Do you want to go back?");
		}
		if(youSure){
			refer.close();
		}
	};
	this.saveBtn.onclick = function(){
		var value = refer.nameElm.value;
		if(value.length > 0 && value.length < refer.nameMaxLen){			
			let hasCopy = false;
			
			let currData = {
				name:value,
				matrix:refer.saveData,
				dateObj:new Date(),
			};
			currData.mainTime = Date.now();
			currData.currTime = currData.dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
			
			for(let i=0;i<savedMatrix.list.length;i++){
				let curr = savedMatrix.list[i];
				let name = curr.name;
				if(value == name){
					var wantOverwrite = confirm("Name '"+value+"' is already in use. Do you want to overwrite it?");					
					if(wantOverwrite){
						savedMatrix.list[i] = currData;
						let list = JSON.stringify(savedMatrix.list);
						localStorage.setItem(savedMatrix.id,list);
					}else {
						hasCopy = true;
					}
					break;
				}
			}
			if(!hasCopy){
				savedMatrix.list.push(currData);
						
				//At last saves the savedMatrix to local storage
				let list = JSON.stringify(savedMatrix.list);
				localStorage.setItem(savedMatrix.id,list);
				if(refer.callback){
					refer.callback();
				}
				refer.close();
				refer.saveData = {};
				new createMessage("Saved matrix as "+value,3);			
			}
		}else {
			refer.highlightName();
			if(value.length <= 0){				
				new createMessage("Name field is empty");
			}else {
				new createMessage("The character length should be less than "+refer.nameMaxLen);				
			}
		}
	};
}