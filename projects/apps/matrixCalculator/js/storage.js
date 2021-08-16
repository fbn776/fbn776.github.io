
const savedMatrix = {
	id:"savedMatrix",
	list:[],
};

const calcHistory = {
	id:"calcHistory",
	list:[],
};


if(hasStoredItem(savedMatrix.id)){
	let list = getStoredItem(savedMatrix.id);
	savedMatrix.list = JSON.parse(list);
};
function addToSavedMatrix(data){/*<data_format>:{name:"",matrix:{}}*/	
	if(data.hasProp("name") && data.hasProp("matrix")){
		savedMatrix.list.push(data);
		let list = JSON.stringify(savedMatrix.list);
		localStorage.setItem(savedMatrix.id,list);
	};
};

if(hasStoredItem(calcHistory.id)){
	let list = getStoredItem(calcHistory.id);
	calcHistory.list = JSON.parse(list);
};