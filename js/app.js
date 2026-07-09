/* ── MOON PHASE ── */
function julianDay(dt){
  var y=dt.getFullYear(),mo=dt.getMonth()+1,d=dt.getDate()+0.5;
  if(mo<=2){y--;mo+=12;}
  var A=Math.floor(y/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(mo+1))+d+B-1524.5;
}
function moonPhase(dt){var c=(julianDay(dt)-2451549.5)/29.53058853;return c-Math.floor(c);}
function phaseDist(p,t){var d=Math.abs(p-t);return d>0.5?1-d:d;}
var moonCache={},moonCacheKeys=[],MOON_CACHE_MAX=24;
function buildMoonMap(y,m){
  var map={},days=new Date(y,m+1,0).getDate(),bn={dist:9,d:0},bf={dist:9,d:0};
  for(var d=1;d<=days;d++){
    var p=moonPhase(new Date(y,m,d));
    if(phaseDist(p,0)<bn.dist){bn.dist=phaseDist(p,0);bn.d=d;}
    if(phaseDist(p,0.5)<bf.dist){bf.dist=phaseDist(p,0.5);bf.d=d;}
  }
  if(bn.d)map[bn.d]="new";
  if(bf.d)map[bf.d]="full";
  return map;
}
function moonOf(y,m,d){
  var k=y+"-"+m;
  if(!moonCache[k]){
    if(moonCacheKeys.length>=MOON_CACHE_MAX){var ok=moonCacheKeys.shift();delete moonCache[ok];}
    moonCache[k]=buildMoonMap(y,m);
    moonCacheKeys.push(k);
  }
  return moonCache[k][d]||null;
}

/* ── LOCAL STORAGE NOTES ── */
var SK="lunarcal_notes";
function loadNotes(){
  try{
    var raw=JSON.parse(localStorage.getItem(SK)||"{}");
    // Validate that values are arrays; clean up corrupt data
    for(var key in raw){
      if(!Array.isArray(raw[key])){delete raw[key];continue;}
      raw[key]=raw[key].filter(function(n){return n&&typeof n.id==="number"&&typeof n.text==="string";});
      if(!raw[key].length)delete raw[key];
    }
    return raw;
  }catch(e){return {};}
}
function saveNotes(o){
  try{localStorage.setItem(SK,JSON.stringify(o));}
  catch(e){
    if(e.name==="QuotaExceededError"||e.code===22){
      var msg=document.getElementById("storageWarn");
      if(!msg){msg=document.createElement("div");msg.id="storageWarn";msg.style.cssText="padding:10px 12px;background:var(--md-error-container);border:1px solid var(--md-error);border-radius:var(--md-shape-sm);color:var(--md-error);font-size:12px;margin-top:6px;text-align:center";msg.textContent="⚠️ Storage full. Delete some notes to add more.";var el=document.querySelector(".entry-section");if(el)el.prepend(msg);}
    }
  }
}
function nk(y,m,d){return y+"-"+(m+1)+"-"+d;}
function getNotes(y,m,d){var o=loadNotes(),k=nk(y,m,d);return Array.isArray(o[k])?o[k]:[];}
function addNote(y,m,d,t){
  if(t.length>500)return;
  var o=loadNotes(),k=nk(y,m,d);if(!Array.isArray(o[k]))o[k]=[];o[k].push({id:Date.now(),text:t});saveNotes(o);
}
function delNote(y,m,d,id){var o=loadNotes(),k=nk(y,m,d);if(!Array.isArray(o[k]))return;o[k]=o[k].filter(function(n){return n.id!==id;});if(!o[k].length)delete o[k];saveNotes(o);}
function hasNote(y,m,d){var o=loadNotes(),k=nk(y,m,d);return !!(Array.isArray(o[k])&&o[k].length);}

/* ── LUNAR TABLES ── */
var LI=[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,0x0d520];
var TG=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
var DZ=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
var ZC=["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
var ZE=["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
var EL=["Wood","Wood","Fire","Fire","Earth","Earth","Metal","Metal","Water","Water"];
var EC=["木","木","火","火","土","土","金","金","水","水"];
var EX=["#27ae60","#27ae60","#e74c3c","#e74c3c","#e67e22","#e67e22","#7f8c8d","#7f8c8d","#2980b9","#2980b9"];
var CM=["正","二","三","四","五","六","七","八","九","十","冬","腊"];
var CME=["Month 1","Month 2","Month 3","Month 4","Month 5","Month 6","Month 7","Month 8","Month 9","Month 10","Month 11","Month 12"];
var CD=["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
var MEN=["January","February","March","April","May","June","July","August","September","October","November","December"];
var MSH=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var LF={"1-1":[{cn:"春节",en:"Spring Festival",t:"trad"},{cn:"弥勒佛圣诞",en:"Maitreya Buddha",t:"tao"}],"1-4":[{cn:"贴年红",en:"New Year Decorations",t:"trad"}],"1-5":[{cn:"迎财神",en:"Welcome Wealth God",t:"trad"}],"1-7":[{cn:"人日",en:"Human Day",t:"trad"}],"1-9":[{cn:"玉皇大帝圣诞",en:"Jade Emperor",t:"tao"}],"1-15":[{cn:"元宵节",en:"Lantern Festival",t:"trad"},{cn:"天官圣诞",en:"Heaven Official",t:"tao"}],"1-19":[{cn:"邱长春真人圣诞",en:"Qiu Changchun",t:"tao"}],"2-2":[{cn:"龙抬头",en:"Dragon Raises Head",t:"trad"},{cn:"土地公诞",en:"Earth God",t:"tao"}],"2-3":[{cn:"文昌帝君圣诞",en:"Wenchang Emperor",t:"tao"}],"2-8":[{cn:"释迦牟尼出家",en:"Buddha's Renunciation",t:"tao"}],"2-15":[{cn:"太上老君圣诞",en:"Laozi",t:"tao"}],"2-19":[{cn:"观音圣诞",en:"Guanyin Birthday",t:"tao"}],"2-21":[{cn:"普贤菩萨圣诞",en:"Samantabhadra",t:"tao"}],"3-3":[{cn:"玄天上帝圣诞",en:"Xuantian Shangdi",t:"tao"}],"3-15":[{cn:"财神圣诞",en:"God of Wealth",t:"tao"}],"3-23":[{cn:"妈祖圣诞",en:"Mazu",t:"tao"}],"3-28":[{cn:"东岳大帝圣诞",en:"Tai Shan God",t:"tao"}],"4-4":[{cn:"文殊菩萨圣诞",en:"Manjushri",t:"tao"}],"4-8":[{cn:"释迦牟尼佛诞",en:"Buddha Birthday",t:"tao"}],"4-14":[{cn:"吕洞宾圣诞",en:"Lu Dongbin",t:"tao"}],"4-28":[{cn:"药王诞辰",en:"Medicine King",t:"tao"}],"5-5":[{cn:"端午节",en:"Dragon Boat Festival",t:"trad"}],"5-13":[{cn:"关圣帝君诞",en:"Guan Yu",t:"tao"}],"6-6":[{cn:"天贶节",en:"Heaven Blessing Day",t:"trad"},{cn:"晒经节",en:"Sutra Drying Day",t:"tao"}],"6-19":[{cn:"观音成道",en:"Guanyin Enlightenment",t:"tao"}],"6-24":[{cn:"关帝圣诞",en:"Guandi",t:"tao"}],"7-7":[{cn:"七夕节",en:"Qixi Festival",t:"trad"}],"7-15":[{cn:"中元节",en:"Ghost Festival",t:"trad"},{cn:"地官圣诞",en:"Earth Official",t:"tao"}],"7-18":[{cn:"西王母圣诞",en:"Queen Mother",t:"tao"}],"7-19":[{cn:"值年太岁圣诞",en:"Tai Sui",t:"tao"}],"7-30":[{cn:"地藏王圣诞",en:"Ksitigarbha",t:"tao"}],"8-3":[{cn:"灶君圣诞",en:"Kitchen God",t:"tao"}],"8-15":[{cn:"中秋节",en:"Mid-Autumn Festival",t:"trad"}],"8-27":[{cn:"孔子诞辰",en:"Confucius Birthday",t:"trad"}],"9-1":[{cn:"九皇诞初一",en:"Nine Emperor Gods",t:"tao"}],"9-9":[{cn:"重阳节",en:"Double Ninth Festival",t:"trad"},{cn:"斗姆元君圣诞",en:"Doumu",t:"tao"}],"9-15":[{cn:"九皇诞完",en:"Nine Emperor End",t:"tao"}],"9-19":[{cn:"观音出家",en:"Guanyin Renunciation",t:"tao"}],"10-15":[{cn:"水官圣诞",en:"Water Official",t:"tao"}],"10-22":[{cn:"下元节",en:"Xia Yuan Festival",t:"trad"}],"11-17":[{cn:"阿弥陀佛圣诞",en:"Amitabha",t:"tao"}],"12-8":[{cn:"腊八节",en:"Laba Festival",t:"trad"}],"12-23":[{cn:"祭灶送神",en:"Kitchen God Ascends",t:"tao"}],"12-24":[{cn:"扫尘",en:"Year-End Clean",t:"trad"}],"12-30":[{cn:"除夕",en:"New Year Eve",t:"trad"}]};

/* ── 24 SOLAR TERMS / 节气 ── */
var ST_CN="立春|雨水|惊蛰|春分|清明|谷雨|立夏|小满|芒种|夏至|小暑|大暑|立秋|处暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至|小寒|大寒".split("|");
var ST_EN="Start of Spring|Rain Water|Awakening of Insects|Spring Equinox|Clear and Bright|Grain Rain|Start of Summer|Grain Buds|Grain in Ear|Summer Solstice|Minor Heat|Major Heat|Start of Autumn|End of Heat|White Dew|Autumn Equinox|Cold Dew|Frost Descent|Start of Winter|Minor Snow|Major Snow|Winter Solstice|Minor Cold|Major Cold".split("|");
var ST_LON=[315,330,345,0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300];
var solarTermCache={};
function sunLon(jd){var T=(jd-2451545)/36525,L=280.46646+36000.76983*T+0.0003032*T*T,M=357.52911+35999.05029*T-0.0001537*T*T;var C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M*Math.PI/180)+(0.019993-0.000101*T)*Math.sin(2*M*Math.PI/180)+0.000289*Math.sin(3*M*Math.PI/180);return L+C;}
function getSolarTermsForYear(y){if(solarTermCache[y])return solarTermCache[y];var terms=[],jdStart=new Date(y-1,6,1).getTime()/86400000+2440587.5;for(var i=0;i<24;i++){var t=ST_LON[i],jd=jdStart,lon=sunLon(jd),dd=((t-lon+360)%360)/0.9856;jd+=dd;for(var k=0;k<3;k++){lon=sunLon(jd);dd=(t-lon+360)%360;if(dd>180)dd-=360;jd+=dd/0.9856;}var dt=new Date(Math.round((jd-2440587.5)*86400000));if(dt.getFullYear()===y)terms.push({idx:i,mo:dt.getMonth()+1,da:dt.getDate()});}solarTermCache[y]=terms;return terms;}
function getSolarTerm(y,m,d){var terms=getSolarTermsForYear(y);for(var i=0;i<terms.length;i++){if(terms[i].mo===m&&terms[i].da===d)return{idx:terms[i].idx,cn:ST_CN[terms[i].idx],en:ST_EN[terms[i].idx]};}return null;}

function lyd(y){var s=348;for(var i=0x8000;i>0x8;i>>=1)s+=(LI[y-1900]&i)?1:0;return s+lld(y);}
function llm(y){return LI[y-1900]&0xf;}
function lld(y){return llm(y)?((LI[y-1900]&0x10000)?30:29):0;}
function lmd(y,m){return(LI[y-1900]&(0x10000>>m))?30:29;}
var BD=Date.UTC(1900,0,31);
function s2l(date){
  var off=Math.floor((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())-BD)/86400000);
  if(off<0)return null;
  var y=1900,tmp=0;
  for(;y<2101&&off>0;y++){tmp=lyd(y);off-=tmp;}
  if(off<0){off+=tmp;y--;}
  var lp=llm(y),il=false,m=1;
  // Build ordered list of month slots (regular + leap if exists)
  var ord=[];
  for(var mi=1;mi<=12;mi++){ord.push({m:mi,l:false});if(mi===lp)ord.push({m:mi,l:true});}
  for(var ix=0;ix<ord.length&&off>0;ix++){
    var o=ord[ix];
    tmp=o.l?lld(y):lmd(y,o.m);
    if(off<tmp){m=o.m;il=o.l;break;}
    off-=tmp;
    if(off===0){
      if(ix+1<ord.length){m=ord[ix+1].m;il=ord[ix+1].l;}else{m=12;il=false;}
      break;
    }
  }
  if(off===0){return{year:y,month:m,day:1,isLeap:il};}
  return{year:y,month:m,day:off+1,isLeap:il};
}
function l2s(y,m,d,il){
  if(y<1900||y>2100)return null;
  var off=0;
  for(var i=1900;i<y;i++)off+=lyd(i);
  var lp=llm(y),ord=[];
  for(var i=1;i<=12;i++){ord.push({m:i,l:false});if(i===lp)ord.push({m:i,l:true});}
  var tot=0,done=false;
  for(var ix=0;ix<ord.length;ix++){var o=ord[ix];if(o.m===m&&o.l===il){done=true;break;}tot+=o.l?lld(y):lmd(y,o.m);}
  if(!done)return null;
  var mx=il?lld(y):lmd(y,m);
  if(d<1||d>mx)return null;
  off+=tot+(d-1);
  return new Date(BD+off*86400000);
}
function gzy(y){var i=(y-4)%60;return TG[i%10]+DZ[i%12]+"年";}
function zod(y){var i=(y-4)%60,s=i%10;return{cn:ZC[(y-4)%12],en:ZE[(y-4)%12],ec:EC[s],ee:EL[s],ex:EX[s]};}
function fests(l){
  if(l.isLeap)return[];
  var k=l.month+"-"+l.day,r=(LF[k]||[]).slice();
  // If it's the last day of the 12th month, show 除夕 (New Year's Eve) even if month is 29 days
  if(l.month===12){var lx=lmd(l.year,12);if(l.day===lx&&!LF[k])r.push({cn:"除夕",en:"New Year Eve",t:"trad"});}
  return r;
}
function cellLabel(l){
  var f=fests(l);
  if(f.length)return{t:f[0].cn.split("·")[0],f:true};
  if(l.day===1)return{t:(l.isLeap?"闰":"")+CM[l.month-1]+"月",f:false};
  return{t:CD[l.day-1],f:false};
}
function pad(n){return String(n).padStart(2,"0");}

/* ── CHINESE HOUR (时辰) ── */
var SH_CH=["\u5b50","\u4e11","\u5bc5","\u536f","\u8fb0","\u5df3","\u5348","\u672a","\u7533","\u9149","\u620c","\u4ea5"];
var SH_EN=["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
function chineseHour(dt){
  var h=dt.getHours(),idx=Math.floor((h+1)/2)%12;
  return{idx:idx,cn:SH_CH[idx]+"\u65f6",en:SH_EN[idx]+" Hour",range:pad(((idx*2+23)%24))+":00\u2013"+pad(((idx*2+1)%24))+":59"};
}

/* ── DETAILED MOON PHASES ── */
var MP=[
  {v:0,cn:"\u65b0\u6708",en:"New Moon",ico:"\ud83c\udf11"},
  {v:0.125,cn:"\u86fe\u7709\u6708",en:"Waxing Crescent",ico:"\ud83c\udf12"},
  {v:0.25,cn:"\u4e0a\u5f26\u6708",en:"First Quarter",ico:"\ud83c\udf13"},
  {v:0.375,cn:"\u76c8\u51f8\u6708",en:"Waxing Gibbous",ico:"\ud83c\udf14"},
  {v:0.5,cn:"\u6ee1\u6708",en:"Full Moon",ico:"\ud83c\udf15"},
  {v:0.625,cn:"\u4e8f\u51f8\u6708",en:"Waning Gibbous",ico:"\ud83c\udf16"},
  {v:0.75,cn:"\u4e0b\u5f26\u6708",en:"Last Quarter",ico:"\ud83c\udf17"},
  {v:0.875,cn:"\u86fe\u7709\u6708",en:"Waning Crescent",ico:"\ud83c\udf18"}
];
function detailedMoonPhase(dt){
  var p=moonPhase(dt),best=MP[0],bd=1;
  for(var i=0;i<MP.length;i++){var d=Math.abs(p-MP[i].v);if(d>0.5)d=1-d;if(d<bd){bd=d;best=MP[i];}}
  return best;
}

/* ── AUSPICIOUS DAY PICKER (\u9ec4\u5386/\u62e9\u5409\u65e5) ── */
function dayStemBranch(jd){
  var d=Math.floor(jd+0.5),s=(d-8)%10,br=(d-8)%12;
  if(s<0)s+=10;if(br<0)br+=12;
  return{stem:s,branch:br,stemCn:TG[s],branchCn:DZ[br],fullCn:TG[s]+DZ[br]};
}
var ALMANAC={
  "0":{suit:["\u796d\u7940","\u6c42\u5e9a","\u5f00\u5149","\u6c90\u6d74"],avoid:["\u5f00\u5e02","\u5165\u5b85","\u5ac1\u5a36","\u51fa\u884c"]},
  "1":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u658b\u91ae"],avoid:["\u5f00\u5e02","\u7eb3\u8d22","\u51fa\u884c","\u5ac1\u5a36"]},
  "2":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u5f00\u5e02","\u4ea4\u6613","\u7acb\u5238"],avoid:["\u5165\u5b85","\u5b89\u846c","\u5ac1\u5a36"]},
  "3":{suit:["\u796d\u7940","\u7948\u798f","\u51fa\u884c","\u6c42\u5e9a","\u658b\u91ae"],avoid:["\u5f00\u5e02","\u5165\u5b85","\u5b89\u846c"]},
  "4":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u5f00\u5149","\u89e3\u9664"],avoid:["\u51fa\u884c","\u5ac1\u5a36","\u5165\u5b85"]},
  "5":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u89e3\u9664","\u658b\u91ae"],avoid:["\u5f00\u5e02","\u51fa\u884c","\u5ac1\u5a36","\u5165\u5b85"]},
  "6":{suit:["\u796d\u7940","\u7948\u798f","\u51fa\u884c","\u6c42\u5e9a","\u89e3\u9664"],avoid:["\u5f00\u5e02","\u5b89\u846c","\u5ac1\u5a36","\u5165\u5b85"]},
  "7":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u5f00\u5149","\u89e3\u9664"],avoid:["\u51fa\u884c","\u5ac1\u5a36","\u5f00\u5e02"]},
  "8":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u5f00\u5149","\u89e3\u9664","\u51fa\u884c"],avoid:["\u5f00\u5e02","\u5165\u5b85","\u5b89\u846c"]},
  "9":{suit:["\u796d\u7940","\u7948\u798f","\u51fa\u884c","\u6c42\u5e9a","\u89e3\u9664"],avoid:["\u5f00\u5e02","\u5ac1\u5a36","\u5165\u5b85"]},
  "10":{suit:["\u796d\u7940","\u7948\u798f","\u6c42\u5e9a","\u5f00\u5149","\u89e3\u9664"],avoid:["\u5f00\u5e02","\u51fa\u884c","\u5ac1\u5a36","\u5165\u5b85"]},
  "11":{suit:["\u796d\u7940","\u7948\u798f","\u51fa\u884c","\u6c42\u5e9a","\u89e3\u9664","\u6c90\u6d74"],avoid:["\u5f00\u5e02","\u5ac1\u5a36","\u5165\u5b85","\u5b89\u846c"]}
};
var ACT_EN={"\u796d\u7940":"Sacrifice","\u7948\u798f":"Prayer","\u6c42\u5e9a":"Heir Request","\u5f00\u5149":"Consecration",
  "\u51fa\u884c":"Travel","\u5ac1\u5a36":"Marriage","\u5165\u5b85":"House Moving","\u5b89\u846c":"Burial",
  "\u5f00\u5e02":"Business Opening","\u89e3\u9664":"Resolution","\u6c90\u6d74":"Bathing","\u658b\u91ae":"Taoist Rite",
  "\u4ea4\u6613":"Trading","\u7acb\u5238":"Contract","\u7eb3\u8d22":"Wealth"};
function auspiciousDay(y,m,d){
  var dt=new Date(y,m,d),jd=julianDay(dt),dsb=dayStemBranch(jd);
  var rules=ALMANAC[String(dsb.branch)]||{suit:["\u796d\u7940"],avoid:[]};
  return{stemBranch:dsb,suit:rules.suit,avoid:rules.avoid};
}

/* ── GLOBAL SEARCH ── */
var searchTimeout=null;
function onSearchInput(){
  if(searchTimeout)clearTimeout(searchTimeout);
  var inp=document.getElementById("searchInput");
  if(!inp)return;
  searchTimeout=setTimeout(function(){searchAll(inp.value);},200);
}
function searchAll(q){
  q=q.trim().toLowerCase();
  var res=document.getElementById("searchResults");
  if(!res)return;
  if(!q.length){res.innerHTML="";res.classList.remove("show");return;}
  var results=[],y=VD.getFullYear();
  for(var k in LF){
    LF[k].forEach(function(f){
      if(f.cn.toLowerCase().indexOf(q)!==-1||f.en.toLowerCase().indexOf(q)!==-1){
        var parts=k.split("-"),lm=+parts[0],ld=+parts[1];
        for(var sy=Math.max(1900,y-1);sy<=Math.min(2100,y+2);sy++){
          var dt=l2s(sy,lm,ld,false);
          if(dt)results.push({type:"fest",cn:f.cn,en:f.en,dt:dt});
        }
      }
    });
  }
  for(var sy=Math.max(1900,y-1);sy<=Math.min(2100,y+2);sy++){
    var terms=getSolarTermsForYear(sy);
    terms.forEach(function(t){
      if(ST_CN[t.idx].toLowerCase().indexOf(q)!==-1||ST_EN[t.idx].toLowerCase().indexOf(q)!==-1){
        results.push({type:"st",cn:ST_CN[t.idx],en:ST_EN[t.idx],dt:new Date(sy,t.mo-1,t.da)});
      }
    });
  }
  var notes=loadNotes();
  for(var nk in notes){
    notes[nk].forEach(function(n){
      if(n.text.toLowerCase().indexOf(q)!==-1){
        var parts=nk.split("-"),ny=+parts[0],nm=+parts[1]-1,nd=+parts[2];
        results.push({type:"note",cn:n.text,en:"",dt:new Date(ny,nm,nd)});
      }
    });
  }
  var seen={};
  results=results.filter(function(r){
    var key=r.dt.getTime()+r.cn;
    if(seen[key])return false;seen[key]=true;return true;
  }).slice(0,30).sort(function(a,b){return a.dt.getTime()-b.dt.getTime();});
  var html="";
  if(!results.length){html="<div class='sr-none'>No results found</div>";}
  else{
    results.forEach(function(r){
      var ico=r.type==="fest"?"\ud83c\udf8a":r.type==="st"?"\ud83c\udf3f":"\ud83d\udcdd";
      var en=r.type==="note"?"":r.en;
      html+="<div class='sr-item' onclick='jumpToDate("+r.dt.getFullYear()+","+r.dt.getMonth()+","+r.dt.getDate()+");hideSearch()'>"
        +"<span class='sr-ico'>"+ico+"</span><span class='sr-cn'>"+esc(r.cn)+"</span>"
        +(en?"<span class='sr-en'>"+esc(en)+"</span>":"")
        +"<span class='sr-date'>"+MEN[r.dt.getMonth()]+" "+r.dt.getDate()+", "+r.dt.getFullYear()+"</span>"
        +"</div>";
    });
  }
  res.innerHTML=html;res.classList.add("show");
}
function hideSearch(){document.getElementById("searchResults").classList.remove("show");}
function toggleSearch(){
  var sb=document.getElementById("searchBox");
  if(sb){sb.classList.toggle("show");if(sb.classList.contains("show")){document.getElementById("searchInput").focus();}}
}

/* ── MULTI-MONTH VIEW (removed from UI, keep for reference) ── */
var multiMonth=false;
function render3Months(){
  var baseY=VD.getFullYear(),baseM=VD.getMonth();
  var html="<div class='mm-wrap'>";
  for(var offset=-1;offset<=1;offset++){
    var cy=baseY,cm=baseM+offset;
    while(cm<0){cm+=12;cy--;}
    while(cm>11){cm-=12;cy++;}
    var mid=s2l(new Date(cy,cm,15));
    var ganZhiLunar=mid?gzy(mid.year):"";
    var first=new Date(cy,cm,1).getDay(),days=new Date(cy,cm+1,0).getDate();
    var today=new Date();
    html+="<div class='mm-month'><div class='mm-title'>"+MSH[cm]+" "+cy+"<small>"+ganZhiLunar+"</small></div><table class='cal mm-table'><thead><tr><th class='wn'></th><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead><tbody>";
    var cell=0;html+="<tr><td class='wn'></td>";cell++;
    for(var i=0;i<first;i++){html+="<td class='empty'></td>";cell++;}
    for(var d=1;d<=days;d++){
      var dt=new Date(cy,cm,d),l=s2l(dt);
      var it=dt.toDateString()===today.toDateString();
      /* ── Null-guard: dates outside 1900-2100 range ── */
      if(!l){
        var cls=it?"today":"";
        html+="<td class='"+cls+"' onclick='jumpToDate("+cy+","+cm+","+d+")' tabindex='0' role='button' aria-label='"+MSH[cm]+" "+d+", "+cy+"'>"
          +"<span class='g-day'>"+d+"</span></td>";
        cell++;if(cell%8===0){html+="</tr><tr><td class='wn'></td>";cell++;}
        continue;
      }
      var lb=cellLabel(l);
      var moon=moonOf(cy,cm,d),hn=hasNote(cy,cm,d);
      var st=getSolarTerm(cy,cm+1,d);
      var cls=it?"today":hn?"has-entry":moon==="new"?"newmoon":moon==="full"?"fullmoon":"";
      if(lb.f)cls+=" fest";
      var fs=fests(l);
      var dots="";
      if(fs.some(function(f){return f.t==="trad";}))dots+="<span class='dot trad'></span>";
      if(fs.some(function(f){return f.t==="tao";}))dots+="<span class='dot tao'></span>";
      if(hn)dots+="<span class='dot entry'></span>";
      var mi=moon==="new"?"\ud83c\udf11":moon==="full"?"\ud83c\udf15":"";
      var stLbl=st?'<span class="st-badge">'+st.cn+'</span>':'';
      var a11yLabel=MSH[cm]+" "+d+", "+cy+" — "+lb.t+(fs.length?" "+fs.map(function(f){return f.cn;}).join(" "):"");
      html+="<td class='"+cls+"' onclick='jumpToDate("+cy+","+cm+","+d+")' tabindex='0' role='button' aria-label='"+esc(a11yLabel)+"'>"
        +dots+"<span class='g-day'>"+d+"</span>"+stLbl+"<span class='c-day"+(lb.f?" festival":"")+"'>"+lb.t+"</span>"+mi+"</td>";
      cell++;if(cell%8===0){html+="</tr><tr><td class='wn'></td>";cell++;}
    }
    while(cell%8!==0){html+="<td class='empty'></td>";cell++;}
    html+="</tr></tbody></table></div>";
  }
  return html+"</div>";
}

/* ── PUSH NOTIFICATIONS ── */
var NOTIF_GRANTED=false;
function requestNotifPermission(){
  if("Notification" in window){
    Notification.requestPermission().then(function(p){
      NOTIF_GRANTED=p==="granted";
      if(NOTIF_GRANTED)showToast("\ud83d\udd14 Notifications enabled!");
      localStorage.setItem("lunacal_notif",p);
      var btn=document.getElementById("notifBtn");
      if(btn)btn.textContent=NOTIF_GRANTED?"\ud83d\udd14 On":"\ud83d\udd14 Notify";
    });
  }
}
function checkNotifPref(){
  if("Notification" in window){
    NOTIF_GRANTED=Notification.permission==="granted";
    if(NOTIF_GRANTED){
      var btn=document.getElementById("notifBtn");
      if(btn)btn.textContent="\ud83d\udd14 On";
    }
  }
}

/* ── ICS EXPORT ── */
function exportICS(){
  var y=VD.getFullYear(),ics="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lunar Calendar//EN\r\n";
  for(var m=0;m<12;m++){
    var days=new Date(y,m+1,0).getDate();
    for(var d=1;d<=days;d++){
      var dt=new Date(y,m,d),l=s2l(dt);if(!l)continue;
      var fs=fests(l);
      if(fs.length){
        fs.forEach(function(f){
          var ds=dt.toISOString().slice(0,10).replace(/-/g,"");
          var icsEscape=function(s){return s.replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");};
      ics+="BEGIN:VEVENT\r\nUID:"+ds+"-"+f.cn+"@lunarcal\r\nDTSTART;VALUE=DATE:"+ds+"\r\nSUMMARY:"+icsEscape(f.cn)+" ("+icsEscape(f.en)+")\r\nEND:VEVENT\r\n";
        });
      }
    }
  }
  ics+="END:VCALENDAR";
  var blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="lunarcal_festivals_"+y+".ics";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(a.href);showToast("\ud83d\udcc5 Festivals exported to calendar!");
}
function donly(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

/* ── VEGETARIAN OBSERVANCE DAYS (六斋日) ── */
function isVegDay(l){
  // 6 Buddhist observance days: 初一(1), 初八(8), 十四(14), 十五(15), 廿三(23), 廿九/三十(last day)
  var d=l.day;
  if(d===1||d===8||d===14||d===15||d===23)return true;
  // Check if it's the last day of the month
  var mx=l.isLeap?lld(l.year):lmd(l.year,l.month);
  return d===mx;
}

/* ── AGE ── */
var LBD=null,LLY=null;
function aod(){if(document.getElementById("aToday").checked)return new Date();return new Date(+SEL.aYear.value,+SEL.aMonth.value-1,+SEL.aDay.value);}
function cage(b,r){var lr=s2l(r),lb=s2l(b);if(!lr||!lb)return 0;return Math.max(lr.year-lb.year+1,1);}
function aoderr(b){
  var r=aod();
  if(donly(r)<donly(b))return"⚠️ \"As of\" ("+r.getFullYear()+"-"+pad(r.getMonth()+1)+"-"+pad(r.getDate())+") is before birth date ("+b.getFullYear()+"-"+pad(b.getMonth()+1)+"-"+pad(b.getDate())+"). Please select a later date.";
  return null;
}
function buildResult(gs,ls,le,fc,fe,b,ly,alm){
  LBD=b;LLY=ly;
  var z=zod(ly),err=aoderr(b),r=aod();
  var rs=r.getFullYear()+"-"+pad(r.getMonth()+1)+"-"+pad(r.getDate());
  updateAgeContainer(b,err,rs);
  var festHtml="";
  if(fc){
    var festArr=fc.split("、"),festEnArr=fe?fe.split(", "):[];
    festHtml='<div class="crc-detail">';
    for(var i=0;i<festArr.length;i++){
      festHtml+='<span class="crc-chip">🏮 <span class="crc-chip-strong">'+festArr[i]+'</span>'+(festEnArr[i]?' '+festEnArr[i]:'')+'</span>';
    }
    festHtml+='</div>';
  }
  var almHtml=alm?'<div class="alm-box crc-alm" onclick="this.classList.toggle(\'crc-alm-open\')"><div class="crc-alm-hdr">📜 Almanac 皇历 <span class="collapse-arrow">▾</span></div>'
    +'<div class="crc-alm-body"><div class="alm-row"><div class="alm-suit">✅ '+alm.suit.join(", ")+' <small>'+alm.suit.map(function(a){return ACT_EN[a];}).join(", ")+'</small></div>'
    +'<div class="alm-avoid">❌ '+alm.avoid.join(", ")+' <small>'+alm.avoid.map(function(a){return ACT_EN[a];}).join(", ")+'</small></div></div></div></div>':'';
  return '<div class="conv-result-card">'
    +'<div class="crc-label">Lunar Date 农历日期</div>'
    +'<div class="crc-main">'+ls+'</div>'
    +'<div class="crc-sub">'+le+' · '+z.cn+' '+z.en+'</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">'
    +'<span class="crc-chip">🐾 '+z.cn+' '+z.en+'</span>'
    +'<span class="crc-chip" style="background:'+z.ex+';color:#fff">'+z.ee+' '+z.ec+'</span>'
    +'<span class="crc-chip">📅 '+gs+'</span>'
    +'</div>'
    +festHtml
    +almHtml
    +'</div>';
}
function westernAge(b,r){
  var age=r.getFullYear()-b.getFullYear();
  var mdiff=r.getMonth()-b.getMonth();
  if(mdiff<0||(mdiff===0&&r.getDate()<b.getDate()))age--;
  return Math.max(age,0);
}
function updateAgeContainer(b,err,rs){
  var ac=document.getElementById("ageContainer");
  if(!ac)return;
  if(err){ac.innerHTML="<div class='err-box'>"+err+"</div>";}
  else{
    var r=aod(),ch=cage(b,r),we=westernAge(b,r);
    ac.innerHTML="<div class='asof-note'>As of: "+rs+"</div><div class='agebox'><div><div class='num'>"+ch+"</div><div class='lbl'>虚岁 Chinese Age</div></div><div><div class='num'>"+we+"</div><div class='lbl'>周岁 Western Age</div></div></div>";
  }
}
function convertG(){
  var y=+SEL.gYear.value,m=+SEL.gMonth.value,d=+SEL.gDay.value;
  var dt=new Date(y,m-1,d),l=s2l(dt);
  if(!l){document.getElementById("convResult").innerHTML="<div class='err-box'>⚠️ Date is before the lunar calendar range (pre-1900).</div>";LBD=null;LUNAR_BDAY=null;document.getElementById("bdayFinder").style.display="none";return;}
  var z=zod(l.year),f=fests(l),alm=auspiciousDay(y,m-1,d);
  document.getElementById("convResult").innerHTML=buildResult(
    MEN[m-1]+" "+d+", "+y,
    (l.isLeap?"闰":"")+l.year+"年 "+CM[l.month-1]+"月 "+CD[l.day-1],
    gzy(l.year)+" · Year of the "+z.en+" · "+CME[l.month-1]+" Day "+l.day,
    f.map(function(x){return x.cn;}).join("、"),f.map(function(x){return x.en;}).join(", "),dt,l.year,alm);
  setLunarBirthday(l);
}
function convertC(){
  var y=+SEL.cYear.value,m=+SEL.cMonth.value,d=+SEL.cDay.value,lp=document.getElementById("cLeap").checked;
  var res=document.getElementById("convResult");
  if(lp&&llm(y)!==m){res.innerHTML="<div class='err-box'>⚠️ "+y+"年没有闰"+CM[m-1]+"月 / Year "+y+" has no leap "+CME[m-1]+".</div>";LBD=null;LUNAR_BDAY=null;document.getElementById("bdayFinder").style.display="none";return;}
  var dt=l2s(y,m,d,lp);
  if(!dt){res.innerHTML="<div class='err-box'>⚠️ 无效农历日期 / Invalid lunar date.</div>";LBD=null;LUNAR_BDAY=null;document.getElementById("bdayFinder").style.display="none";return;}
  var l=s2l(dt),z=zod(y),f=fests(l),gy=dt.getFullYear(),gm=dt.getMonth()+1,gd=dt.getDate();
  var alm=auspiciousDay(gy,gm-1,gd);
  res.innerHTML=buildResult(
    MEN[gm-1]+" "+gd+", "+gy,
    (lp?"闰":"")+y+"年 "+CM[m-1]+"月 "+CD[d-1],
    gzy(y)+" · Year of the "+z.en+" · "+CME[m-1]+" Day "+d,
    f.map(function(x){return x.cn;}).join("、"),f.map(function(x){return x.en;}).join(", "),dt,y,alm);
  setLunarBirthday(l);
}
function convertToday(){
  var now=new Date();
  SEL.gYear.value=now.getFullYear();
  SEL.gMonth.value=now.getMonth()+1;
  SEL.gDay.value=now.getDate();
  convertG();
}
function toggleAgeSection(){
  var body=document.getElementById("ageBody"),arrow=document.getElementById("ageArrow");
  body.classList.toggle("open");
  arrow.classList.toggle("open");
}
function recalcAge(){
  if(!LBD)return;
  var r=aod(),err=aoderr(LBD);
  var rs=r.getFullYear()+"-"+pad(r.getMonth()+1)+"-"+pad(r.getDate());
  updateAgeContainer(LBD,err,rs);
}
function showView(v){
  var conv=document.getElementById("viewConv"),cal=document.getElementById("viewCal");
  conv.style.opacity="0";cal.style.opacity="0";
  requestAnimationFrame(function(){
    conv.style.display=v==="conv"?"block":"none";
    cal.style.display=v==="cal"?"block":"none";
    requestAnimationFrame(function(){
      if(v==="conv")conv.style.opacity="1";
      if(v==="cal")cal.style.opacity="1";
    });
  });
  var bc=document.querySelector(".btn-conv"),bca=document.querySelector(".btn-cal");
  bc.classList.toggle("active",v==="conv");bc.setAttribute("aria-pressed",v==="conv");
  bca.classList.toggle("active",v==="cal");bca.setAttribute("aria-pressed",v==="cal");
  if(v==="cal")renderCal();
}

/* ── CALENDAR ── */
var VD=new Date(),calRenderTimer=null;
function renderCal(){
  if(calRenderTimer)cancelAnimationFrame(calRenderTimer);
  calRenderTimer=requestAnimationFrame(function(){
    if(multiMonth){
      document.getElementById("calBody").closest("table").style.display="none";
      var mv=document.getElementById("multiMonthView");
      mv.style.display="block";
      mv.innerHTML=render3Months();
      var wrap=mv.querySelector(".mm-wrap");
      if(wrap){
        var months=wrap.querySelectorAll(".mm-month");
        if(months[1])document.getElementById("calTitle").innerHTML=months[1].querySelector(".mm-title").innerHTML;
        setTimeout(function(){wrap.scrollLeft=0;},0);
        wrap.addEventListener("scroll",function(){
          var months=wrap.querySelectorAll(".mm-month");
          var cx=wrap.scrollLeft+wrap.offsetWidth/2;
          var best=0,bestDist=Infinity;
          months.forEach(function(m,i){
            var mr=m.getBoundingClientRect();
            var mc=mr.left+mr.width/2;
            var dist=Math.abs(mc-(wrap.getBoundingClientRect().left+wrap.offsetWidth/2));
            if(dist<bestDist){bestDist=dist;best=i;}
          });
          var ym=months[best].querySelector(".mm-title").innerHTML;
          document.getElementById("calTitle").innerHTML=ym;
        });
      }
      document.getElementById("detail").classList.remove("show");
      document.getElementById("detail").innerHTML="";
    }else{
      var tbl=document.getElementById("calBody").closest("table");
      if(tbl)tbl.style.display="";
      document.getElementById("multiMonthView").style.display="none";
      _renderCalNow();
    }
  });
}
function _renderCalNow(){
  var y=VD.getFullYear(),m=VD.getMonth(),mid=s2l(new Date(y,m,15));
  var zMid=mid?zod(mid.year):{en:"?",ex:"#666",ee:"?",ec:"?"};
  var gzyMid=mid?gzy(mid.year):"";
  document.getElementById("calTitle").innerHTML=MEN[m]+" "+y
    +"<small>"+gzyMid+" · Year of the "+zMid.en
    +" <span style='background:"+zMid.ex+";color:#fff;padding:2px 8px;border-radius:var(--md-shape-xs);font-size:10px'>"+zMid.ee+" "+zMid.ec+"</span></small>";
    var first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),today=new Date();
  var html="",cell=0;
  // Add blank week number cell for first row
  html+="<td class='wn'></td>";cell++;
  for(var i=0;i<first;i++){html+="<td class='empty'></td>";cell++;}
  for(var d=1;d<=days;d++){
    var dt=new Date(y,m,d),l=s2l(dt);
    /* ── Null-guard: skip rendering lunar info for dates outside 1900-2100 range ── */
    if(!l){
      var it=dt.toDateString()===today.toDateString();
      var cls=it?"today":"";
      html+="<td class='"+cls+"' onclick='jumpToDate("+y+","+m+","+d+")' tabindex='0' role='button' aria-label='"+MEN[m]+" "+d+", "+y+"'>"
        +"<span class='g-day'>"+d+"</span></td>";
      cell++;
      if(cell%8===0){html+="</tr><tr><td class='wn'></td>";cell++;}
      continue;
    }
    var fs=fests(l),lb=cellLabel(l);
    var moon=moonOf(y,m,d),hn=hasNote(y,m,d),it=dt.toDateString()===today.toDateString();
    var st=getSolarTerm(y,m+1,d);
    var dots="";
    if(fs.some(function(f){return f.t==="trad";}))dots+="<span class='dot trad'></span>";
    if(fs.some(function(f){return f.t==="tao";}))dots+="<span class='dot tao'></span>";
    if(hn)dots+="<span class='dot entry'></span>";
    var cls=it?"today"+(hn?" has-entry":""):hn?"has-entry":fs.length?"fest":moon==="new"?"newmoon":moon==="full"?"fullmoon":"";
    var pv="";
    if(hn){var ns=getNotes(y,m,d);if(ns.length)pv="<span class='entry-preview'>"+esc(ns[0].text)+"</span>";}
    var mi=moon==="new"||moon==="full"?detailedMoonPhase(dt).ico:"";
    var vb=isVegDay(l)?"<span class='veg-badge'>🥬</span>":"";
    var stLbl=st?'<span class="st-badge">'+st.cn+'</span>':'';
    var a11yLabel=MEN[m]+" "+d+", "+y+" — "+lb.t+" "+(fs.length?fs.map(function(f){return f.cn;}).join(" "):"");
    html+="<td class='"+cls+"' onclick='jumpToDate("+y+","+m+","+d+")' tabindex='0' role='button' aria-label='"+esc(a11yLabel)+"'>"
      +dots+"<span class='g-day'>"+d+"</span>"+stLbl+"<span class='c-day"+(lb.f?" festival":"")+"'>"+lb.t+"</span>"
      +mi+pv+vb+"</td>";
    cell++;
    if(cell%8===0){html+="</tr><tr><td class='wn'></td>";cell++;}
  }
  while(cell%8!==0){html+="<td class='empty'></td>";cell++;}
  html+="</tr></tbody></table>";
  document.getElementById("calBody").innerHTML=html;

  /* ── Rebuild year festival panel if shown ── */
  var yfp=document.getElementById("yearFestPanel");
  if(yfp&&yfp.classList.contains("show")){
    yfp.innerHTML=buildYearFestivalsHTML(VD.getFullYear());
  }

  /* ── Update Today Card ── */
  buildTodayCard();

  /* ── Update Month Events List ── */
  buildMonthEvents(y,m);

  /* ── Update legend active states ── */
  var legend=document.getElementById("legend");
  if(legend){
    var items=legend.querySelectorAll("span");
    items.forEach(function(sp){sp.style.opacity=".6";});
  }
}

/* ── BUILD TODAY CARD ── */
function buildTodayCard(){
  var now=new Date();
  var l=s2l(now);
  if(!l){document.getElementById("todayCard").style.display="none";return;}
  document.getElementById("todayCard").style.display="block";
  var z=zod(l.year);
  var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var greg=days[now.getDay()]+", "+MEN[now.getMonth()]+" "+now.getDate()+", "+now.getFullYear();
  document.querySelector(".tc-greg").textContent=greg;
  document.querySelector(".tc-lunar").innerHTML=(l.isLeap?"闰":"")+l.year+"年 "+CM[l.month-1]+"月 "+CD[l.day-1]
    +" · <strong>"+z.cn+" ("+z.en+") Year</strong>"
    +" · "+gzy(l.year);

  // Upcoming events (next 7 days)
  var eventsHtml="",found=0;
  for(var cd=0;cd<8&&found<3;cd++){
    var cdt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+cd);
    if(cdt<now&&cd===0){/* today ok */}
    if(cd>0&&cdt<=now)continue;
    var cl=s2l(cdt);if(!cl)continue;
    var cfs=fests(cl);
    var diff=Math.ceil((cdt-now)/86400000);
    if(cfs.length){
      found++;
      var lbl=diff===0?"Today":diff===1?"Tomorrow":diff+"d";
      eventsHtml+="<span class='tc-badge' onclick='jumpToDate("+cdt.getFullYear()+","+cdt.getMonth()+","+cdt.getDate()+")'><span class='tc-num'>"+lbl+"</span> "+cfs[0].cn+"</span>";
    }
  }
  // Check today's events too
  if(!eventsHtml){
    // Show moon phase or veg day instead
    var mp=detailedMoonPhase(now);
    eventsHtml+="<span class='tc-badge'>"+mp.ico+" "+mp.cn+"</span>";
    if(isVegDay(l))eventsHtml+="<span class='tc-badge'>🥬 Veg. Day</span>";
  }

  // Countdown to NEXT festival beyond 7 days (up to 60 days)
  var nextFest=null;
  for(var fd=8;fd<=60;fd++){
    var fdt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+fd);
    var fl=s2l(fdt);if(!fl)continue;
    var ffs=fests(fl);
    if(ffs.length){nextFest={dt:fdt,days:fd,fest:ffs[0]};break;}
  }
  // Also check for solar terms in next 14 days
  var nextST=null;
  for(var sd=8;sd<=14;sd++){
    var sdt=new Date(now.getFullYear(),now.getMonth(),now.getDate()+sd);
    var st=getSolarTerm(sdt.getFullYear(),sdt.getMonth()+1,sdt.getDate());
    if(st){nextST={dt:sdt,days:sd,term:st};break;}
  }
  if(nextFest||nextST){
    eventsHtml+='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;padding-top:4px;border-top:1px solid var(--md-outline-variant)">';
    if(nextFest){
      var flbl=nextFest.days+"d";
      eventsHtml+='<span class="tc-badge" onclick="jumpToDate('+nextFest.dt.getFullYear()+','+nextFest.dt.getMonth()+','+nextFest.dt.getDate()+')">⏳ '+flbl+' · '+esc(nextFest.fest.cn)+'</span>';
    }
    if(nextST){
      eventsHtml+='<span class="tc-badge" onclick="jumpToDate('+nextST.dt.getFullYear()+','+nextST.dt.getMonth()+','+nextST.dt.getDate()+')">🌿 '+nextST.days+"d · "+esc(nextST.term.cn)+'</span>';
    }
    eventsHtml+='</div>';
  }

  document.getElementById("todayEvents").innerHTML=eventsHtml||"<span class='tc-badge'>No upcoming events</span>";
}

/* ── BUILD MONTH EVENTS LIST ── */
function buildMonthEvents(y,m){
  var days=new Date(y,m+1,0).getDate();
  var html="";
  for(var d=1;d<=days;d++){
    var dt=new Date(y,m,d),l=s2l(dt);
    if(!l)continue;
    var fs=fests(l),st=getSolarTerm(y,m+1,d);
    var mV=moonOf(y,m,d);
    var vb=isVegDay(l);
    var rowHtml="";
    if(fs.length){
      fs.forEach(function(f){
        var cls="me-badge "+(f.t==="trad"?"me-trad":"me-tao");
        rowHtml+="<span class='"+cls+"'>"+f.t+"</span> ";
      });
      html+="<div class='me-item' onclick='jumpToDate("+y+","+m+","+d+")'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>"+fs.map(function(f){return f.cn;}).join("、")+"<small>"+fs.map(function(f){return f.en;}).join(", ")+"</small></span>"
        +rowHtml+"</div>";
    }else if(st){
      html+="<div class='me-item' onclick='jumpToDate("+y+","+m+","+d+")'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>🌿 "+st.cn+"<small>"+st.en+"</small></span>"
        +"<span class='me-badge me-st'>Solar Term</span></div>";
    }else if(mV==="new"||mV==="full"){
      var mp=detailedMoonPhase(dt);
      html+="<div class='me-item' onclick='jumpToDate("+y+","+m+","+d+")'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>"+mp.ico+" "+mp.cn+"<small>"+mp.en+"</small></span>"
        +"<span class='me-badge me-moon'>"+(mV==="new"?"New Moon":"Full Moon")+"</span></div>";
    }else if(vb){
      html+="<div class='me-item' onclick='jumpToDate("+y+","+m+","+d+")'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>🥬 Vegetarian Observance<small>六斋日</small></span>"
        +"<span class='me-badge me-veg'>Veg</span></div>";
    }
  }
  document.getElementById("monthEventsBody").innerHTML=html||"<div style='text-align:center;color:var(--text4);padding:12px;font-size:13px'>No special events this month</div>";
}

/* ── JUMP TO DATE ── */
function jumpToDate(y,m,d){
  /* ── Save the currently focused element for focus restoration ── */
  var lastFocus=document.activeElement;
  var dt=new Date(y,m,d),l=s2l(dt);
  if(!l)return;
  var el=document.getElementById("detail");
  var fs=fests(l),z=zod(l.year),lb=cellLabel(l);
  var st=getSolarTerm(y,m+1,d);
  var mp=detailedMoonPhase(dt);
  var alm=auspiciousDay(y,m,d);
  var mV=moonOf(y,m,d);
  var hn=hasNote(y,m,d);
  var ns=getNotes(y,m,d);
  var ch=chineseHour(dt);
  var vb=isVegDay(l);

  var html="<div class='detail-header'><h3>"+esc(MEN[m])+" "+d+", "+y+"</h3>"
    +"<span class='ens'>"+(l.isLeap?"闰":"")+l.year+"年 "+CM[l.month-1]+"月 "+CD[l.day-1]+"</span></div>";

  // Zodiac + Ganzhi
  html+="<div class='line'>"+gzy(l.year)+" · "+esc(z.cn)+" ("+esc(z.en)+") · <span style='background:"+z.ex+";color:#fff;padding:1px 6px;border-radius:var(--md-shape-xs);font-size:10px'>"+esc(z.ee)+" "+esc(z.ec)+"</span></div>";

  // Stem branch
  var jd=julianDay(dt),dsb=dayStemBranch(jd);
  html+="<div class='line'>"+esc(dsb.fullCn)+" Day · "+esc(ch.cn)+" ("+esc(ch.en)+")</div>";

  // Moon phase
  html+="<div class='line'>"+mp.ico+" "+esc(mp.cn)+" ("+esc(mp.en)+")";
  if(mV==="new"||mV==="full")html+=" · <strong>"+(mV==="new"?"🌑 New Moon":"🌕 Full Moon")+"</strong>";
  html+="</div>";

  // Solar term
  if(st)html+="<div class='line'>🌿 "+esc(st.cn)+" ("+esc(st.en)+")</div>";

  // Veg day
  if(vb)html+="<div class='line'>🥬 Vegetarian Observance Day (六斋日)</div>";

  // Festivals
  if(fs.length){
    html+="<div class='line' style='margin-top:8px'>";
    fs.forEach(function(f){
      var cls=f.t==="trad"?"tag trad":"tag tao";
      html+="<span class='"+cls+"'>"+esc(f.cn)+"<small>"+esc(f.en)+"</small></span> ";
    });
    html+="</div>";
  }

  // Almanac
  html+="<div class='alm-box'><strong>📜 Almanac 皇历</strong><br>"
    +"<span style='color:var(--green)'>✅ "+esc(alm.suit.join(", "))+"</span><br>"
    +"<span style='color:var(--md-error)'>❌ "+esc(alm.avoid.join(", "))+"</span><br>"
    +"<span class='ens'>"+alm.suit.map(function(a){return ACT_EN[a];}).join(", ")+"</span></div>";

  // Notes section
  html+="<div class='entry-section'><h4>📝 My Notes / 我的备注"
    +"<span class='entry-actions'><button onclick='addNoteEntry("+y+","+m+","+d+")'>➕ Add</button></span></h4>";
  if(ns.length){
    ns.forEach(function(n){
      html+="<div class='entry-item'><span class='entry-text'>"+esc(n.text)+"</span>"
        +"<button class='entry-del' onclick='delNote("+y+","+m+","+d+","+n.id+");jumpToDate("+y+","+m+","+d+")' title='Delete note'>✕</button></div>";
    });
  }else{
    html+="<div class='no-entry'>No notes yet. Tap Add to create one.</div>";
  }
  html+="</div>";

  // Actions
  html+="<div class='detail-actions'>"
    +"<button class='share-btn' onclick='navigator.share?navigator.share({title:\"Lunar Calendar\",text:\""+esc(MEN[m])+" "+d+", "+y+"\"}):alert(\"Share not supported\")'>📤 Share</button>"
    +"<button class='copy-btn' onclick='copyDetail()'>📋 Copy</button>"
    +"<button id='detailCloseBtn' onclick='document.getElementById(\"detail\").classList.remove(\"show\");if(lastFocus&&typeof lastFocus.focus===\"function\")lastFocus.focus();'>✕ Close</button></div>";

  el.innerHTML=html;
  el.classList.add("show");
}

function addNoteEntry(y,m,d){
  var t=prompt("Enter note / 输入备注:");
  if(t&&t.trim()){
    addNote(y,m,d,t.trim().slice(0,500));
    jumpToDate(y,m,d);
    renderCal();
  }
}

function copyDetail(){
  var el=document.getElementById("detail");
  if(!el)return;
  var txt=el.textContent.replace(/[✕✅❌➕📋📤✕]/g,"").trim();
  if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){showToast("📋 Copied!");});}
  else{var ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);showToast("📋 Copied!");}
}

/* ── NAVIGATION ── */
function jumpToday(){
  VD=new Date();
  hideSearch();
  renderCal();
  var el=document.getElementById("detail");
  if(el)el.classList.remove("show");
}
function changeMonth(delta){
  var y=VD.getFullYear(),m=VD.getMonth()+delta;
  while(m>11){m-=12;y++;}
  while(m<0){m+=12;y--;}
  VD=new Date(y,m,1);
  hideSearch();
  renderCal();
  var el=document.getElementById("detail");
  if(el)el.classList.remove("show");
}

/* ── YEAR VIEW ── */
var yearViewOn=false;
function toggleYearView(){
  yearViewOn=!yearViewOn;
  var btn=document.getElementById("yearViewBtn"),yvc=document.getElementById("yearViewContent");
  var calTable=document.querySelector("table.cal"),monthEvents=$("monthEvents"),legend=$("legend"),yfp=document.getElementById("yearFestPanel");
  var calHeader=document.querySelector(".cal-header"),todayBtnRow=document.querySelector(".cal-header+div");
  if(!yvc)return;
  if(yearViewOn){
    // Hide regular calendar parts
    if(calTable)calTable.style.display="none";
    if(monthEvents)monthEvents.style.display="none";
    if(legend)legend.style.display="none";
    if(calHeader)calHeader.style.display="none";
    if(todayBtnRow)todayBtnRow.style.display="none";
    // Show year view
    yvc.innerHTML=renderYearViewHTML(VD.getFullYear());
    yvc.style.display="block";
    if(yfp)yfp.classList.remove("show");
    btn.textContent="⬅ Back";
  }else{
    // Restore regular calendar
    if(calTable)calTable.style.display="";
    if(monthEvents)monthEvents.style.display="";
    if(legend)legend.style.display="";
    if(calHeader)calHeader.style.display="";
    if(todayBtnRow)todayBtnRow.style.display="";
    yvc.style.display="none";
    btn.textContent="📆 Year View";
  }
}
function renderYearViewHTML(y){
  var html="<div class='year-grid-wrap'><div class='year-grid-header'><div class='yg-title'>📆 "+y+"<small>Full Year · 全年</small></div><button style='background:var(--purple);color:#fff;border:none;border-radius:var(--md-shape-sm);padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:500' onclick='showYearFestivals()'>🏮 Festivals</button></div>";
  html+="<div class='year-grid'>";
  var dow=["Su","Mo","Tu","We","Th","Fr","Sa"];
  for(var m=0;m<12;m++){
    var firstDOW=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
    var midDate=new Date(y,m,15),midL=s2l(midDate);
    var ganZhi=midL?gzy(midL.year):"";
    var today=new Date();
    html+="<div class='ymonth' onclick='jumpToMonth("+y+","+m+")'><div class='ymonth-title'>"+MSH[m]+"</div><div class='ymonth-sub'>"+ganZhi+"</div><div class='ym-days'>";
    for(var w=0;w<7;w++)html+="<div class='ym-dw'>"+dow[w]+"</div>";
    for(var p=0;p<firstDOW;p++)html+="<div class='ym-d ym-empty'></div>";
    for(var d=1;d<=days;d++){
      var dt=new Date(y,m,d),l=s2l(dt);
      var isToday=dt.toDateString()===today.toDateString();
      var wd=dt.getDay();
      var fs=l?fests(l):[];
      var hasFest=fs.length>0;
      var cls="ym-d";
      if(isToday)cls+=" ym-today";
      if(hasFest)cls+=" ym-fest";
      if(wd===0||wd===6)cls+=" ym-"+(wd===0?"sun":"sat");
      html+="<div class='"+cls+"'><span class='ym-dg'>"+d+"</span>"+(l?"<div class='ym-dc'>"+CD[l.day-1]+"</div>":"")+"</div>";
    }
    html+="</div></div>";
  }
  html+="</div></div>";
  return html;
}
function jumpToMonth(y,m){
  VD=new Date(y,m,1);
  toggleYearView();
  renderCal();
}
function showYearFestivals(){
  var yfp=document.getElementById("yearFestPanel");
  if(!yfp)return;
  yfp.innerHTML=buildYearFestivalsHTML(VD.getFullYear());
  yfp.classList.add("show");
}

/* ── Year Festivals (used by year view) ── */
function buildYearFestivalsHTML(y){
  var html="<div class='yf-header'><h3>📆 "+y+" Year Overview<small>Festivals, Solar Terms &amp; Events</small></h3><button onclick='document.getElementById(\"yearFestPanel\").classList.remove(\"show\")'>✕</button></div>";
  for(var m=0;m<12;m++){
    var days=new Date(y,m+1,0).getDate(),mh="<div class='yf-month'><div class='yf-month-title'>"+MEN[m]+"</div><div class='yf-items'>";
    for(var d=1;d<=days;d++){
      var dt=new Date(y,m,d),l=s2l(dt);
      if(!l)continue;
      var fs=fests(l),st=getSolarTerm(y,m+1,d);
      if(fs.length||st){
        fs.forEach(function(f){
          var cls=f.t==="trad"?"yf-trad":"yf-tao";
          mh+="<span class='yf-item "+cls+"' tabindex='0' role='button' onclick='jumpToDate("+y+","+m+","+d+");document.getElementById(\"yearFestPanel\").classList.remove(\"show\");toggleYearView()'><span class='yf-day'>"+esc(d)+"</span>"+esc(f.cn)+"<small>"+esc(f.en)+"</small></span>";
        });
        if(st){
          mh+="<span class='yf-item yf-st' tabindex='0' role='button' onclick='jumpToDate("+y+","+m+","+d+");document.getElementById(\"yearFestPanel\").classList.remove(\"show\");toggleYearView()'><span class='yf-day'>"+esc(d)+"</span>🌿 "+esc(st.cn)+"<small>"+esc(st.en)+"</small></span>";
        }
      }
    }
    mh+="</div></div>";
    html+=mh;
  }
  return html;
}

function $(id){return document.getElementById(id);}

/* ── THEME ── */
var bigTextOn=false;
function toggleTheme(){
  document.body.classList.toggle("dark");
  var isDark=document.body.classList.contains("dark");
  localStorage.setItem("lunarcal_theme",isDark?"dark":"light");
}
function toggleBigText(){
  bigTextOn=!bigTextOn;
  document.body.classList.toggle("big-text",bigTextOn);
  localStorage.setItem("lunarcal_bigtext",bigTextOn?"1":"0");
}

/* ── LUNAR BIRTHDAY ── */
var LUNAR_BDAY=null;
function setLunarBirthday(l){
  LUNAR_BDAY=l;
  var bf=document.getElementById("bdayFinder");
  if(!bf)return;
  if(!l){bf.style.display="none";return;}
  bf.style.display="block";
  var z=zod(l.year);
  var next=l2s(VD.getFullYear(),l.month,l.day,l.isLeap);
  if(!next||next<VD)next=l2s(VD.getFullYear()+1,l.month,l.day,l.isLeap);
  var diff=next?Math.ceil((next-VD)/86400000):"?";
  document.getElementById("bdayResult").innerHTML="🎂 <b>"+(l.isLeap?"闰":"")+l.year+"年 "+CM[l.month-1]+"月 "+CD[l.day-1]+"</b> · "+z.cn+" "+z.en
    +"<br>Next: "+(next?MEN[next.getMonth()]+" "+next.getDate()+", "+next.getFullYear()+" ("+diff+" days)":"N/A");
}

/* ── TOAST ── */
function showToast(msg){
  var t=document.getElementById("toast");
  if(!t)return;
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(t._hide);
  t._hide=setTimeout(function(){t.classList.remove("show");},2500);
}

/* ── PWA INSTALL ── */
var installPrompt=null;
window.addEventListener("beforeinstallprompt",function(e){
  e.preventDefault();
  installPrompt=e;
  var ib=document.getElementById("installBtn");
  if(ib)ib.style.display="inline-block";
  var ib2=document.getElementById("installBanner");
  if(ib2)ib2.style.display="block";
});
function installPWA(){
  if(!installPrompt)return;
  installPrompt.prompt();
  installPrompt.userChoice.then(function(choice){
    if(choice.outcome==="accepted"){
      showToast("✅ App installed!");
      var ib=document.getElementById("installBtn");
      if(ib)ib.style.display="none";
      var ib2=document.getElementById("installBanner");
      if(ib2)ib2.style.display="none";
    }
    installPrompt=null;
  });
}
function dismissInstall(){
  var ib=document.getElementById("installBanner");
  if(ib)ib.style.display="none";
  localStorage.setItem("lunarcal_install_dismissed","1");
}

/* ── INIT ── */
var SEL={};
function init(){
  SEL.gYear=document.getElementById("gYear");
  SEL.gMonth=document.getElementById("gMonth");
  SEL.gDay=document.getElementById("gDay");
  SEL.cYear=document.getElementById("cYear");
  SEL.cMonth=document.getElementById("cMonth");
  SEL.cDay=document.getElementById("cDay");
  SEL.aYear=document.getElementById("aYear");
  SEL.aMonth=document.getElementById("aMonth");
  SEL.aDay=document.getElementById("aDay");

  var now=new Date();
  // Populate years
  for(var y=now.getFullYear()-100;y<=now.getFullYear()+10;y++){
    SEL.gYear.innerHTML+="<option value='"+y+"'>"+y+"</option>";
    SEL.cYear.innerHTML+="<option value='"+y+"'>"+y+"</option>";
    SEL.aYear.innerHTML+="<option value='"+y+"'>"+y+"</option>";
  }
  // Populate months
  for(var mo=1;mo<=12;mo++){
    SEL.gMonth.innerHTML+="<option value='"+mo+"'>"+pad(mo)+"</option>";
    SEL.cMonth.innerHTML+="<option value='"+mo+"'>"+CM[mo-1]+"</option>";
    SEL.aMonth.innerHTML+="<option value='"+mo+"'>"+pad(mo)+"</option>";
  }
  // Populate days
  for(var da=1;da<=31;da++){
    SEL.gDay.innerHTML+="<option value='"+da+"'>"+pad(da)+"</option>";
    SEL.cDay.innerHTML+="<option value='"+da+"'>"+da+"</option>";
    SEL.aDay.innerHTML+="<option value='"+da+"'>"+pad(da)+"</option>";
  }

  // Set default values
  SEL.gYear.value=now.getFullYear();
  SEL.gMonth.value=now.getMonth()+1;
  SEL.gDay.value=now.getDate();
  SEL.cYear.value=now.getFullYear();
  SEL.cMonth.value=now.getMonth()+1;
  SEL.cDay.value=now.getDate();
  SEL.aYear.value=now.getFullYear();
  SEL.aMonth.value=now.getMonth()+1;
  SEL.aDay.value=now.getDate();

  // Restore theme
  var savedTheme=localStorage.getItem("lunarcal_theme");
  if(savedTheme==="dark")document.body.classList.add("dark");
  var savedBt=localStorage.getItem("lunarcal_bigtext");
  if(savedBt==="1"){bigTextOn=true;document.body.classList.add("big-text");}

  // Check install dismissed
  if(localStorage.getItem("lunarcal_install_dismissed")==="1"){
    var ib=document.getElementById("installBanner");
    if(ib)ib.style.display="none";
  }

  // Check online status
  if(!navigator.onLine){
    var ob=document.getElementById("offlineBadge");
    if(ob)ob.style.display="block";
  }
  window.addEventListener("online",function(){var ob=document.getElementById("offlineBadge");if(ob)ob.style.display="none";});
  window.addEventListener("offline",function(){var ob=document.getElementById("offlineBadge");if(ob)ob.style.display="block";});

  // Recalculate days on year/month change
  SEL.gYear.addEventListener("change",function(){recalcDays();});
  SEL.gMonth.addEventListener("change",function(){recalcDays();});
  SEL.cYear.addEventListener("change",function(){recalcCDays();updateLeapCheckbox();});
  SEL.cMonth.addEventListener("change",function(){recalcCDays();updateLeapCheckbox();});
  SEL.aYear.addEventListener("change",function(){recalcADays();});
  SEL.aMonth.addEventListener("change",function(){recalcADays();});
  // Recalc age on change
  SEL.aYear.addEventListener("change",recalcAge);
  SEL.aMonth.addEventListener("change",recalcAge);
  SEL.aDay.addEventListener("change",recalcAge);
  document.getElementById("aToday").addEventListener("change",function(){
    var sel=[SEL.aYear,SEL.aMonth,SEL.aDay];
    sel.forEach(function(s){s.disabled=this.checked;},this);
    recalcAge();
  });

  recalcDays();
  recalcCDays();
  updateLeapCheckbox();
  recalcADays();

  // Auto-convert today on load
  setTimeout(convertG,0);

  // Multi-month button no longer in UI — fully removed

  // Check notification preference
  checkNotifPref();

  // Show calendar view first, then calendar
  showView("cal");
  renderCal();

  // Search input listener
  document.getElementById("searchInput").addEventListener("input",onSearchInput);
  document.addEventListener("click",function(e){var sr=document.getElementById("searchResults");if(sr&&!e.target.closest(".search-box"))sr.classList.remove("show");});

  // Global keyboard navigation: activate focused elements with Enter/Space
  document.addEventListener("keydown",function(e){
    if(e.key==="Enter"||e.key===" "){
      var target=e.target;
      if(target.getAttribute("role")==="button"&&target.tabIndex>=0){
        e.preventDefault();
        target.click();
      }
    }
  });

  // Register service worker
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(function(e){console.warn("SW registration failed:",e);});
  }
}

function recalcDays(){
  var y=+SEL.gYear.value,m=+SEL.gMonth.value,days=new Date(y,m,0).getDate();
  var cur=+SEL.gDay.value;
  SEL.gDay.innerHTML="";
  for(var d=1;d<=days;d++)SEL.gDay.innerHTML+="<option value='"+d+"'>"+pad(d)+"</option>";
  if(cur<=days)SEL.gDay.value=cur;
}
function updateLeapCheckbox(){
  var y=+SEL.cYear.value,m=+SEL.cMonth.value,lp=document.getElementById("cLeap");
  if(!lp)return;
  var leapMonth=llm(y);
  if(leapMonth&&leapMonth===m){
    lp.disabled=false;
    lp.parentElement.style.opacity="1";
  }else{
    lp.disabled=true;
    lp.checked=false;
    lp.parentElement.style.opacity=".5";
  }
}
function recalcCDays(){
  var y=+SEL.cYear.value,m=+SEL.cMonth.value,days=lmd(y,m);
  if(!days)days=30;
  var cur=+SEL.cDay.value;
  SEL.cDay.innerHTML="";
  for(var d=1;d<=days;d++)SEL.cDay.innerHTML+="<option value='"+d+"'>"+d+"</option>";
  if(cur<=days)SEL.cDay.value=cur;
}
function recalcADays(){
  var y=+SEL.aYear.value,m=+SEL.aMonth.value,days=new Date(y,m,0).getDate();
  var cur=+SEL.aDay.value;
  SEL.aDay.innerHTML="";
  for(var d=1;d<=days;d++)SEL.aDay.innerHTML+="<option value='"+d+"'>"+pad(d)+"</option>";
  if(cur<=days)SEL.aDay.value=cur;
}

// Init on DOM ready
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
