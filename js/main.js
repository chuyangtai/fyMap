+function () {
    'use strict';

    // 统计
    let stats = { ydzf: 0, sxzz: 0, rydj: 0, yygh: 0, mzjz: 0 };
    let statsPercent = { ydzf: 0, sxzz: 0, rydj: 0, yygh: 0, mzjz: 0 };
    // 支付
    let pays = { zfb: 0, wx: 0, xyjy: 0, ydyb: 0, ylzf: 0 };

    // 当前挂号、当前就诊
    let chartTab = {'rycs':0,'csrs':0, 'crbk':0,'jjcccs':0,'jjcdms':0};

    //图表
    let barTab = {week:'周', month:'月'}



    let mapName = 'fyMap';

    let weekData = [10, 52, 200, 334, 390, 330, 220];
    let monthData= [10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220,100,150];

    function Platforms (patients, referrals) {
        // 统计
        this.stats = stats;
        this.statsPercent = statsPercent;
        this.pieCharts = [];

        // 实时就诊
        this.patients = [];
        this.idx = -1;
        this.removeIndex = 0;

        // 双向转诊
        this.referrals = [];
        this.removeRIndex = 0;

        // 支付
        this.pays = pays;

         // 地图
        this.startAt = new Date().getTime();
        this.mapChart = null;


        this.chartTab = chartTab;
        this.visits = 0;

        // 时间
        this._date = '';

        // 就诊时长、住院天数
        this.charts = [];
        this.options = [];
        // this.doms = [
        //     { id: 'visitTime', type: 'bar', name: '就诊时长' },
        //     { id: 'hod', type: 'line', name: '住院天数' }
        // ];
        this.barTab = barTab;
        this.weekData = weekData;
        this.monthData = monthData;

        this.init(patients, referrals);
    }

    Platforms.prototype.init = function () {
        this.winResize();

        // this.setChartInit();
    };

    Platforms.prototype.winResize = function () {
        window.onresize = () => {
            this.pieCharts.forEach((o) => {
                o.resize();
            });
        };
    };



    // referral 是否转诊
    Platforms.prototype.addPatients = function (list, referral) {
        if (list == null || list.length == 0) return;

        list.forEach((o) => {
            this.addPatient(o, referral);
        });
    };
    Platforms.prototype.addPatient = function (item, referral, remove) {
        let pf = this;
        let coords = [];

        if (referral) {
            let orig = this.findHospital(item.fromName);
            if (!orig) return;
            coords.push(orig.value);
        }
        else {
            coords.push(item.coord);
        }

        let ctime = new Date().getTime();
        let x = ctime - this.startAt;
        let sIndex = referral ? 3 : 2;
        let rIndex = referral ? 'removeRIndex' : 'removeIndex';
        var payType = ['','门诊急诊', '移动支付', '入院登记,', '预约挂号', '双向转诊'];
        if (!referral) {
            let _unshift = () => {
                this.patients.unshift({
                    type: item.Type,
                    patientType: payType[item.Type],
                    patientName: item.Name,
                    sex: item.Sex == '1' ? '男' : '女',
                    dept: item.DeptName,
                    hospitalName: item.type == 5 ? item.DeptName : item.HospatileName,
                    visitTime: item.VistiTime,
                    index: this.idx++
                });
            };
            if (this.patients.length == 11) {
                this.patients.splice(10, 1);
                _unshift();
            }
            else {
                _unshift();
            }
        }

    };

    // 日期
    Platforms.prototype.getDate = function () {
        let pf = this;
        var _geDate = () => {
            var days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
            var today = new Date();
            var yy = today.getFullYear(),
            MM = this.numFormat(today.getMonth() + 1),
            dd = this.numFormat(today.getDate()),
            day = today.getDay(),
            h = this.numFormat(today.getHours()),
            m = this.numFormat(today.getMinutes()),
            s = this.numFormat(today.getSeconds());
            console.log(days[day]);
            pf._date = '<span>'+yy + '-' + MM + '-' + dd + ' ' +  days[day] +'</span><span class="font-digiface">'+h + ':' + m  + ':' +s+'</span>';

        }

         // 初始化数据
         _geDate();
         // 定时获取数据
         //setInterval(_geDate, 1000);

       };
    Platforms.prototype.dateTemplate = function () {
        let pf = this;
        return {
            template: `<div class="date" v-html="dates"></div>`,
            computed: {
                dates: function () {
                    return pf._date;
                }
            },
            mounted: function () {
                this.$nextTick(function () {
                    pf.getDate();
                });
            }
        }
    };

    // 数字格式化
    Platforms.prototype.numFormat = function (num, len) {
        len = len || 2;

        let dst = [];
        let orig = String(num),
            start = len - orig.length;

        if (start < 0) return orig;

        for (var i = 0; i < len; i++) {
            if (i < start) {
                dst.push(0);
                continue;
            }
            dst.push(orig.charAt(i - start));
        }
        return dst.join('')
    };

    // 统计仪表数字
    Platforms.prototype.statsTemplate = function () {
        let pf = this;
        let li = {
            props: ['stat'],
            template: '\
                        <li>\
                            <p>\
                              <transition-group name="stat-fade" tag="span" mode="out-in" :style="`width:${list.length-0.25}rem;`">\
                                    <i v-for="(item, index) in list" :key="\'stat-key\'+index+item" class="stat-fade-item stat-item" :class="\'stat-fade-item\'+index">\
                                        {{item}}\
                                    </i>\
                                </transition-group>\
                            </p>\
                            <span class="stat-name">{{stat.value}}</span>\
                            <div v-if="stat.key==\'mzjz\'" class="chart-pie" ref="chart2">{{stat.key}}</div>\
                            <div v-else class="chart-pie" ref="chart"></div>\
                        </li>\
                    ',
            // template:'<li></li>',
            computed: {
                list: function () {
                    return pf.numFormat(pf.stats[this.stat.key], 4).split('');
                }
            },
            data () {
                return {
                    statsPercent:pf.statsPercent
                }},
            mounted: function () {
                this.$nextTick(function () {
                    // debugger
                    pf.initGauge(this.$refs, this.stat.value,this.statsPercent[this.stat.key]);
                });
            },
            watch:{
                list:function(val){
                    pf.initGauge(this.$refs, this.stat.value,this.statsPercent[this.stat.key]);
                }
            }
        };

        return {
            template: '<ul class="stats"><stat v-for="(value,key) in list" :stat="{key:key,value:value}" :key="key"></stat></ul>',
            data () {
                return {
                    // date: pf.getDate(),
                    list: { ydzf: '区域就诊', sxzz: '移动支付', rydj: '预约挂号', yygh: '双向转诊', mzjz: '入院登记' }
                };
            },
            components: {
                stat: li
            }
        }
    };
    Platforms.prototype.initGauge = function (dom, name,value) {
       //console.log(value)
        let option = {
            series: [
                {
                    name: name,
                    type:'gauge',
                    min:0,
                    max:100,
                    splitNumber:10,
                    radius: '100%',
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, '#F43335'],[0.6, '#6BCEFC'],[1, '#4DECBA']],
                            width: 4,
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 5
                        }
                    },
                    axisLabel: {            // 坐标轴小标记
                        textStyle: {       // 属性lineStyle控制线条样式
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :11,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 0
                        }
                    },
                    splitLine: {           // 分隔线
                        length :15,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width:2,
                            color: '#fff',
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 5
                        }
                    },
                    pointer: {           // 分隔线
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 2,
                        width:4
                    },
                    title : {
                        show:false
                    },
                    detail : {
                        show: false
                    },
                    data:[{'value': value, 'name': ''}]
                }]
        };
        let pie;
        //console.log(dom);
        if(dom.chart2){
            option.series[0].max=20000;
            option.series[0].splitNumber=8,
            option.series[0].axisLine.lineStyle.color= [[0.2, '#F43335'],[0.8, '#6BCEFC'],[1, '#F43335']];
            option.series[0].axisLabel= {
                formatter:function(v){
                    if(v==2500||v==7500||v==12500||v==17500){
                        return '';
                    }else {
                        return v/1000+'k';
                    }

                }
            };
            pie = echarts.init(dom.chart2);
        }else{
            pie = echarts.init(dom.chart);
        }

        pie.setOption(option);
        this.pieCharts.push(pie);
    };
    //仪表盘
    Platforms.prototype.setStats = function () {
     let pf=this;

        setInterval(() => {
            axios.get('api/CityBrain/DashBoardInfo').then(function (response) {
                var response=response.data.Data;
                response.forEach(function (item) {
                    if(item.Type==1){
                        pf.stats.ydzf=item.Count;
                        pf.statsPercent.ydzf=item.Percent;
                    }else if(item.Type==2){
                        pf.stats.sxzz=item.Count;
                        pf.statsPercent.sxzz=item.Percent;
                    }else if(item.Type==3){
                        pf.stats.rydj=item.Count;
                        pf.statsPercent.rydj=item.Percent;
                    }else if(item.Type==4){
                        pf.stats.yygh=item.Count;
                        pf.statsPercent.yygh=item.Percent;
                    }else if(item.Type==5){
                        pf.stats.mzjz=item.Count;
                        pf.statsPercent.mzjz=item.Percent;
                    }
                });
            }).catch(function (error) {
                let response= [{
                    "Type": "1",
                    "Count": "14192",
                    "Percent": "59"
                }, {
                    "Type": "2",
                    "Count": "1213",
                    "Percent": "20"
                }, {
                    "Type": "3",
                    "Count": "2013",
                    "Percent": "34"
                }, {
                    "Type": "4",
                    "Count": "363",
                    "Percent": "4"
                }, {
                    "Type": "5",
                    "Count": "180",
                    "Percent": "2000"
                }];
                response.forEach(function (item) {
                    if(item.Type==1){
                        pf.stats.ydzf=item.Count;
                        pf.statsPercent.ydzf=item.Percent;
                    }else if(item.Type==2){
                        pf.stats.sxzz=item.Count;
                        pf.statsPercent.sxzz=item.Percent;
                    }else if(item.Type==3){
                        pf.stats.rydj=item.Count;
                        pf.statsPercent.rydj=item.Percent;
                    }else if(item.Type==4){
                        pf.stats.yygh=item.Count;
                        pf.statsPercent.yygh=item.Percent;
                    }else if(item.Type==5){
                        pf.stats.mzjz=item.Count;
                        pf.statsPercent.mzjz=item.Percent;
                    }
                });
                console.log(pf.statsPercent)
                console.log(error);
            });

        }, 3000);

    };


    // 实时就诊
    Platforms.prototype.patientsTemplate = function () {
        let pf = this;
        return {
            template: '<div class="patients">\
                    <transition-group name="patients" tag="ul">\
                        <li v-for="(item, index) in list" :key="\'patient-key\'+item.index">\
                            <p class="white">{{item.visitTime}} [{{item.patientType}}]</p>\
                            <p><span class="blue">{{item.patientName}} {{item.sex}}</span>  在 <span class="white">{{item.hospitalName}} {{item.dept}}</span>\
                            <span v-if="item.type==1">就诊</span>\
                            <span v-if="item.type==2">就诊</span>\
                            <span v-if="item.type==3">住院</span>\
                            <span v-if="item.type==4">挂号</span>\
                            <span v-if="item.type==5">转诊</span>\
                            </p>\
                        </li>\
                    </transition-group>\
                </div>',
            data () {
                return {
                    list: pf.patients
                }
            }
        }
    };

    // 就诊时长、住院天数
    Platforms.prototype.setChartOption = function(opt){
        let _custom = {};
        let _base = {
            color: ['#3398DB'],
            grid: {
                left: 0,
                right: 0,
                top: '3%',
                bottom: 0,
                containLabel: true
            },
            yAxis : [
                {
                    type : 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#0b3055'
                        }
                    }
                }
            ]
        }
        switch (opt.type) {
            case 'bar':
                _custom = {
                    xAxis : [
                        {
                            type: 'category',
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8497b4'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data: this.weekData
                        }
                    ]
                }
            break;
            case 'line':
                _custom = {
                    xAxis : [
                        {
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8497b4'
                                }
                            }
                        }
                    ],
                    series: [{
                        data: this.weekData,
                        type: 'line',
                        itemStyle:{
                            borderColor: '#0078e3'
                        },
                        lineStyle:{
                            color: 'rgba(0, 120, 227, 0.25)'
                        },
                        areaStyle: {
                            color: 'rgba(0, 120, 227, 0.25)'
                        }
                    }]
                }
            break;
        }
        this.options.push({
            baseOption: _.extend({}, _base, _custom),
            options: []
        });
    };
    Platforms.prototype.setChartInit = function () {
        window.onresize = () => {
            this.charts.forEach((o) => {
                o.resize();
            });
        };
    };
    Platforms.prototype.barTabTemplate = function () {
        let pf = this;
        return {
            props:['order'],
            template: `<div class="barTab" ref="ttt">
                            <span v-for="(item,key,index) in list" :class="{active:index === number}" @click="change(index,key)">{{item}}</span>
                        </div>`,
            data () {
                return {
                    list: pf.barTab,
                    number: 0
                }
            },
            methods:{
                change:function(index, key){
                    this.number= index;
                    pf.setChartData(this.order, index)
                }
            }
        }
    }
    Platforms.prototype.setChartData = function(order, index){
        this.options[order].baseOption.series[0].data = index == 0 ? weekData : monthData;
        this.charts[order].setOption(this.options[order]);
    }

    // 支付
    Platforms.prototype.paysTemplate = function () {
        let pf = this;
        let li = {
            props: ['pay','val'],
            template:`<li class="flex justify-between" :class="pay">
                        <label>{{val}}</label>
                        <div>
                            <transition-group name="pay-flip" tag="span" mode="out-in" class="font-digiface">\
                                <i v-for="(item, index) in list" :key="\'pay-key\'+index+item.value" class="pay-flip-item pay-item" :class="\'pay-flip-item\'+(item.index)">\
                                    {{item.value}}\
                                </i>\
                            </transition-group>\
                        笔数</div>
                    </li>`,
            computed: {
                list: function () {
                    let _list = [];
                    let _pays = pf.numFormat(pf.pays[this.pay], 5).split('');

                    _pays.forEach((o, i) => {
                        _list.push({
                            value: o,
                            index: _pays.length - i - 1
                        });
                    });

                    return _list;
                }
            }
        };

        return {
            template: `<ul class="pays">
                          <pay v-for="(key,index) in list" :pay="key.name" :key="key.name" :val="key.value" :class="'bg-fade'+(index)"></pay>
                       </ul>`,
            data () {
                return {
                    list: [{ name:'xyjy', value:'信用就医'},{name:'zfb', value:'支付宝'},{name:'wx', value:'微信'},{name:'ylzf', value:'银联支付'}]
                };
            },
            components: {
                pay: li
            }
        }
    };
    Platforms.prototype.setPays = function () {
        for (let key in this.pays) {
           // console.log(this.pays)
            setTimeout(() => {
                // 1-100
                this.pays[key] += Math.floor(Math.random() * 10 + 1);

                setInterval(() => {
                    this.pays[key] += Math.floor(Math.random() * 10 + 1);
                }, 2000);

            }, [300, 450, 600, 750, 900][Math.floor(Math.random() * 5)]);

            this.pays[key] += 100;
        }
    };

    // 标签
    Platforms.prototype.tabsTemplate = function () {
        let pf = this;

        let div = {
            props: ['vis','val'],
            template: `<div>
                            <label>{{val}}</label>
                            <transition-group name="pay-fade" tag="span" mode="out-in" class="font-digiface">
                                <i v-for="(item, index) in list" :key="'vis-key'+index+item.value" class="vis-fade-item" :class="'vis-fade-item'+(item.index)">
                                    {{item.value}}
                                </i>
                            </transition-group>
                        </div>`,
            computed:{
                list: function () {
                    let _list = [];
                    let _vis = pf.numFormat(pf.chartTab[this.vis], 4).split('');

                    _vis.forEach((o, i) => {
                        _list.push({
                            value: o,
                            index: _vis.length - i - 1
                        });
                    });

                    return _list;
                }
            }
        };

        return {
            // template: '<div class="chart-map" ref="chart"></div>',
            template: `<div class="map">            
                            <div class="chart-tab">
                                <vis v-for="(item, index) in list" :vis="index" :val="item" :key="index"></vis>
                            </div>
                        </div>`,
            data () {
                return {
                    list: {'rycs':'入院人次','csrs':'出生人数','crbk':'传染报卡','jjcccs':'急救车出车数','jjcdms':'急救车待命数'}
                };
            },
            components: {
                vis: div
            },
            mounted: function () {
                this.$nextTick(function () {

                });
            }
        }
    };
    //排行饼图
    Platforms.prototype.pieTemplate=function(){
        let pf = this;
        return {
            template: `<div class="rank-pie" ref="pieChart"></div>`,
            data () {
                return {

                }
                },
                mounted: function () {
                    pf.initPie(this.$refs.pieChart,'排行')
                }
            }
    };
    Platforms.prototype.initPie = function (dom, name) {
        let option =  {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ['rgba(255,74,73,1)', 'rgba(255,251,160,1)', 'rgba(37,166,255,1)', 'rgba(123,218,254,1)', 'rgba(56,236,181,1)'],
            legend: {
                orient: 'vertical',
                data:['急性上呼吸道感染','急性支气管炎','高血压','糖尿病','慢性胃炎'],
                right: 10,
                top: 20,
                bottom: 20,
                itemWidth:8,
                itemHeight:8,
                textStyle:{
                    color:'#DCE2FE'
                }
            },
            label: {
                normal: {
                    formatter: '{{c}  {per|{d}%}'
                }
            },
            lineStyle: {
                normal: {
                    opacity: 0.4
                }
            },
            series: [
                {
                    name:name,
                    type:'pie',
                    center: ['30%', '43%'],
                    radius: ['26%', '52%'],
                    avoidLabelOverlap: false,
                    itemStyle:{
                        opacity: 0.85
                    },
                    label: {
                        color:'#DCE2FE',
                        normal: {
                            formatter: '{c}',
                            textStyle: {
                                color: '#DCE2FE'
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16px',
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#DCE2FE'
                            },
                        }
                    },

                    data:[
                        {value:1566, name:'急性上呼吸道感染'},
                        {value:310, name:'急性支气管炎'},
                        {value:234, name:'高血压'},
                        {value:135, name:'糖尿病'},
                        {value:1548, name:'慢性胃炎'}
                    ]
                }
            ]
        };

        let pie = echarts.init(dom);
        pie.setOption(option);

        this.pieCharts.push(pie);
    };

    Platforms.prototype.setChartTab = function () {
        for (let key in this.chartTab) {
            setTimeout(() => {
                // 1-100
                this.chartTab[key] += Math.floor(Math.random() * 10 + 1);

                setInterval(() => {
                    this.chartTab[key] += Math.floor(Math.random() * 10 + 1);
                }, 2000);

            }, [300, 450, 600, 750, 900][Math.floor(Math.random() * 5)]);

            this.chartTab[key] += 100;
        }
    };

    // 实时就诊
    Platforms.prototype.setPatients = function () {
        var pIndex, pItv;

        var data;

        var _getPatitent = () => {
            this.getPatients((list) => {
                pIndex = 0; // 新数据 直接替换当前
                data = list;

                if (this.patients.length === 0) {
                    pIndex = data.length > 11 ? 11 : data.length;
                    this.addPatients(data.slice(0, pIndex));
                }
                if (!pItv) {
                    pItv = setInterval(() => {
                        // 暂停数据填充
                        if (pIndex === data.length) {
                            clearInterval(pItv);
                            pItv = null;
                            // 继续播放剩余数据
                            if (pIndex) {
                                this.patients.splice(10, 1);
                            }
                            return;
                        }
                        this.addPatient(data[pIndex], false, true);
                        //this.updateMap();
                        pIndex++;
                    }, 2000);
                }

            });
        };

        // 初始化数据
        _getPatitent();
        // 定时获取数据
        setInterval(_getPatitent, 30000);
    };


    Platforms.prototype.render = function () {
        // stats
        this.setStats();

        // pays
        this.setPays();

        // this.setPatients(testdata, testdata1);
        this.getPatients();
        this.setPatients();


        // HOD
        // this.initHOD()

        this.setChartInit();
        this.setChartTab();

    };

    // 获取实时就诊数据
    Platforms.prototype.getPatients = function (callback) {
        axios.get('/dataLists').then(function (response) {
            var response = response.data.Data;
            callback(response);
        }).catch(function (error) {
            let j = [{//response.Data
                "VistiTime": "21:14:01",
                "Type": "4",
                "Name": "鲁果",
                "Sex": null,
                "DeptName": "眼科门诊",
                "HospatileName": "富阳区第一人民医院"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }, {
                "VistiTime": "21:13:21",
                "Type": "4",
                "Name": "许杰",
                "Sex": null,
                "DeptName": "皮肤科",
                "HospatileName": "富阳区中医院222"
            }];
            callback(j);
            console.log(error);
        });
    };
    // 获取双向转诊数据
    Platforms.prototype.getReferrals = function (callback) {
        setTimeout(() => {
            callback([
                { fromName: '富阳妇幼保健院', toName: '朝天区妇幼保健院' },
                { fromName: '富阳中心医院', toName: '旺苍县中医院' },
                { fromName: '富阳八二一医院', toName: '青川县中医医院' },
                { fromName: '富阳第三人民医院', toName: '剑阁县妇幼保健院' },
                { fromName: '富阳利州区中医医院', toName: '苍溪县中医院' },
                { fromName: '富阳第一人民医院', toName: '苍溪县人民医院' },
                { fromName: '富阳朝天区人民医院', toName: '昭化区中医院' },
                { fromName: '富阳昭化区人民医院', toName: '昭化区妇幼保健院' },
                { fromName: '富阳中医院', toName: '旺苍县人民医院' },
                { fromName: '旺苍县妇幼保健院', toName: '青川县妇幼保健院' },
                { fromName: '富阳第二人民医院', toName: '青川县人民医院' },
                { fromName: '富阳第四人民医院', toName: '剑阁县人民医院' },
                { fromName: '剑阁县中医医院', toName: '苍溪精神卫生' },
                { fromName: '利州区第二人民医院', toName: '苍溪县第二人民医院' },
                { fromName: '朝天区中医医院', toName: '苍溪县妇幼保健院' },
                { fromName: '苍溪皮肤病性病防治院', toName: '富阳第一人民医院' }
            ]);
        }, 10000);
    };

    window.Platforms = Platforms;
}();

+function () {
    'use strict';

    let pf = new Platforms();

    // vue
    let vm = new Vue({
        el: '#page-index',
        data: pf,
        components: {
            'stats': pf.statsTemplate(),
            'patients': pf.patientsTemplate(),
            'pays': pf.paysTemplate(),
            'date': pf.dateTemplate(),
            'bar-tab': pf.barTabTemplate(),
            'tabs': pf.tabsTemplate(),
            'pie':pf.pieTemplate()
        },
        mounted: function () {
            this.$nextTick(function () {
                console.log('vm mounted');
                pf.render();
            });
        }
    });
}();
