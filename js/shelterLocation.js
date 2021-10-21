var pickedMarker = [];
var pickedShelter = [];

//录入事故发生地点
function loadDangerPoint(){
	var dangerPoint = $("txtDangerPoint").value;
	var arr = dangerPoint.split(",");
	var point = new BMap.Point(arr[0], arr[1]);
	map.centerAndZoom(point, 15);
	var icon = new BMap.Icon("icon/dangerPointMarker.png", new BMap.Size(30, 30),{anchor:new BMap.Size(15, 26)});
	var marker = new BMap.Marker(point, {icon:icon});
	map.addOverlay(marker);
	peopleNum = $("txtPeopleInDangerNum").value;
}

//挑选较为合适的避难场所
function pickShelter(){
	var arr = $("txtShelters").value.split("\n");
	var colsNum = 5;
	var shelters = new Array();
	for (var i = 0; i < arr.length; i++) {
		var poi = arr[i].split("\t");
	  	shelters[i] = new Array();
	  	for (var j = 0; j < colsNum; j++) {
	  		shelters[i][j] = poi[j];
	  	};
	};  

	var factorNum = 2;
	var degree = new Array();
	for (var i = 0; i < shelters.length; i++) {
	  	degree[i] = new Array();
	  	for (var j = 0; j < factorNum; j++) {
	  		degree[i][j] = shelters[i][colsNum - factorNum + j];
	  	};
	};  

	var max = 0.0;
	var min = 2.0;
	for (var i = 0; i < degree.length; i++) {
		max = Math.max(max, degree[i][0]);
		min = Math.min(min, degree[i][1]);
	};
	
	//灰色分析,计算效果测度
	for (var i = 0; i < degree.length; i++) {
		degree[i][0] = degree[i][0] / max;
	    degree[i][1] = min / degree[i][1];
	};

	var entropy = new Array();
	for (var i = 0; i < degree.length; i++) {
	  	entropy[i] = new Array();
	  	for (var j = 0; j < factorNum; j++) {
	  		entropy[i][j] = degree[i][j];
	  	};
	};  
	//归一化
	var sum1 = 0.0;
	var sum2 = 0.0;
	for (var i = 0; i < entropy.length; i++) {
		sum1 += entropy[i][0];
	  	sum2 += entropy[i][1];
	};
	for (var i = 0; i < entropy.length; i++) {
	  	entropy[i][0] /= sum1;
	  	entropy[i][1] /= sum2;
	};
	//计算信息熵
	var e1 = 0.0;
	var e2 = 0.0;
	for (var i = 0; i < entropy.length; i++) {
	  	e1 = entropy[i][0]*Math.log(entropy[i][0]);
	  	e2 = entropy[i][1]*Math.log(entropy[i][1]);
	};
	  
	e1 = 0 - e1 / Math.log(factorNum);
	e2 = 0 - e2 / Math.log(factorNum);

	var w1 = (1 - e1) / (2 - e1 - e2);
	var w2 = (1 - e2) / (2 - e1 - e2);

	var result = new Array();
	for (var i = 0; i < degree.length; i++) {
		result[i] = new Array();
		result[i][0] = i;
		result[i][1] = degree[i][0] * w1 + degree[i][1] * w2;
	};
	var temp;
	for (var i = 0; i < result.length; i++) {
		for (var j = i + 1; j < result.length; j++) {
			if (result[i][1] < result[j][1]) {
				temp = result[i][0];
				result[i][0] = result[j][0];
				result[j][0] = temp;
				temp = result[i][1];
				result[i][1] = result[j][1];
				result[j][1] = temp;
			};
		};
	};
	var niceNum = 0;
	var pickLeastNum = 3;
	for (var i = 0; i < result.length; i++) {
		if (result[i][1] > 0.45) {
			niceNum++;
		};
	};
	if(niceNum >= pickLeastNum){
		for (var i = 0; i < result.length; i++) {
			shelters[result[i][0]].push(result[i][1]);
			if (result[i][1] > 0.5) {
				shelters[result[i][0]].push(1);
			}else{
				shelters[result[i][0]].push(0);
			}
		};
	}else{
		for (var i = 0; i < result.length; i++) {
			shelters[result[i][0]].push(result[i][1]);
			if (i < pickLeastNum) {
				shelters[result[i][0]].push(1);
			}else{
				shelters[result[i][0]].push(0);
			};
		};
	}
	for (var i = 0; i < shelters.length; i++) {
		if (shelters[i][6] == 1) {
			pickedShelter.push(shelters[i]);
		}
	};
	showData(shelters);
};