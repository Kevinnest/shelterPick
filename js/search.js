//判断场所是否满足安全条件
function isDanger(poi, keys, cb){
        if(!keys[0]) {
            return cb(poi);
        }
        var ls=new BMap.LocalSearch(city,{renderOptions:{map:map}});
        ls.searchNearby(keys[0], new BMap.Point(poi.lng, poi.lat), 200);
        ls.setSearchCompleteCallback(function(rs){
            if(ls.getStatus() == BMAP_STATUS_SUCCESS){
                return cb();
            }else{
                keys.shift();
                isDanger(poi, keys, cb);
            }
        });
    }

    function POI(title, lng, lat){
        this.title = title;
        this.lng = lng;
        this.lat = lat;
    }

    //跳转页面
    function redirect(){
        window.location.href = "getArea.html";
    }

    function $(id){  
        return document.getElementById(id);//定义$,以便调用  
    }  

    //搜索场所
    function search(){  
        var ls=new BMap.LocalSearch(city,{renderOptions:{map:map}});
        $("txtResult").value=""//每次生成前清空文本域  
        map.clearOverlays(); //清除地图上所有标记  
        var s=$("txtSearch").value;  
        var r=$("txtRadius").value;
        var dangerPointArr = $("txtDangerPoint").value.split(",");
        var dangerPoint = new BMap.Point(dangerPointArr[0], dangerPointArr[1])
        ls.searchNearby(s, dangerPoint, parseInt(r));
        var i=1;  
        ls.setSearchCompleteCallback(function(rs) {
        if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
            for (j = 0; j < rs.getCurrentNumPois(); j++) {
                var poi = rs.getPoi(j);
                map.addOverlay(new BMap.Marker(poi.point)); //如果查询到，则添加红色marker  
                $("txtResult").value += poi.title + "\t" + poi.point.lng + "\t" + poi.point.lat + "\t" 
                + "area" + "\t" + (map.getDistance(dangerPoint, new BMap.Point(poi.point.lng, poi.point.lat)) / 1000).toFixed(2) 
                + '\n';
            }
            if (rs.getPageIndex != rs.getNumPages()) {
                ls.gotoPage(i);
                i = i + 1;
            }
        }
    });
    }  