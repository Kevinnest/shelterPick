var roadData = [];
var distribution = new Array();
var peopleNum;
var result = "疏散分配策略如下：" + "<br>"; 

//录入道路容量信息
function loadRoadSize(){
	var roadSize = $("txtRoadSize").value;
	var arr = roadSize.split(" ");
	for (var i = 0; i < roadData.length; i++) {
		roadData[i][0] = parseInt(arr[i]);
	};
}
//初始化疏散策略
function init(){
	for (var i = 0; i < roadData.length; i++) {
		distribution[i] = peopleNum / roadData.length / roadData[i][0];
	};
}

//计算当前分配策略下疏散所花费的时间
function evaluate(dist){
	var costTime = roadData[0][1] * dist[0];
	for (var i = 0; i < roadData.length; i++) {
		costTime = roadData[i][1] * dist[i] > costTime ? roadData[i][1] * dist[i] : costTime;
	};
	return costTime;
}

//生成一个领域解
function getNextDistribution(){
	var nextDistribution = distribution.concat();
	var index1 = Math.floor(Math.random() * distribution.length);
	var index2 = Math.floor(Math.random() * distribution.length);
	while(index1 == index2){
		index2 = Math.floor(Math.random() * distribution.length);
	}
	var temp = nextDistribution[index1];
	nextDistribution[index1] *=  Math.random() * 0.2 + 0.9;
	var delta = nextDistribution[index1] - temp;
	nextDistribution[index2] -= delta * roadData[index1][0] / roadData[index2][0];
	return nextDistribution;
}

//模拟退火过程
function anneal(){
	var temperature = 10000.0;
	var coolRate = 0.99;
	var absoluteTemperature = 0.00001;
	var costedTime = 0;
	var deltaTime = 0;
	var bestDistribution = new Array();
	var outIterator = 0;
	var innerLoop = 10;
	var outerLoop = 400;
	var nextDistribution =  new Array();
	var leastTime;

	init();
	costedTime = evaluate(distribution);
	leastTime = costedTime;
	bestDistribution = distribution.concat();

	while(outIterator < outerLoop && temperature > absoluteTemperature){
		for (var i = 0; i < innerLoop; i++) {
			nextDistribution = getNextDistribution();
			deltaTime = evaluate(nextDistribution) - costedTime;
			if (deltaTime < 0 || (deltaTime > 0 && Math.exp(-deltaTime / temperature) > Math.random())) {
				distribution = nextDistribution.concat();
				costedTime = deltaTime + costedTime;
			}
			if (costedTime < leastTime){
				bestDistribution = nextDistribution.concat();
				leastTime = costedTime;
			}
			temperature *= coolRate;
		};
		outIterator++;
	}
	console.log(bestDistribution
					+"\n最短所需时间:"+leastTime+"\n");
	result += "疏散所需时间：" + leastTime.toFixed(2) + "min<br>";
}

//疏散策略计算
function evacuation(){
	result = "疏散分配策略如下：" + "<br>";
	loadRoadSize();
	anneal();
	showData(pickedShelter, distribution);
}