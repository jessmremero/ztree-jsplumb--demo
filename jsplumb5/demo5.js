var connectorPaintStyle = {
   lineWidth: 4,
   stroke: "black",
   joinstyle: "round",
   outlineColor: "rgb(251,251,251)",
   outlineWidth:12,
 
   };
var connectorHoverStyle = {
   lineWidth: 4,
   stroke:"red",
   outlineWidth: 2,
   outlineColor: "black"
   };
var hollowCircle = {
   endpoint: ["Dot", { radius:2 }],  //端点的形状
   connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
   connectorHoverStyle: connectorHoverStyle,
   paintStyle: {
    stroke: "#1e8151",
    fill: "blue",
    lineWidth: 2
     },        //端点的颜色样式
    
  isSource: true,    //是否可以拖动（作为连线起点）
  connector: ["Bezier", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
  isTarget: true,    //是否可以放置（连线终点）
  maxConnections: -1,    // 设置连接点最多可以连接几条线
  connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
     };

var setting = {
  edit:{
      enable:true,
      showRenameBtn: true,
      renameTitle: "编辑节点名称"
  }
}
var treeNodes = [
      {"id":1,"name":"数据",open:true,
      children:[
          {"id":11,"name":"数据存储"},
          {"id":12,"name":"数据分析"},
          {"id":13,"name":"数据转换"}
      ]}
     
  ]//可以用异步的方式请求json数据 
var zTree
$(function() {  
  zTree = $.fn.zTree.init($("#tree"),setting, treeNodes)
  var nodes = $('#tree_1_ul li')
 
 
  console.log(nodes[0].innerText)
  nodes.each(function(index){
    $(this).draggable({
      helper: "clone"
    }).css("cursor","pointer")

    var i = 0;
   $("#conitaner").droppable({
    
     drop:function(event,ui){//ui就是当前被drop进容器的元素 
      var x = $(ui.helper[0]).attr('innerText')
      var mo = $(ui.draggable).attr('id')
      console.log(ui)
      console.log(ui.helper[0])//问题2、用这些方法获取元素究竟拿到了什么，对象？HTML文件？字符串？
      console.log(x)
      i++;
      var id = mo + i
      var $button = $('<button id="'+id+'"></button>').text(x).appendTo($("#conitaner")).css({
        "width":"150px",
        "height":"50px",
        "background":"RGB(10,137,255)",
        "border":"2px solid RGB(10,137,255)",
        "color":"white",
        "border-radius":"30px",
        "font-size":"14px",
        "overflow":"hidden",
        "position":"relative"
      })
      
      console.log(ui.offset.left - $(this).offset().left)
      var left = parseInt(ui.offset.left - $(this).offset().left);
      var top = parseInt(ui.offset.top - $(this).offset().top)
      $("#"+id).css({"top":top,"left":left,"position":"absolute" })
      
      jsPlumb.ready(function(){
        jsPlumb.addEndpoint(id,{anchors: "TopCenter"},hollowCircle);
        jsPlumb.addEndpoint(id,{anchors: "BottomCenter"},hollowCircle); 
      })
    jsPlumb.draggable(id)  
    console.log($("#"+id))
    $("#"+id).draggable({}).css({"cursor":"move"})
    
    var $img = $('<img class="imga" src="./images/delete.png">').appendTo($button).css({
      "width":"30px",
      "height":"30px",
      "display":"none"
    })
    $("#"+id).live("mouseenter","$button",function(){
       $(this).children('img').css({
         "display":"block",
         "position":"absolute",
         "left":"110px",
         "top":"10px",
        "cursor":"pointer"
       })
    })
    $("#"+id).live("mouseleave","$button",function(){
      $(this).children('img').css({
        "display":"none"
      })//问题1、事件监听每个地方啥时候加引号，啥时候不加，傻傻分不清楚；
     
   })
   $(".imga").live('click',"img",function(e){
     var parentDOM = $(this).parent()
     var parentID = parentDOM.attr('id')
     console.log($("#"+id))
      parentDOM.remove()
      jsPlumb.removeAllEndpoints(parentID);
      e.stopPropagation();
   })
  }
   })
  })
})//待解决问题：1、根据每个元素的input和output动态生成锚点
//2、解析ztree，遍历节点