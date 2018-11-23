var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");
var distance = 500;//距离

var Spot=function (centerX,centerY,x,y,z) {
    this.x=x;
    this.y=y;
    this.z=z;
    this.getXY=function () {
        var scale = distance / (distance + this.z);
        var x = centerX + this.x * scale;
        var y = centerY + this.y * scale;
        return {x: x, y: y};
    }
};

var Face=function (spot1,spot2,spot3,spot4,color) {
    this.s1 = spot1;
    this.s2 = spot2;
    this.s3 = spot3;
    this.s4 = spot4;
    this.color = color;
    this.zIndex = this.s1.z + this.s2.z + this.s3.z + this.s4.z;
    this.draw=function () {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.s1.getXY().x, this.s1.getXY().y);
        ctx.lineTo(this.s2.getXY().x, this.s2.getXY().y);
        ctx.lineTo(this.s3.getXY().x, this.s3.getXY().y);
        ctx.lineTo(this.s4.getXY().x, this.s4.getXY().y);
        ctx.closePath();
        ctx.shadowBlur=0.01;
        ctx.shadowColor="#fff";
        //ctx.fillStyle = "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+",0.2)";
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};
/*
*@params
颜色顺序是左上右
*/
var Rectangle =function (centerX,centerY,width,height,color1,color2,color3,text) {
    this.centerX=centerX;
    this.centerY=centerY;
    this.width=width;
    this.height=height;
    this.sopts=[];
    this._drawSpots=function () {
        //console.log(this.height)
        this.sopts.push(new Spot(centerX, centerY, 0, 0, 0));//上0132，下6754
        this.sopts.push(new Spot(centerX, centerY, 0, -this.height,0));
        this.sopts.push(new Spot(centerX, centerY, -this.width, -this.height,0));
        this.sopts.push(new Spot(centerX, centerY, -this.width, 0, 0));
        this.sopts.push(new Spot(centerX, centerY, 0,0, -this.width));
        this.sopts.push(new Spot(centerX, centerY, 0,-this.height, -this.width));
        this.sopts.push(new Spot(centerX, centerY, -this.width, -this.height, -this.width));
        this.sopts.push(new Spot(centerX, centerY, -this.width, 0, -this.width));
    },

        this._draw=function () {
            this.faces=[];
            this.faces.push(new Face(this.sopts[0],this.sopts[1],this.sopts[2],this.sopts[3],color1));//左
            //this.faces.push(new Face(this.sopts[2],this.sopts[3],this.sopts[5],this.sopts[4],color1));

            this.faces.push(new Face(this.sopts[6],this.sopts[5],this.sopts[1],this.sopts[2],color2));//上
            this.faces.push(new Face(this.sopts[7],this.sopts[4],this.sopts[0],this.sopts[3],color3));

            this.faces.push(new Face(this.sopts[5],this.sopts[4],this.sopts[0],this.sopts[1],color3));//右
            //this.faces.push(new Face(this.sopts[0],this.sopts[1],this.sopts[2],this.sopts[3],color3));
            this.faces.sort(function (a, b) {
                return b.zIndex - a.zIndex;
            });
            this.faces.forEach(function (item) {
                item.draw();
            });
            //文字描绘
            if(text){
                //console.log(text);
                ctx.shadowBlur=3;
                ctx.globalAlpha=0.66;
                ctx.arc(centerX+2,centerY-height-8,3,0,2*Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.globalAlpha=0.24;
                ctx.arc(centerX+2,centerY-height-8,7,0,2*Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.shadowBlur=0;
                ctx.globalAlpha=0.8;
                ctx.font = '14px Microsoft Yahei';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#fff';
                ctx.fillText(text, centerX+15, centerY-height);
            }
        }


};

//旋转X
function rotateX(sopts,angleX) {
    var cos = Math.cos(angleX);
    var sin = Math.sin(angleX);
    sopts.forEach(function (item) {
        var y1 = item.y * cos - item.z * sin;
        var z1 = item.z * cos + item.y * sin;
        item.y = y1;
        item.z = z1;
    });
}

//旋转Z
function rotateZ(sopts,angleZ) {
    var cos = Math.cos(angleZ);
    var sin = Math.sin(angleZ);
    sopts.forEach(function (item) {
        var x1 = item.x * cos - item.z * sin;
        var z1 = item.z * cos + item.x * sin;
        item.x = x1;
        item.z = z1;
    })
}
//上升动画
function rise(rectangles,speed) {
    rectangles.forEach(function (item) {
        item.height+=speed;
        //console.log(item.height);
        item._drawSpots();
        item._draw();
    });

    //requestAnimationFrame(rise);
}

function drawBg(){
    var img=new Image();
    img.src="./img/map.png";
    var promise=new Promise(function (resolve) {
        img.onload=function() {
            ctx.drawImage(img,0,225,904,302);
            resolve('图片渲染完成');
        };
    });
    return promise;
}
/*颜色顺序是左上右*/
var eJson=[
    {centerX:100,centerY:300,width:7,height:100,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801',text:'第一'},//黄
    {centerX:130,centerY:300,width:7,height:80,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544',text:'第一'},//红色
    {centerX:160,centerY:300,width:7,height:100,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5',text:'第一'},//蓝色
    {centerX:200,centerY:300,width:7,height:80,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
    {centerX:300,centerY:300,width:7,height:80,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
    {centerX:260,centerY:300,width:7,height:80,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
    {centerX:400,centerY:300,width:7,height:80,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
    {centerX:180,centerY:300,width:7,height:80,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544'},
    {centerX:250,centerY:300,width:7,height:80,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544'},
    {centerX:170,centerY:300,width:7,height:180,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544'},
    {centerX:525,centerY:300,width:7,height:100,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801'},
    {centerX:605,centerY:400,width:7,height:100,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801'},
    {centerX:325,centerY:400,width:7,height:200,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801'},
    {centerX:430,centerY:400,width:7,height:130,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544'},
    {centerX:530,centerY:400,width:7,height:160,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544'},
    {centerX:660,centerY:300,width:7,height:80,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
    {centerX:760,centerY:300,width:7,height:80,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
    {centerX:800,centerY:400,width:7,height:180,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'},
];
var rectangles=[];
function drawColumn(eJson) {
    eJson.forEach(function (item) {
        var rectangle=new Rectangle(item.centerX,item.centerY,item.width,item.height,item.color1,item.color2,item.color3,item.text);
        rectangles.push(rectangle);
        //初始化高度
        rectangle._drawSpots();
        //rectangle.height=0;
        rotateZ(rectangle.sopts,1);
        rotateX(rectangle.sopts,0.5);

        rectangle._draw();
        // var t=setInterval(function () {
        //     rise(rectangles,10);
        // },1000);
    });

}

function init(){
    rectangles=[];
    drawBg().then(function () {
        drawColumn(eJson);
    });
}
init();

