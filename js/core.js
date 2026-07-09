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

/* ── LOCAL STORAGE NOTES (with cache) ── */
var SK="lunarcal_notes";
var _notesCache=null;
var NOTE_COLORS=["#16a085","#e67e22","#3498db","#9b59b6","#e74c3c","#f1c40f","#1abc9c","#2c3e50"];
function loadNotes(){
  if(_notesCache)return _notesCache;
  try{
    var raw=JSON.parse(localStorage.getItem(SK)||"{}");
    for(var key in raw){
      if(!Array.isArray(raw[key])){delete raw[key];continue;}
      raw[key]=raw[key].filter(function(n){return n&&typeof n.id==="number"&&typeof n.text==="string";});
      if(!raw[key].length)delete raw[key];
    }
    _notesCache=raw;
    return raw;
  }catch(e){return {};}
}
function saveNotes(o){
  _notesCache=o;
  try{localStorage.setItem(SK,JSON.stringify(o));}
  catch(e){
    if((e.name==="QuotaExceededError"||e.code===22)&&typeof showToast==="function"){
      showToast("⚠️ Storage full. Delete some notes to free space.");
    }
  }
}
function nk(y,m,d){return y+"-"+(m+1)+"-"+d;}
function getNotes(y,m,d){var o=loadNotes(),k=nk(y,m,d);return Array.isArray(o[k])?o[k]:[];}
function addNote(y,m,d,t,c){
  if(t.length>500)return;
  if(!c||NOTE_COLORS.indexOf(c)===-1)c=NOTE_COLORS[0];
  var o=loadNotes(),k=nk(y,m,d);if(!Array.isArray(o[k]))o[k]=[];o[k].push({id:Date.now(),text:t,color:c});saveNotes(o);
}
function updateNote(y,m,d,id,t,c){
  var o=loadNotes(),k=nk(y,m,d);
  if(!Array.isArray(o[k]))return;
  for(var i=0;i<o[k].length;i++){
    if(o[k][i].id===id){
      if(t!==undefined)o[k][i].text=t;
      if(c!==undefined)o[k][i].color=c;
      saveNotes(o);
      return;
    }
  }
}
function getNote(y,m,d,id){
  var ns=getNotes(y,m,d);
  for(var i=0;i<ns.length;i++){if(ns[i].id===id)return ns[i];}
  return null;
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

/* ── FESTIVAL DETAIL BLURBS ── */
var FD={"1-1-0":"The Spring Festival (Chinese New Year) is the most important traditional holiday in China. Celebrated from the first day of the first lunar month, it marks the beginning of the new year on the traditional lunisolar calendar. Traditions include family reunions, feasting, giving red envelopes (红包), and setting off fireworks.",
"1-1-1":"Maitreya Buddha (弥勒佛) is the future Buddha who will appear on Earth when the teachings of Gautama Buddha have faded. His image — laughing, with a large belly — symbolizes happiness, contentment, and abundance.",
"1-15-0":"The Lantern Festival (元宵节) marks the first full moon of the new lunar year. People light lanterns, eat tangyuan (glutinous rice balls), solve riddles on lanterns, and enjoy dragon dances. It traditionally ended the Chinese New Year celebrations.",
"2-2-0":"Dragon Raises Head (龙抬头 / 二月二) falls on the 2nd day of the 2nd lunar month. It is believed that the Dragon King lifts his head on this day, bringing spring rains. People get haircuts for good luck and eat special foods named after dragons.",
"5-5-0":"The Dragon Boat Festival (端午节) commemorates the death of Qu Yuan, a patriotic poet of ancient Chu who drowned himself in protest against corruption. Traditions include dragon boat racing, eating zongzi (sticky rice dumplings), and hanging mugwort.",
"7-7-0":"Qixi Festival (七夕节), also known as Chinese Valentine's Day, is based on the romantic legend of the cowherd Niulang and the weaver girl Zhinu, who are allowed to meet once a year on this night across the Milky Way.",
"7-15-0":"The Ghost Festival (中元节 / 盂兰盆节) is a traditional Taoist and Buddhist festival. It is believed that the gates of the underworld open, allowing ghosts and spirits to roam the earth. Families make offerings to appease wandering spirits and honor ancestors.",
"8-15-0":"The Mid-Autumn Festival (中秋节) celebrates the harvest and moon-gazing. Families gather to eat mooncakes (月饼), admire the full moon, and tell the story of Chang'e, the Moon Goddess, who drank an elixir of immortality and floated to the moon.",
"9-9-0":"Double Ninth Festival (重阳节), also known as Chongyang Festival, is a day to honor elders and climb mountains. The number nine is considered yang, and the double ninth is auspicious. Traditions include hiking, wearing zhuyu (dogwood), and eating chrysanthemum cakes.",
"12-30-0":"New Year's Eve (除夕 / Chuxi) is the evening of the last day of the lunar year. Families hold reunion dinners, stay up late (守岁) to welcome the new year, and set off fireworks at midnight to drive away the mythical beast Nian (年兽)."};

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
  if(y>=2101)return null;
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
function gzy(y){var i=(y-4)%60;if(i<0)i+=60;return TG[i%10]+DZ[i%12]+"年";}
function zod(y){var i=(y-4)%60;if(i<0)i+=60;var s=i%10;var zIndex=(y-4)%12;if(zIndex<0)zIndex+=12;return{cn:ZC[zIndex],en:ZE[zIndex],ec:EC[s],ee:EL[s],ex:EX[s]};}
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
  }).sort(function(a,b){return a.dt.getTime()-b.dt.getTime();}).slice(0,30);
  var html="";
  if(!results.length){
    html="<div class='sr-none'>No results found</div>";
  }else{
    results.forEach(function(r){
      var ico=r.type==="fest"?"\ud83c\udf8a":r.type==="st"?"\ud83c\udf3f":"\ud83d\udcdd";
      var en=r.type==="note"?"":r.en;
      html+="<div class='sr-item' data-sr-y='"+r.dt.getFullYear()+"' data-sr-m='"+r.dt.getMonth()+"' data-sr-d='"+r.dt.getDate()+"'>"
        +"<span class='sr-ico'>"+ico+"</span><span class='sr-cn'>"+esc(r.cn)+"</span>"
        +(en?"<span class='sr-en'>"+esc(en)+"</span>":"")
        +"<span class='sr-date'>"+MEN[r.dt.getMonth()]+" "+r.dt.getDate()+", "+r.dt.getFullYear()+"</span>"
        +"</div>";
    });
  }
  res.innerHTML=html;res.classList.add("show");
}

function hideSearch(){
  var el=document.getElementById("searchResults");
  if(el)el.classList.remove("show");
}
function toggleSearch(){
  var sb=document.getElementById("searchBox");
  if(sb){sb.classList.toggle("show");if(sb.classList.contains("show")){document.getElementById("searchInput").focus();}}
}

/* ── PUSH NOTIFICATIONS ── */
var NOTIF_GRANTED=false;
function requestNotifPermission(){
  if("Notification" in window){
    Notification.requestPermission().then(function(p){
      NOTIF_GRANTED=p==="granted";
      if(NOTIF_GRANTED){
        showToast("\ud83d\udd14 Notifications enabled!");
        sendTodayFestivalNotif();
      }else{
        showToast("⚠️ Notifications blocked. Enable in Settings.");
      }
      localStorage.setItem("lunacal_notif",p);
    });
  }else{
    showToast("⚠️ Notifications not supported in this browser");
  }
}
function checkNotifPref(){
  if("Notification" in window){
    NOTIF_GRANTED=Notification.permission==="granted";
    if(NOTIF_GRANTED){
      var btn=document.getElementById("notifBtn");
      if(btn)btn.textContent="\ud83d\udd14 On";
      sendTodayFestivalNotif();
    }
  }
}
function sendTodayFestivalNotif(){
  if(!NOTIF_GRANTED)return;
  var now=new Date();
  var l=s2l(now);
  if(!l)return;
  var lastKey="lunacal_notif_last";
  var lastNotif=localStorage.getItem(lastKey);
  var todayKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
  if(lastNotif===todayKey)return;
  var fs=fests(l);
  var title,body;
  if(fs.length){
    title="\ud83c\udf89 "+fs[0].cn;
    body="Today: "+fs.map(function(f){return f.cn;}).join(", ");
  }else if(l.day===1){
    title="\ud83c\udf19 New Month";
    body="Today is lunar "+CM[l.month-1]+" "+CD[l.day-1];
  }else if(l.day===15){
    title="\ud83c\udf15 Full Moon";
    body="Today is the 15th day of the lunar month";
  }else{
    return; // No notable event
  }
  try{
    var notif=new Notification(title,{body:body,icon:"./lunar.svg",silent:true});
    setTimeout(function(){notif.close();},8000);
    localStorage.setItem(lastKey,todayKey);
  }catch(e){/* ignore */}
}

/* ── ICS EXPORT ── */
function exportICS(){
  try{
    var y=VD.getFullYear(),ics="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lunar Calendar//EN\r\n";
    for(var m=0;m<12;m++){
      var days=new Date(y,m+1,0).getDate();
      for(var d=1;d<=days;d++){
        var dt=new Date(y,m,d),l=s2l(dt);if(!l)continue;
        var fs=fests(l);
        if(fs.length){
          fs.forEach(function(f){
            var ds=""+dt.getFullYear()+pad(dt.getMonth()+1)+pad(dt.getDate());
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
  }catch(e){
    showToast("⚠️ Export failed: "+e.message);
  }
}
function donly(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

/* ── ZODIAC COMPATIBILITY ── */
var ZC_PAIRS=[
  {a1:0,a2:4,rate:90,note:"鼠猴——上上等婚配 / Rat+Monkey — Excellent"},
  {a1:0,a2:8,rate:85,note:"鼠龙——上等婚配 / Rat+Dragon — Great"},
  {a1:0,a2:2,rate:40,note:"鼠马——相冲 / Rat+Horse — Clash"},
  {a1:0,a2:6,rate:35,note:"鼠羊——相害 / Rat+Goat — Harm"},
  {a1:1,a2:5,rate:90,note:"牛蛇——上上等婚配 / Ox+Snake — Excellent"},
  {a1:1,a2:8,rate:85,note:"牛鸡——上等婚配 / Ox+Rooster — Great"},
  {a1:1,a2:6,rate:35,note:"牛羊——相冲 / Ox+Goat — Clash"},
  {a1:1,a2:4,rate:30,note:"牛马——相害 / Ox+Horse — Harm"},
  {a1:2,a2:6,rate:90,note:"虎狗——上上等婚配 / Tiger+Dog — Excellent"},
  {a1:2,a2:10,rate:85,note:"虎马——上等婚配 / Tiger+Horse — Great"},
  {a1:2,a2:8,rate:35,note:"虎猴——相冲 / Tiger+Monkey — Clash"},
  {a1:2,a2:4,rate:35,note:"虎蛇——相害 / Tiger+Snake — Harm"},
  {a1:3,a2:7,rate:90,note:"兔猪——上上等婚配 / Rabbit+Pig — Excellent"},
  {a1:3,a2:11,rate:85,note:"兔羊——上等婚配 / Rabbit+Goat — Great"},
  {a1:3,a2:9,rate:35,note:"兔鸡——相冲 / Rabbit+Rooster — Clash"},
  {a1:3,a2:5,rate:30,note:"兔龙——相害 / Rabbit+Dragon — Harm"},
  {a1:4,a2:8,rate:90,note:"龙猴——上上等婚配 / Dragon+Monkey — Excellent"},
  {a1:4,a2:0,rate:85,note:"龙鼠——上等婚配 / Dragon+Rat — Great"},
  {a1:4,a2:10,rate:35,note:"龙狗——相冲 / Dragon+Dog — Clash"},
  {a1:4,a2:2,rate:30,note:"龙兔——相害 / Dragon+Rabbit — Harm"},
  {a1:5,a2:9,rate:90,note:"蛇鸡——上上等婚配 / Snake+Rooster — Excellent"},
  {a1:5,a2:1,rate:85,note:"蛇牛——上等婚配 / Snake+Ox — Great"},
  {a1:5,a2:11,rate:35,note:"蛇猪——相冲 / Snake+Pig — Clash"},
  {a1:5,a2:3,rate:30,note:"蛇虎——相害 / Snake+Tiger — Harm"},
  {a1:6,a2:10,rate:90,note:"马狗——上上等婚配 / Horse+Dog — Excellent"},
  {a1:6,a2:2,rate:85,note:"马虎——上等婚配 / Horse+Tiger — Great"},
  {a1:6,a2:0,rate:35,note:"马鼠——相冲 / Horse+Rat — Clash"},
  {a1:6,a2:1,rate:30,note:"马牛——相害 / Horse+Ox — Harm"},
  {a1:7,a2:11,rate:90,note:"羊猪——上上等婚配 / Goat+Pig — Excellent"},
  {a1:7,a2:3,rate:85,note:"羊兔——上等婚配 / Goat+Rabbit — Great"},
  {a1:7,a2:1,rate:35,note:"牛羊——相冲 / Goat+Ox — Clash"},
  {a1:7,a2:0,rate:30,note:"羊鼠——相害 / Goat+Rat — Harm"},
  {a1:8,a2:0,rate:90,note:"猴鼠——上上等婚配 / Monkey+Rat — Excellent"},
  {a1:8,a2:4,rate:85,note:"猴龙——上等婚配 / Monkey+Dragon — Great"},
  {a1:8,a2:2,rate:35,note:"猴虎——相冲 / Monkey+Tiger — Clash"},
  {a1:8,a2:11,rate:30,note:"猴猪——相害 / Monkey+Pig — Harm"},
  {a1:9,a2:1,rate:90,note:"鸡牛——上上等婚配 / Rooster+Ox — Excellent"},
  {a1:9,a2:5,rate:85,note:"鸡蛇——上等婚配 / Rooster+Snake — Great"},
  {a1:9,a2:3,rate:35,note:"鸡兔——相冲 / Rooster+Rabbit — Clash"},
  {a1:9,a2:10,rate:30,note:"鸡狗——相害 / Rooster+Dog — Harm"},
  {a1:10,a2:2,rate:90,note:"狗虎——上上等婚配 / Dog+Tiger — Excellent"},
  {a1:10,a2:6,rate:85,note:"狗马——上等婚配 / Dog+Horse — Great"},
  {a1:10,a2:4,rate:35,note:"狗龙——相冲 / Dog+Dragon — Clash"},
  {a1:10,a2:9,rate:30,note:"狗鸡——相害 / Dog+Rooster — Harm"},
  {a1:11,a2:3,rate:90,note:"猪兔——上上等婚配 / Pig+Rabbit — Excellent"},
  {a1:11,a2:7,rate:85,note:"猪羊——上等婚配 / Pig+Goat — Great"},
  {a1:11,a2:5,rate:35,note:"猪蛇——相冲 / Pig+Snake — Clash"},
  {a1:11,a2:8,rate:30,note:"猪猴——相害 / Pig+Monkey — Harm"}
];
function zodiacCompat(i1,i2){
  for(var p=0;p<ZC_PAIRS.length;p++){
    var c=ZC_PAIRS[p];
    if((c.a1===i1&&c.a2===i2)||(c.a1===i2&&c.a2===i1))return c;
  }
  // Default fallback
  var diff=Math.abs(i1-i2);diff=diff>6?12-diff:diff;
  var rate=[0,60,30,50,20,35,10][diff]||50;
  return{rate:rate,note:""+ZC[i1]+"与"+ZC[i2]+"——普通 / "+ZE[i1]+"+"+ZE[i2]+" — Fair"};
}

/* ── BIRTHDAY STORAGE (with cache) ── */
var BK="lunarcal_bdays";
var _bdaysCache=null;
function loadBirthdays(){
  if(_bdaysCache)return _bdaysCache;
  try{
    _bdaysCache=JSON.parse(localStorage.getItem(BK)||"{}");
    return _bdaysCache;
  }catch(e){return{};}
}
function saveBirthdays(o){
  _bdaysCache=o;
  try{localStorage.setItem(BK,JSON.stringify(o));}
  catch(e){
    if((e.name==="QuotaExceededError"||e.code===22)&&typeof showToast==="function"){
      showToast("⚠️ Storage full. Delete some birthdays to free space.");
    }
  }
}
function addBirthday(label,lunarDate){
  if(!label||!lunarDate)return;
  var bdays=loadBirthdays();
  var key=lunarDate.year+"-"+lunarDate.month+"-"+lunarDate.day+"-"+(lunarDate.isLeap?"1":"0");
  bdays[key]={label:label.slice(0,30),y:lunarDate.year,mo:lunarDate.month,d:lunarDate.day,l:lunarDate.isLeap};
  saveBirthdays(bdays);
}
function delBirthday(key){
  var bdays=loadBirthdays();delete bdays[key];saveBirthdays(bdays);
}
function getBirthdaysForDate(y,m,d){
  var dt=new Date(y,m,d),l=s2l(dt);
  if(!l)return[];
  // Check if this lunar month/day matches any saved birthday
  var bdays=loadBirthdays(),found=[];
  for(var key in bdays){
    var b=bdays[key];
    if(b.mo===l.month&&b.d===l.day&&b.l===l.isLeap)found.push(b);
  }
  return found;
}
function getUpcomingBirthdays(limit){
  limit=limit||3;
  var now=donly(new Date()),bdays=loadBirthdays(),upcoming=[];
  for(var key in bdays){
    var b=bdays[key];
    // Try current year, then next year
    for(var dy=0;dy<=1;dy++){
      var targetY=now.getFullYear()+dy;
      var dt=l2s(targetY,b.mo,b.d,b.l);
      if(dt){
        var dtDay=donly(dt);
        if(dtDay>=now){
          var diff=Math.ceil((dtDay-now)/86400000);
          if(diff<=365)upcoming.push({label:b.label,dt:dt,diff:diff});
          break;
        }
      }
    }
  }
  upcoming.sort(function(a,b){return a.diff-b.diff;});
  return upcoming.slice(0,limit);
}

/* ── BACKUP / RESTORE ── */
function exportBackup(){
  try{
    var notes=loadNotes(),bdays=loadBirthdays();
    var data={version:1,exportedAt:new Date().toISOString(),notes:notes,birthdays:bdays};
    var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"});
    var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="lunarcal_backup_"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showToast("💾 Backup exported!");
  }catch(e){
    showToast("⚠️ Export failed: "+e.message);
  }
}
function importBackup(file){
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var data=JSON.parse(e.target.result);
      if(!data||!data.version)throw new Error("Invalid format");
      if(data.notes&&typeof data.notes==="object"){
        // Validate notes structure
        for(var k in data.notes){
          if(!Array.isArray(data.notes[k])){delete data.notes[k];continue;}
          data.notes[k]=data.notes[k].filter(function(n){return n&&typeof n.id==="number"&&typeof n.text==="string";});
        }
        _notesCache=data.notes;
        localStorage.setItem(SK,JSON.stringify(data.notes));
      }
      if(data.birthdays&&typeof data.birthdays==="object"){
        _bdaysCache=data.birthdays;
        localStorage.setItem(BK,JSON.stringify(data.birthdays));
      }
      showToast("✅ Data imported! Refreshing...");
      renderCal();
    }catch(err){
      showToast("⚠️ Invalid backup file: "+err.message);
    }
  };
  reader.readAsText(file);
}



