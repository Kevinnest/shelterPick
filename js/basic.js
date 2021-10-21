//清除绘制
function clearOverlays()
{
    map.clearOverlays();
}

//定义$,以便调用  
function $(id){  
    return document.getElementById(id);
} 

//将结果显示在地图上
function showData(shelters, dist){
	var length = arguments.length;
	var title;
	//显示初始的poi数据
	if (0 == length) {
		clearOverlays();
		loadDangerPoint();
		var arr = $("txtShelters").value.split("\n");
		for(var i=0;i<arr.length;i++){  
			var poi = arr[i].split("\t");
			var point = new BMap.Point(poi[1], poi[2]);
			var marker = new BMap.Marker(point);
			map.addOverlay(marker);
			title = (i + 1) + "、" + poi[0] + "\r\n" + "坐标:" + point.lng + "," + point.lat+ "\r\n" 
				+ "可用面积：" + poi[3] + "\r\n" + "距离：" + poi[4];
			marker.setTitle(title);
		}  
	}
	//显示筛选后的场所信息
	else if(1 == length){
		clearOverlays();
		loadDangerPoint();
		for(var i=0;i<pickedShelter.length;i++){  
			var point = new BMap.Point(pickedShelter[i][1], pickedShelter[i][2]);
			var icon = new BMap.Icon('icon/pickedMarker.png',new BMap.Size(20,29),{anchor:new BMap.Size(11,25)});
			var marker = new BMap.Marker(point,{icon:icon});
			pickedMarker.push(marker);
			map.addOverlay(marker);
			title = (i + 1) + "、" + shelters[i][0] + "\r\n" + "坐标：" + point.lng + "," + point.lat+ "\r\n" 
				+ "可用面积：" + shelters[i][3] + "\r\n" + "距离：" + shelters[i][4] + "\r\n" + "适应值：" + shelters[i][5];
			marker.setTitle(title);
		}  
	}
	//显示疏散规划的结果
	else if(2 == length){
		for (var i = 0; i < pickedMarker.length; i++) {
			map.removeOverlay(pickedMarker[i]);
		};
		for(var i=0;i<pickedShelter.length;i++){  
			var point = new BMap.Point(pickedShelter[i][1], pickedShelter[i][2]);
			var icon = new BMap.Icon('icon/pickedMarker.png',new BMap.Size(20,29),{anchor:new BMap.Size(11,25)});
			var marker = new BMap.Marker(point,{icon:icon});
			pickedMarker.push(marker);
			map.addOverlay(marker);
			title = (i + 1) + "、" + shelters[i][0] + "\r\n" + "疏散分配人数：" + Math.round(dist[i] * roadData[i][0]) + "人";
			marker.setTitle(title);
			result += title + "<br>"; 
		}  
		$("result").innerHTML = result;
	};
}