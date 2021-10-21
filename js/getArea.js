var drawingManager;
function newDrawingManager(){
    var styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: true, //是否开启绘制模式
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale: 0.8 //工具栏缩放比例
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    drawingManager.enableCalculate();
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    drawingManager.open();  
}  

    var overlaycomplete =function (e){  //绘制完成回调函数
        var o = e.overlay;
        bounds = o.getBounds();
        drawingManager.close();//关闭地图的绘制状态
    }
    
    //清除绘制
    function clearOverlays()
    {
        map.clearOverlays();
        drawingManager.close();
        newDrawingManager();
    }
    function search(){  
        map.clearOverlays(); //清除地图上所有标记  
        var aim=$("txtAim").value;  
        var ls=new BMap.LocalSearch("武汉市",{renderOptions:{map:map}}); 
        ls.searchNearby(aim, new BMap.Point(114.339654, 30.514296), 1500);
        var i=1;  
        ls.setSearchCompleteCallback(function(rs) {
        if (ls.getStatus() == BMAP_STATUS_SUCCESS) {
            for (j = 0; j < rs.getCurrentNumPois(); j++) {
                var poi = rs.getPoi(j);
                map.addOverlay(new BMap.Marker(poi.point)); //如果查询到，则添加红色marker  
            }
            if (rs.getPageIndex != rs.getNumPages()) {
                ls.gotoPage(i);
                i = i + 1;
            }
        }
    });
    } 

    function $(id){  
        return document.getElementById(id);//定义$,以便调用  
    } 

    function redirect(){
        window.location.href = "demo.html";
    }