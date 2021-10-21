function test(){
	var startPoint = new BMap.Point(114.339654, 30.514296);
	// var endPoint = new BMap.Point(114.326547,30.616189);
	var endPoint = new BMap.Point(114.345926, 30.518659);
	// var marker1 = new BMap.Marker(startPoint);
	// var marker2 = new BMap.Marker(endPoint);
	// map.addOverlay(marker1);
	// map.addOverlay(marker2);
	var transit = new BMap.TransitRoute("武汉", {
		renderOptions: {
			map: map,
			panel: "panel"
		}
	});
	transit.search(startPoint, endPoint);

	transit.setSearchCompleteCallback(function(results){
		if(transit.getStatus() == BMAP_STATUS_SUCCESS){
			var start = results.getStart();
            var end = results.getEnd();
            addStart(start.point, start.title);
            addEnd(end.point, end.title);
			var firstPlan = results.getPlan(0);
			for (var i = 0; i < firstPlan.getNumRoutes(); i++) {
				var walk = firstPlan.getRoute(i);
				if(walk.getDistance(false) > 0){
					addRoute(firstPlan.getRoute(i).getPath());
				}
			};
			var allLinePath = [];
			for (var i = 0; i < firstPlan.getNumLines(); i++) {
				var line = firstPlan.getLine(i);
				// map.addOverlay(new BMap.Polyline(line.getPath()));
				allLinePath = allLinePath.concat(line.getPath());
				addRoute(line.getPath());
			};
			map.setViewport(allLinePath);
		}
	})
	var traffic =  new BMap.TrafficLayer();
	map.addTileLayer(traffic);

}
function addStart(point, title){
	map.addOverlay(new BMap.Marker(point, {
		title: title,
		icon: new BMap.Icon("icon/dangerPointMarker.png", new BMap.Size(30, 30),{
			anchor:new BMap.Size(15, 26)
		})
	}));
}

function addEnd(point, title){
	map.addOverlay(new BMap.Marker(point, {
		title: title
		}));
}

function addRoute(path){
	map.addOverlay(new BMap.Polyline(path, {
		strokeColor: "blue",
		strokeOpacity: 0.5,
		strokeWeight: 3,
		strokeStyle: "dashed",
		enableClicking: false
	}))
}

