
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

    this._drawSpots=function () {
        //console.log(this.height);
        this.sopts=[];
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
                ctx.arc(centerX+1,centerY-height-height*0.08-5,3,0,2*Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.globalAlpha=0.24;
                ctx.arc(centerX+1,centerY-height-height*0.08-5,7,0,2*Math.PI);
                ctx.fill();
                ctx.shadowBlur=0;
                ctx.globalAlpha=0.8;
                ctx.beginPath();
                ctx.font = '14px Microsoft Yahei';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#fff';
                ctx.fillText(text, centerX+13, centerY-height-height*0.08+3);
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


// function drawBg(){
//     var img=new Image();
//     img.src="./img/map@2x.png";
//     var promise=new Promise(function (resolve) {
//         img.onload=function() {
//             ctx.drawImage(img,0,225,904,302);
//             resolve('图片渲染完成');
//         };
//     });
//     return promise;
// }
/*颜色顺序是左上右 260-350*/
var localJson=[
    {centerX:70,centerY:280},
    {centerX:90,centerY:300},
    {centerX:110,centerY:320},
    {centerX:360,centerY:300},
    {centerX:190,centerY:320},
    {centerX:220,centerY:300},
    {centerX:230,centerY:320},
    {centerX:250,centerY:350},
    {centerX:280,centerY:300},
    {centerX:300,centerY:300},
    {centerX:320,centerY:400},
    {centerX:350,centerY:310},
    {centerX:380,centerY:300},
    {centerX:400,centerY:400},
    {centerX:420,centerY:320},
    {centerX:450,centerY:360},
    {centerX:470,centerY:310},
    {centerX:500,centerY:330},
    {centerX:530,centerY:360},
    {centerX:550,centerY:340},
    {centerX:580,centerY:300},
    {centerX:600,centerY:420},
    {centerX:650,centerY:300},
    {centerX:660,centerY:320},
    {centerX:670,centerY:400},
    {centerX:690,centerY:320},
    {centerX:700,centerY:420},
    {centerX:710,centerY:340},
    {centerX:730,centerY:400},
    {centerX:760,centerY:300},
    {centerX:760,centerY:420},
    {centerX:800,centerY:300},
    {centerX:820,centerY:300},
    {centerX:840,centerY:400},
    {centerX:860,centerY:400},
    {centerX:880,centerY:300},
];
// var eJson=[
//     {centerX:160,centerY:300,width:7,height:100,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5',text:'第一'},//绿色
//     {centerX:160,centerY:300,width:7,height:100,color1:'#7ddcff',color2:'#3eb2fc',color3:'#0090ff',text:'第一'},//蓝色
//     {centerX:100,centerY:300,width:7,height:100,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801',text:'第一'},//黄色
//     {centerX:130,centerY:300,width:7,height:80,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544',text:'第一'},//红色
// ];
var rectangles=[];
function drawColumn(eJson) {
    rectangles=[];
    eJson.forEach(function (item) {
        var rectangle=new Rectangle(item.centerX,item.centerY,item.width,item.height,item.color1,item.color2,item.color3,item.text);
        rectangles.push(rectangle);
        //初始化高度
        rectangle._drawSpots();

        rotateZ(rectangle.sopts,1);
        rotateX(rectangle.sopts,0.5);
        rectangle._draw();
    });
    //drawBg();
}

function getText(item) {
    if(item.HosCode==470331277){
        return {text:'一院',centerX:600,centerY:340}
    }else if(item.HosCode==470331293){
        return {text:'二院',centerX:200,centerY:320}
    }else if(item.HosCode==470332499){
        return {text:'三院',centerX:680,centerY:300}
    }else if(item.HosCode==470331285){
        return {text:'妇保',centerX:620,centerY:410}
    }else if(item.HosCode==470332560){
        return {text:'骨伤',centerX:570,centerY:400}
    }else if(item.HosCode==729091015){
        return {text:'中医',centerX:740,centerY:420}
    }
}
var response=[
    {
        "HosCode": "47033024X",
        "HosName": "高桥镇社区卫生服务中心",
        "Count": "750"
    }, {
        "HosCode": "470331250",
        "HosName": "胥口镇社区卫生服务中心",
        "Count": "246"
    }, {
        "HosCode": "470331269",
        "HosName": "万市社区卫生服务中心",
        "Count": "470"
    }, {
        "HosCode": "470331277",
        "HosName": "富阳区第一人民医院",
        "Count": "2437"
    }, {
        "HosCode": "470331285",
        "HosName": "富阳区妇幼保健院",
        "Count": "1306"
    }, {
        "HosCode": "470331293",
        "HosName": "富阳区第二人民医院",
        "Count": "770"
    }, {
        "HosCode": "470332499",
        "HosName": "富阳区第三人民医院",
        "Count": "76"
    }, {
        "HosCode": "470332560",
        "HosName": "富阳中医骨伤医院",
        "Count": "563"
    }, {
        "HosCode": "470332608",
        "HosName": "常安镇社区卫生服务中心",
        "Count": "347"
    }, {
        "HosCode": "470332640",
        "HosName": "常绿镇社区卫生服务中心",
        "Count": "191"
    }, {
        "HosCode": "470332923",
        "HosName": "大源社区卫生服务中心",
        "Count": "708"
    }, {
        "HosCode": "470333248",
        "HosName": "环山乡社区卫生服务中心",
        "Count": "212"
    }, {
        "HosCode": "470333299",
        "HosName": "鹿山街道社区卫生服务中心",
        "Count": "253"
    }, {
        "HosCode": "470333520",
        "HosName": "场口社区卫生服务中心",
        "Count": "740"
    }, {
        "HosCode": "470333627",
        "HosName": "湖源乡社区卫生服务中心",
        "Count": "159"
    }, {
        "HosCode": "470333838",
        "HosName": "洞桥镇社区卫生服务中心",
        "Count": "357"
    }, {
        "HosCode": "571474867",
        "HosName": "富春街道社区卫生服务中心",
        "Count": "2216"
    }, {
        "HosCode": "729091015",
        "HosName": "富阳区中医院",
        "Count": "1707"
    }, {
        "HosCode": "733192468",
        "HosName": "春江街道社区卫生服务中心",
        "Count": "446"
    }, {
        "HosCode": "737751028",
        "HosName": "受降镇社区卫生服务中心",
        "Count": "444"
    }, {
        "HosCode": "74054672X",
        "HosName": "东洲街道社区卫生服务中心",
        "Count": "831"
    }, {
        "HosCode": "741002492",
        "HosName": "渌渚镇社区卫生服务中心",
        "Count": "273"
    }, {
        "HosCode": "741009088",
        "HosName": "灵桥镇社区卫生服务中心",
        "Count": "301"
    }, {
        "HosCode": "741009889",
        "HosName": "里山镇社区卫生服务中心",
        "Count": "168"
    }, {
        "HosCode": "741011823",
        "HosName": "新桐乡社区卫生服务中心",
        "Count": "147"
    }, {
        "HosCode": "74101504X",
        "HosName": "永昌镇社区卫生服务中心",
        "Count": "152"
    }, {
        "HosCode": "741018195",
        "HosName": "春建乡社区卫生服务中心",
        "Count": "208"
    }, {
        "HosCode": "741033862",
        "HosName": "渔山乡社区卫生服务中心",
        "Count": "200"
    }, {
        "HosCode": "759521549",
        "HosName": "上官乡社区卫生服务中心",
        "Count": "152"
    }, {
        "HosCode": "PDY110016",
        "HosName": "新登镇社区卫生服务中心",
        "Count": "761"
    }, {
        "HosCode": "PDY110040",
        "HosName": "龙门镇社区卫生服务中心",
        "Count": "97"
    }
];
 function geteJson() {
     var eJson=[];
     axios.get('api/CityBrain/hospitalinfo').then(function (response) {
         var response=response.data.Data;
         response.forEach(function (item) {
             if(item.Count<1000){
                 console.log(item)
                 eJson.push({centerX:100,centerY:300,width:7,height:item.Count,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801',text:'第一'})
             }
         });
     }).catch(function (error) {
         ctx.clearRect(0,0,canvas.width,canvas.height);
         response.forEach(function (item,i) {
             var getPlace=getText(item);
             if(item.Count<500){
                 if(getPlace){
                     eJson.push({centerX:getPlace.centerX,centerY:getPlace.centerY,width:7,height:item.Count/20,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5',text:getPlace.text})
                 }else {
                     eJson.push({centerX:localJson[i].centerX,centerY:localJson[i].centerY,width:7,height:item.Count/20,color1:'#9DF5E2',color2:'#46F1BA',color3:'#16E9A5'})
                 }
             }else if(item.Count>=500&&item.Count<1000){
                 if(getPlace){
                     eJson.push({centerX:getPlace.centerX,centerY:getPlace.centerY,width:7,height:item.Count/20,color1:'#7ddcff',color2:'#3eb2fc',color3:'#0090ff',text:getPlace.text})
                 }else {
                     eJson.push({centerX:localJson[i].centerX,centerY:localJson[i].centerY,width:7,height:item.Count/20,color1:'#7ddcff',color2:'#3eb2fc',color3:'#0090ff'})
                 }

             }else if(item.Count>=1000&&item.Count<3000){
                 if(getPlace){
                     eJson.push({centerX:getPlace.centerX,centerY:getPlace.centerY,width:7,height:item.Count/20,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801',text:getPlace.text})
                 }else {
                     eJson.push({centerX:localJson[i].centerX,centerY:localJson[i].centerY,width:7,height:item.Count/20,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801'})

                 }
             }else if(item.Count>=3000){
                 if(getPlace){
                     eJson.push({centerX:getPlace.centerX,centerY:getPlace.centerY,width:7,height:item.Count/20,color1:'#FFFDA7',color2:'#FFF853',color3:'#FFF801',text:getPlace.text})
                 }else {
                     eJson.push({centerX:localJson[i].centerX,centerY:localJson[i].centerY,width:7,height:item.Count/20,color1:'#FC6162',color2:'#FF0200',color3:'#FD4544'})
                 }
             }
         });
         drawColumn(eJson);
         console.log(error);
     });

 }

geteJson();
setTimeout(() => {
    response[0].Count=parseInt(response[0].Count)+100;
    response[1].Count=parseInt(response[1].Count)+300;
    response[3].Count=parseInt(response[3].Count)+500;
    response[4].Count=parseInt(response[4].Count)+500;
    response[5].Count=parseInt(response[5].Count)+500;
    geteJson();
},5000);


