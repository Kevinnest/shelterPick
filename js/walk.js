
//获取步行路线
function getWalkRoute(){
	var arr = $("txtDangerPoint").value.split(',');
	var startPoint = new BMap.Point(arr[0], arr[1]);
	var target = [];
	for (var i = 0; i < pickedShelter.length; i++) {
		roadData.push([0, 0]);
		target.push(new BMap.Point(pickedShelter[i][1], pickedShelter[i][2]));
	};
	var walking = new BMap.WalkingRoute(map);
	var lineColor = ["blue", "red", "purple", "black", "green", "yellow"];
	(function loop(len, count) {
		if(len == count) return ;
	    walking.search(startPoint, target[count]);
	    walking.setSearchCompleteCallback(function(result){
	    	var route = result.getPlan(0).getRoute(0);
	    	roadData[count][1] = route.getDistance(false) / 84;
			var pts = route.getPath();
			map.addOverlay(new BMap.Polyline(pts, {
				strokeColor: lineColor[count % 5],
				strokeOpacity: 0.5,
				strokeWeight: 3,
				strokeStyle: "dashed",
				enableClicking: false
			}));
			if(len == ++count) return ;
			return loop(len, count);
		});
	})(target.length, 0);
}


