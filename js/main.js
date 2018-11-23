+function () {
    'use strict';

    // 统计
    let stats = { ydzf: 10000, sxzz: 0, rydj: 0, yygh: 0, mzjz: 0 };
    // 支付
    let pays = { zfb: 0, wx: 0, xyjy: 0, ydyb: 0, ylzf: 0 };

    // 当前挂号、当前就诊
    let chartTab = {'csrs':0, 'crbk':0,'jjcccs':0,'jjcdms':0};

    //图表
    let barTab = {week:'周', month:'月'}

    let hospitals = [
        { name: '富阳妇幼保健院', value: [105.879011, 32.432852], count: 0 },
        { name: '富阳第一人民医院', value: [105.829955, 32.432336], count: 0 },
        { name: '富阳中心医院', value: [105.829955, 32.449701], count: 0 },
        { name: '富阳中医院', value: [105.836783, 32.449701], count: 0 },
        { name: '富阳八二一医院', value: [105.824129, 32.452095], count: 0 },
        { name: '富阳第二人民医院', value: [105.83292, 32.438734], count: 0 },
        { name: '富阳第三人民医院', value: [105.804415, 32.426606], count: 0 },
        { name: '富阳第四人民医院', value: [105.801735, 32.385228], count: 0 },
        { name: '富阳利州区中医医院', value: [105.649836, 32.385104], count: 0 },
        { name: '利州区第二人民医院', value: [105.631488, 32.502106], count: 0 },

        { name: '朝天区妇幼保健院', value: [105.890305, 32.657225], count: 0 },
        { name: '朝天区中医医院', value: [105.890555, 32.656811], count: 0 },
        { name: '富阳朝天区人民医院', value: [105.894855, 32.647667], count: 0 },

        { name: '昭化区中医院', value: [105.970605, 32.353732], count: 0 },
        { name: '富阳昭化区人民医院', value: [105.968538, 32.33114], count: 0 },
        { name: '昭化区妇幼保健院', value: [105.974162, 32.327765], count: 0 },

        { name: '旺苍县中医院', value: [106.276592, 32.230192], count: 0 },
        { name: '旺苍县人民医院', value: [106.293723, 32.234233], count: 0 },
        { name: '旺苍县妇幼保健院', value: [106.317412, 32.236367], count: 0 },

        { name: '青川县妇幼保健院', value: [105.244227, 32.591812], count: 0 },
        { name: '青川县中医医院', value: [105.247278, 32.588508], count: 0 },
        { name: '青川县人民医院', value: [105.234512, 32.577736], count: 0 },

        { name: '剑阁县妇幼保健院', value: [105.513583, 32.286945], count: 0 },
        { name: '剑阁县人民医院', value: [105.530641, 32.278025], count: 0 },
        { name: '剑阁县中医医院', value: [105.479849, 32.041389], count: 0 },

        { name: '苍溪精神卫生', value: [105.801735, 32.426726], count: 0 },
        { name: '苍溪县中医院', value: [105.952298, 31.723721], count: 0 },
        { name: '苍溪县第二人民医院', value: [105.940599, 31.736542], count: 0 },
        { name: '苍溪县人民医院', value: [105.942846, 31.738356], count: 0 },
        { name: '苍溪县妇幼保健院', value: [105.947213, 31.739531], count: 0 },
        { name: '苍溪皮肤病性病防治院', value: [105.957402, 31.741677], count: 0 }
    ];

    let regions = (function () {
        let _regions = [];
        let list = [
            ['利州区', 400],
            ['朝天区', 200],
            ['昭化区', 200],
            ['旺苍县', 100],
            ['青川县', 300],
            ['剑阁县', 100],
            ['苍溪县', 300]
        ];
        list.forEach((item) => {
            _regions.push({
                name: item[0],
                value: item[1]
            });
        });

        return _regions;
    })();
    let mapName = 'fyMap';

    let weekData = [10, 52, 200, 334, 390, 330, 220];
    let monthData= [10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220,100,150];

    function Platforms (patients, referrals) {
        // 统计
        this.stats = stats;
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
        this.hospitals = hospitals;

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

    // 绘制 series[i].lines
    Platforms.prototype.drawLines = function (name, lineColor) {
        return {
            name: name,
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 2,
                symbol: 'pin',
                //loop: false
            },
            //large: true,
            lineStyle: {
                normal: {
                    color: lineColor,
                    width: 0.3,
                    opacity: 0.4,
                    curveness: 0.2
                }
            },
            data: [],
            tooltip: {
                formatter: function (params) {
                    return params.data.fromName + ' &rarr; ' + params.data.toName;
                }
            }
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

        if (!referral) {
            let _unshift = () => {
                this.patients.unshift({
                    patientName: item.patientName,
                    sex: item.sex == '0' ? '男' : '女',
                    dept: item.dept,
                    hospitalName: item.toName,
                    visitTime: item.visitTime,
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
    Platforms.prototype.findHospital = function (name) {
        return this.hospitals.find((item) => {
            if (item.name == name) {
                item.count++;
                return true;
            }
        });
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
            pf._date = '<span>'+yy + '-' + MM + '-' + dd + ' ' +  days[day - 1] +'</span><span class="font-digiface">'+h + ':' + m  + ':' +s+'</span>';
        }

         // 初始化数据
         _geDate();
         // 定时获取数据
         setInterval(_geDate, 1000);

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

    // 统计圈
    Platforms.prototype.statsTemplate = function () {
        let pf = this;
        let li = {
            props: ['stat'],
            template: '\
                        <li>\
                            <p>\
                                <span>{{stat.value}}</span>\
                                <transition-group name="stat-fade" tag="span" mode="out-in" :style="`width:${list.length-0.25}rem;`">\
                                    <i v-for="(item, index) in list" :key="\'stat-key\'+index+item" class="stat-fade-item stat-item" :class="\'stat-fade-item\'+index">\
                                        {{item}}\
                                    </i>\
                                </transition-group>\
                            </p>\
                            <div class="chart-pie" ref="chart"></div>\
                        </li>\
                    ',
            // template:'<li></li>',
            computed: {
                list: function () {
                    return pf.numFormat(pf.stats[this.stat.key], 4).split('');
                }
            },
            mounted: function () {
                this.$nextTick(function () {
                    // debugger
                    pf.initPie(this.$refs.chart, this.stat.value);
                });
            }
        };

        return {
            template: '<ul class="stats"><stat v-for="(value,key) in list" :stat="{key:key,value:value}" :key="key"></stat></ul>',
            data () {
                return {
                    // date: pf.getDate(),
                    list: { ydzf: '移动支付', sxzz: '双向转诊', rydj: '入院登记', yygh: '预约挂号', mzjz: '门诊就诊' }
                };
            },
            components: {
                stat: li
            }
        }
    };
    Platforms.prototype.setStats = function () {
        for (let key in this.stats) {
            setTimeout(() => {
                // 1-100
                this.stats[key] += Math.floor(Math.random() * 10 + 1);

                setInterval(() => {
                    this.stats[key] += Math.floor(Math.random() * 10 + 1);
                }, 2000);

            }, [300, 450, 600, 750, 900][Math.floor(Math.random() * 5)]);

            this.stats[key] += 100;
        }
    };
    Platforms.prototype.initPie = function (dom, name) {
        let rdm = Math.floor(Math.random() * 100);
        let option = {
            series: [
                {
                    name: name,
                    type: 'pie',
                    radius: ['83.33%', '100%'],
                    hoverAnimation: false,
                    labelLine: { show: false },
                    data: [
                        {
                            value: rdm,
                            name: '占有率',
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0, color: '#020a16' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1, color: 'rgba(106, 200, 255, 0.25)' // 100% 处的颜色
                                        }],
                                    globalCoord: false // 缺省为 false
                                }
                            }
                        },
                        {
                            value:  100 - rdm,
                            name: '占位',
                            itemStyle: {
                                color: '#6ac8ff',
                                opacity: 1
                            }
                        }]
                }]
        };

        let pie = echarts.init(dom);
        pie.setOption(option);

        this.pieCharts.push(pie);
    };

    // 实时就诊
    Platforms.prototype.patientsTemplate = function () {
        let pf = this;
        return {
            template: '<div class="patients">\
                    <transition-group name="patients" tag="ul">\
                        <li v-for="(item, index) in list" :key="\'patient-key\'+item.index">\
                            <p>{{item.visitTime}} [{{item.dept}}]</p>\
                            <p class="white"><span class="blue">{{item.patientName}} {{item.sex}}</span>  在 <span class="blue">{{item.hospitalName}}</span> 就诊</p>\
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
            console.log(this.pays)
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
                    list: {'csrs':'出生人数', 'crbk':'传染报卡','jjcccs':'急救车出车数','jjcdms':'急救车待命数'}
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
        this.setPatients();

        // vis
        // this.initVisit();

        // HOD
        // this.initHOD()

        this.setChartInit();
        this.setChartTab();

    };

    // 获取实时就诊数据
    Platforms.prototype.getPatients = function (callback) {
        setTimeout(() => {
            callback([
                { patientName: '张1三', sex: '0', dept: '急诊科', fromName: '青溪镇', coord: [104.845764, 32.465088], toName: '青川县人民医院', visitTime: '09:36:01' },
                { patientName: '李1四', sex: '1', dept: '骨科', fromName: '竹园镇', coord: [105.339385, 32.224964], toName: '青川县人民医院', visitTime: '09:36:02' },
                { patientName: '王1五', sex: '0', dept: '泌尿科', fromName: '鼓城乡', coord: [106.475493, 32.605448], toName: '旺苍县妇幼保健院', visitTime: '09:36:03' },
                { patientName: '赵1六', sex: '1', dept: '妇科', fromName: '金溪镇', coord: [106.67255, 32.290656], toName: '旺苍县妇幼保健院', visitTime: '09:36:04' },
                { patientName: '张2三', sex: '0', dept: '眼科', fromName: '木马镇', coord: [105.650802, 31.985039], toName: '剑阁县中医医院', visitTime: '09:36:05' },
                { patientName: '李2四', sex: '1', dept: '中医科', fromName: '瑞福文化广场', coord: [105.441158, 31.592568], toName: '剑阁县中医医院', visitTime: '09:36:06' },
                { patientName: '王2五', sex: '0', dept: '消化内科', fromName: '姚渡站', coord: [105.504476, 32.809173], toName: '青川县人民医院', visitTime: '09:36:07' },
                { patientName: '赵2六', sex: '1', dept: '心内科', fromName: '东宝镇', coord: [105.230047, 31.948648], toName: '剑阁县中医医院', visitTime: '09:36:08' },
                { patientName: '张3三', sex: '0', dept: '血液科', fromName: '军师庙火车站', coord: [105.888553, 32.709309], toName: '富阳朝天区人民医院', visitTime: '09:36:09' },
                { patientName: '李3四', sex: '0', dept: '神经内科', fromName: '曾家镇', coord: [106.113761, 32.625418], toName: '富阳朝天区人民医院', visitTime: '09:36:10' },
                { patientName: '王3五', sex: '1', dept: '小儿科', fromName: '白果乡', coord: [105.775517, 32.184534], toName: '昭化区妇幼保健院', visitTime: '09:36:11' },
                { patientName: '赵3六', sex: '0', dept: '肝胆外科', fromName: '柏林沟镇', coord: [105.889092, 32.090701], toName: '昭化区妇幼保健院', visitTime: '09:36:12' },
                { patientName: '张4三', sex: '1', dept: '烧伤科', fromName: '双石乡', coord: [106.341311, 32.046136], toName: '苍溪县第二人民医院', visitTime: '09:36:13' },
                { patientName: '李4四', sex: '0', dept: '产科', fromName: '苍溪县云峰镇敬老院', coord: [105.990951, 31.695043], toName: '苍溪县第二人民医院', visitTime: '09:36:14' },
                { patientName: '王4五', sex: '0', dept: '耳鼻喉科', fromName: '金洞乡', coord: [105.566818, 32.61007], toName: '利州区第二人民医院', visitTime: '09:36:15' },
                { patientName: '赵4六', sex: '1', dept: '口腔科', fromName: '赤化镇', coord: [105.582863, 32.341286], toName: '利州区第二人民医院', visitTime: '09:36:16' },
                { patientName: '张5三', sex: '0', dept: '皮肤科', fromName: '李家乡', coord: [106.215535, 32.564292], toName: '朝天区中医医院', visitTime: '09:36:17' },
                { patientName: '李5四', sex: '0', dept: '妇产科', fromName: '羊木火车站', coord: [105.78513, 32.60054], toName: '朝天区中医医院', visitTime: '09:36:18' }
            ])
        }, 1000);
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
            'tabs': pf.tabsTemplate()
        },
        mounted: function () {
            this.$nextTick(function () {
                console.log('vm mounted');
                pf.render();
            });
        }
    });
}();
