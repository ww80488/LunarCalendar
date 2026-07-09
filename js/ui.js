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
  var almHtml=alm?'<div class="alm-box crc-alm" data-alm-toggle><div class="crc-alm-hdr">📜 Almanac 皇历 <span class="collapse-arrow">▾</span></div>'
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
function resetConvResult(msg){
  LBD=null;LUNAR_BDAY=null;
  document.getElementById("bdayFinder").style.display="none";
  document.getElementById("convResult").innerHTML=msg;
}
function convertG(){
  var y=+SEL.gYear.value,m=+SEL.gMonth.value,d=+SEL.gDay.value;
  var dt=new Date(y,m-1,d);
  if(dt.getFullYear()!==y||dt.getMonth()!==m-1||dt.getDate()!==d){
    resetConvResult("<div class='err-box'>⚠️ Invalid Gregorian date / 无效公历日期.</div>");
    return;
  }
  var l=s2l(dt);
  if(!l){resetConvResult("<div class='err-box'>⚠️ Date is outside the supported calendar range (1900-2100).</div>");return;}
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
  if(lp&&llm(y)!==m){resetConvResult("<div class='err-box'>⚠️ "+y+"年没有闰"+CM[m-1]+"月 / Year "+y+" has no leap "+CME[m-1]+".</div>");return;}
  var dt=l2s(y,m,d,lp);
  if(!dt){resetConvResult("<div class='err-box'>⚠️ 无效农历日期 / Invalid lunar date.</div>");return;}
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
    var tbl=document.getElementById("calBody").closest("table");
    if(tbl)tbl.style.display="";
    document.getElementById("multiMonthView").style.display="none";
    _renderCalNow();
  });
}
function _renderCalNow(){
  var y=VD.getFullYear(),m=VD.getMonth(),mid=s2l(new Date(y,m,15));
  var showAuspicious=document.getElementById("auspiciousDots")?document.getElementById("auspiciousDots").checked:false;
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
      html+="<td class='"+cls+"' data-y='"+y+"' data-m='"+m+"' data-d='"+d+"' tabindex='0' role='button' aria-label='"+MEN[m]+" "+d+", "+y+"'>"
        +"<span class='g-day'>"+d+"</span></td>";
      cell++;
      if(cell%8===0){html+="</tr><tr><td class='wn'></td>";cell++;}
      continue;
    }
    var fs=fests(l),lb=cellLabel(l);
    var moon=moonOf(y,m,d),hn=hasNote(y,m,d),it=dt.toDateString()===today.toDateString();
    var st=getSolarTerm(y,m+1,d);
    var bdays=getBirthdaysForDate(y,m,d);
    var dots="";
    if(fs.some(function(f){return f.t==="trad";}))dots+="<span class='dot trad'></span>";
    if(fs.some(function(f){return f.t==="tao";}))dots+="<span class='dot tao'></span>";
    if(hn)dots+="<span class='dot entry'></span>";
    if(bdays.length)dots+="<span class='dot bday'></span>";
    // Auspiciousness dot
    var alm=auspiciousDay(y,m,d),auspCls="";
    if(showAuspicious){
      var su=alm.suit.length,av=alm.avoid.length;
      if(su>av*2)auspCls=" auspicious";
      else if(av>su*2)auspCls=" inauspicious";
      else auspCls=" mixed";
    }
    var cls=it?"today"+(hn?" has-entry":""):hn?"has-entry":fs.length?"fest":moon==="new"?"newmoon":moon==="full"?"fullmoon":"";
    cls+=auspCls;
    // Sticky notes mode: show previews on cells
    var pv="";
    if(stickyNotesOn&&hn){
      var ns=getNotes(y,m,d);
      if(ns.length){
        pv="<div class='sticky-preview'><span class='sticky-dot' style='background:"+(ns[0].color||"#16a085")+"'></span>"+esc(ns[0].text.slice(0,20))+"</div>";
      }
    }else if(hn){
      var ns=getNotes(y,m,d);
      if(ns.length)pv="<span class='entry-preview'>"+esc(ns[0].text)+"</span>";
    }
    // Birthday indicator
    if(bdays.length)pv="<span class='bday-indicator'>🎂"+esc(bdays[0].label.slice(0,8))+"</span>"+pv;
    var mi=moon==="new"||moon==="full"?detailedMoonPhase(dt).ico:"";
    var vb=isVegDay(l)?"<span class='veg-badge'>🥬</span>":"";
    var stLbl=st?'<span class="st-badge">'+st.cn+'</span>':'';
    var a11yLabel=MEN[m]+" "+d+", "+y+" — "+lb.t+" "+(fs.length?fs.map(function(f){return f.cn;}).join(" "):"");
    // Popover on tap, detail on click
    html+="<td class='"+cls+"' data-y='"+y+"' data-m='"+m+"' data-d='"+d+"' tabindex='0' role='button' aria-label='"+esc(a11yLabel)+"'>"
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

  // Upcoming birthdays
  var upBdays=getUpcomingBirthdays(3);
  var eventsHtml="",found=0;
  if(upBdays.length){
    eventsHtml+='<div style="margin-top:4px;padding-top:4px;border-top:1px solid var(--md-outline-variant)">';
    upBdays.forEach(function(b){
      var lbl=b.diff===0?"Today":b.diff===1?"Tomorrow":b.diff+"d";
      eventsHtml+='<span class="tc-badge tc-bday" data-jump-y="'+b.dt.getFullYear()+'" data-jump-m="'+b.dt.getMonth()+'" data-jump-d="'+b.dt.getDate()+'">🎂 '+lbl+' · '+esc(b.label)+'</span>';
    });
    eventsHtml+='</div>';
  }
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
      eventsHtml+="<span class='tc-badge' data-jump-y='"+cdt.getFullYear()+"' data-jump-m='"+cdt.getMonth()+"' data-jump-d='"+cdt.getDate()+"'><span class='tc-num'>"+lbl+"</span> "+cfs[0].cn+"</span>";
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
      eventsHtml+='<span class="tc-badge" data-jump-y="'+nextFest.dt.getFullYear()+'" data-jump-m="'+nextFest.dt.getMonth()+'" data-jump-d="'+nextFest.dt.getDate()+'">⏳ '+flbl+' · '+esc(nextFest.fest.cn)+'</span>';
    }
    if(nextST){
      eventsHtml+='<span class="tc-badge" data-jump-y="'+nextST.dt.getFullYear()+'" data-jump-m="'+nextST.dt.getMonth()+'" data-jump-d="'+nextST.dt.getDate()+'">🌿 '+nextST.days+"d · "+esc(nextST.term.cn)+'</span>';
    }
    eventsHtml+='</div>';
  }

  document.getElementById("todayEvents").innerHTML=eventsHtml||"<span class='tc-badge' style='opacity:.6'>No upcoming events</span>";
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
      html+="<div class='me-item' data-jump-y='"+y+"' data-jump-m='"+m+"' data-jump-d='"+d+"'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>"+fs.map(function(f){return f.cn;}).join("、")+"<small>"+fs.map(function(f){return f.en;}).join(", ")+"</small></span>"
        +rowHtml+"</div>";
    }else if(st){
      html+="<div class='me-item' data-jump-y='"+y+"' data-jump-m='"+m+"' data-jump-d='"+d+"'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>🌿 "+st.cn+"<small>"+st.en+"</small></span>"
        +"<span class='me-badge me-st'>Solar Term</span></div>";
    }else if(mV==="new"||mV==="full"){
      var mp=detailedMoonPhase(dt);
      html+="<div class='me-item' data-jump-y='"+y+"' data-jump-m='"+m+"' data-jump-d='"+d+"'>"
        +"<span class='me-day'>"+d+"</span>"
        +"<span class='me-label'>"+mp.ico+" "+mp.cn+"<small>"+mp.en+"</small></span>"
        +"<span class='me-badge me-moon'>"+(mV==="new"?"New Moon":"Full Moon")+"</span></div>";
    }else if(vb){
      html+="<div class='me-item' data-jump-y='"+y+"' data-jump-m='"+m+"' data-jump-d='"+d+"'>"
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

  // Festivals with detail blurbs
  if(fs.length){
    html+="<div class='line' style='margin-top:8px'>";
    fs.forEach(function(f){
      var cls=f.t==="trad"?"tag trad":"tag tao";
      html+="<span class='"+cls+"'>"+esc(f.cn)+"<small>"+esc(f.en)+"</small></span> ";
    });
    html+="</div>";
    // Show blurb for first festival if available
    var fkey=l.month+"-"+l.day;
    for(var fi=0;fi<fs.length;fi++){
      var blurbKey=fkey+"-"+fi;
      if(FD[blurbKey]){
        html+="<div class='fest-blurb' data-blurb-key='"+blurbKey+"'>📖 <span class='blurb-text'>"+esc(FD[blurbKey])+"</span>"
          +" <button class='blurb-toggle' data-blurb-key='"+blurbKey+"'>Show less</button></div>";
        break;
      }
    }
  }

  // Almanac
  html+="<div class='alm-box'><strong>📜 Almanac 皇历</strong><br>"
    +"<span style='color:var(--green)'>✅ "+esc(alm.suit.join(", "))+"</span><br>"
    +"<span style='color:var(--md-error)'>❌ "+esc(alm.avoid.join(", "))+"</span><br>"
    +"<span class='ens'>"+alm.suit.map(function(a){return ACT_EN[a];}).join(", ")+"</span>"
    +"<div style='margin-top:6px;font-size:11px;color:var(--text4);border-top:1px solid var(--md-outline-variant);padding-top:4px'>⚠️ Simplified reference only. Consult a professional almanac (通书) for important decisions.</div></div>";

  // Notes section with edit and color support
  html+="<div class='entry-section' data-detail-y='"+y+"' data-detail-m='"+m+"' data-detail-d='"+d+"'><h4>📝 My Notes / 我的备注"
    +"<span class='entry-actions'><button class='detail-add-note' data-y='"+y+"' data-m='"+m+"' data-d='"+d+"'>➕ Add</button></span></h4>";
  if(ns.length){
    ns.forEach(function(n){
      var dotColor=n.color||NOTE_COLORS[0];
      html+="<div class='entry-item'><span class='entry-dot' style='background:"+dotColor+"'></span>"
        +"<span class='entry-text'>"+esc(n.text)+"</span>"
        +"<button class='entry-edit' data-y='"+y+"' data-m='"+m+"' data-d='"+d+"' data-id='"+n.id+"' title='Edit note'>✎</button>"
        +"<button class='entry-del' data-y='"+y+"' data-m='"+m+"' data-d='"+d+"' data-id='"+n.id+"' title='Delete note'>✕</button></div>";
    });
  }else{
    html+="<div class='no-entry'>No notes yet. Tap Add to create one.</div>";
  }
  html+="</div>";

  // Actions
  html+="<div class='detail-actions'>"
    +"<button class='share-btn' data-share-y='"+y+"' data-share-m='"+m+"' data-share-d='"+d+"'>📤 Share</button>"
    +"<button class='copy-btn'>📋 Copy</button>"
    +"<button class='detail-close-btn' data-focus='detail'>✕ Close</button></div>";

  el.innerHTML=html;
  el.classList.add("show");
  // Restore lastFocus via dataset
  if(lastFocus){
    el.dataset.lastFocusId=lastFocus.id||"";
    // Also store the outerHTML of the element with a unique selector
    if(lastFocus.tagName){
      var selector=lastFocus.tagName.toLowerCase();
      if(lastFocus.id)selector="#"+lastFocus.id;
      else if(lastFocus.name)selector+='[name="'+lastFocus.name+'"]';
      else if(lastFocus.className&&typeof lastFocus.className==="string"){
        var cls=lastFocus.className.trim().split(/\s+/)[0];
        if(cls)selector+="."+cls;
      }
      el.dataset.lastFocusSelector=selector;
    }
  }
}

function addNoteEntry(y,m,d){
  // Create inline input in the detail panel instead of prompt()
  var detail=document.getElementById("detail");
  var entrySection=detail&&detail.querySelector(".entry-section");
  if(!entrySection)return;
  // Remove any existing inline editors
  var existingRow=entrySection.querySelector(".entry-add-row");
  if(existingRow)existingRow.remove();
  var row=document.createElement("div");
  row.className="entry-add-row";
  var colorOptions='<div class="entry-color-row">';
  for(var ci=0;ci<NOTE_COLORS.length;ci++){
    var sel=ci===0?" checked":"";
    colorOptions+='<label class="entry-color-lbl"><input type="radio" name="entryColor" value="'+NOTE_COLORS[ci]+'"'+sel+' style="accent-color:'+NOTE_COLORS[ci]+'"> <span style="background:'+NOTE_COLORS[ci]+';width:14px;height:14px;display:inline-block;border-radius:50%;vertical-align:middle"></span></label>';
  }
  colorOptions+='</div>';
  row.innerHTML="<textarea class='entry-input' placeholder='Enter note / 输入备注…' maxlength='500' rows='2'></textarea>"
    +colorOptions
    +"<button class='entry-save-btn'>Save</button>";
  entrySection.insertBefore(row,entrySection.querySelector(".no-entry,.entry-item"));
  var textarea=row.querySelector(".entry-input"),saveBtn=row.querySelector(".entry-save-btn");
  textarea.focus();
  function save(){
    var t=textarea.value.trim();
    if(t&&t.length){
      var colorInput=row.querySelector('input[name="entryColor"]:checked');
      var color=colorInput?colorInput.value:NOTE_COLORS[0];
      addNote(y,m,d,t.slice(0,500),color);
      jumpToDate(y,m,d);
      renderCal();
    }else{
      showToast("⚠️ Note cannot be empty");
    }
  }
  saveBtn.addEventListener("click",save);
  textarea.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();save();}});
  // Remove on Escape
  textarea.addEventListener("keydown",function(e){if(e.key==="Escape")row.remove();});
}

function editNoteEntry(y,m,d,id){
  var detail=document.getElementById("detail");
  var entrySection=detail&&detail.querySelector(".entry-section");
  if(!entrySection)return;
  var note=getNote(y,m,d,id);
  if(!note)return;
  // Remove existing inline editors
  var existingRow=entrySection.querySelector(".entry-add-row");
  if(existingRow)existingRow.remove();
  var row=document.createElement("div");
  row.className="entry-add-row";
  var colorOptions='<div class="entry-color-row">';
  for(var ci=0;ci<NOTE_COLORS.length;ci++){
    var sel=NOTE_COLORS[ci]===note.color?" checked":"";
    colorOptions+='<label class="entry-color-lbl"><input type="radio" name="editColor" value="'+NOTE_COLORS[ci]+'"'+sel+' style="accent-color:'+NOTE_COLORS[ci]+'"> <span style="background:'+NOTE_COLORS[ci]+';width:14px;height:14px;display:inline-block;border-radius:50%;vertical-align:middle"></span></label>';
  }
  colorOptions+='</div>';
  row.innerHTML="<textarea class='entry-input' placeholder='Edit note…' maxlength='500' rows='2'>"+esc(note.text)+"</textarea>"
    +colorOptions
    +"<button class='entry-save-btn'>💾 Update</button>"
    +"<button class='entry-cancel-btn'>✕ Cancel</button>";
  entrySection.insertBefore(row,entrySection.querySelector(".no-entry,.entry-item"));
  var textarea=row.querySelector(".entry-input"),saveBtn=row.querySelector(".entry-save-btn");
  var cancelBtn=row.querySelector(".entry-cancel-btn");
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length,textarea.value.length);
  function save(){
    var t=textarea.value.trim();
    if(t&&t.length){
      var colorInput=row.querySelector('input[name="editColor"]:checked');
      var color=colorInput?colorInput.value:note.color||NOTE_COLORS[0];
      updateNote(y,m,d,id,t.slice(0,500),color);
      jumpToDate(y,m,d);
      renderCal();
    }else{
      showToast("⚠️ Note cannot be empty");
    }
  }
  saveBtn.addEventListener("click",save);
  cancelBtn.addEventListener("click",function(){jumpToDate(y,m,d);});
  textarea.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();save();}});
  textarea.addEventListener("keydown",function(e){if(e.key==="Escape")jumpToDate(y,m,d);});
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
  var html="<div class='year-grid-wrap'><div class='year-grid-header'><div class='yg-title'>📆 "+y+"<small>Full Year · 全年</small></div><button class='btn-year-festivals' style='background:var(--purple);color:#fff;border:none;border-radius:var(--md-shape-sm);padding:6px 12px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:500'>🏮 Festivals</button></div>";
  html+="<div class='year-grid'>";
  var dow=["Su","Mo","Tu","We","Th","Fr","Sa"];
  for(var m=0;m<12;m++){
    var firstDOW=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
    var midDate=new Date(y,m,15),midL=s2l(midDate);
    var ganZhi=midL?gzy(midL.year):"";
    var today=new Date();
    html+="<div class='ymonth' data-jump-y='"+y+"' data-jump-m='"+m+"'><div class='ymonth-title'>"+MSH[m]+"</div><div class='ymonth-sub'>"+ganZhi+"</div><div class='ym-days'>";
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
  var html="<div class='yf-header'><h3>📆 "+y+" Year Overview<small>Festivals, Solar Terms &amp; Events</small></h3><button class='yf-close'>✕</button></div>";
  for(var m=0;m<12;m++){
    var days=new Date(y,m+1,0).getDate(),mh="<div class='yf-month'><div class='yf-month-title'>"+MEN[m]+"</div><div class='yf-items'>";
    for(var d=1;d<=days;d++){
      var dt=new Date(y,m,d),l=s2l(dt);
      if(!l)continue;
      var fs=fests(l),st=getSolarTerm(y,m+1,d);
      if(fs.length||st){
        fs.forEach(function(f){
          var cls=f.t==="trad"?"yf-trad":"yf-tao";
          mh+="<span class='yf-item "+cls+"' tabindex='0' role='button' data-yf-y='"+y+"' data-yf-m='"+m+"' data-yf-d='"+d+"'><span class='yf-day'>"+esc(d)+"</span>"+esc(f.cn)+"<small>"+esc(f.en)+"</small></span>";
        });
        if(st){
          mh+="<span class='yf-item yf-st' tabindex='0' role='button' data-yf-y='"+y+"' data-yf-m='"+m+"' data-yf-d='"+d+"'><span class='yf-day'>"+esc(d)+"</span>🌿 "+esc(st.cn)+"<small>"+esc(st.en)+"</small></span>";
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
function toggleBigText(){
  bigTextOn=!bigTextOn;
  document.body.classList.toggle("big-text",bigTextOn);
  localStorage.setItem("lunarcal_bigtext",bigTextOn?"1":"0");
  var btn=document.getElementById("bigTextBtn");
  if(btn)btn.setAttribute("aria-pressed",bigTextOn?"true":"false");
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
  var today=donly(new Date());
  var next=l2s(today.getFullYear(),l.month,l.day,l.isLeap);
  if(!next||donly(next)<today)next=l2s(today.getFullYear()+1,l.month,l.day,l.isLeap);
  var diff=next?Math.ceil((donly(next)-today)/86400000):"?";
  document.getElementById("bdayResult").innerHTML="🎂 <b>"+(l.isLeap?"闰":"")+l.year+"年 "+CM[l.month-1]+"月 "+CD[l.day-1]+"</b> · "+z.cn+" "+z.en
    +"<br>Next: "+(next?MEN[next.getMonth()]+" "+next.getDate()+", "+next.getFullYear()+" ("+diff+" days)":"N/A");
}

/* ── BIRTHDAY SAVE ── */
function saveCurrentBirthday(){
  if(!LUNAR_BDAY){showToast("⚠️ Convert a date first");return;}
  var name=document.getElementById("birthdayName");
  if(!name||!name.value.trim()){showToast("⚠️ Enter a name");return;}
  addBirthday(name.value.trim(),LUNAR_BDAY);
  showToast("🎂 Birthday saved!");
  renderCal();
}

/* ── POPOVER (Quick Date Preview) ── */
var popoverTimer=null;
function showPopover(el,y,m,d,evt){
  if(popoverTimer)clearTimeout(popoverTimer);
  var existing=document.getElementById("datePopover");
  if(existing)existing.remove();
  var dt=new Date(y,m,d),l=s2l(dt);
  if(!l)return;
  var fs=fests(l),z=zod(l.year),st=getSolarTerm(y,m+1,d);
  var mp=detailedMoonPhase(dt),alm=auspiciousDay(y,m,d);
  var bdays=getBirthdaysForDate(y,m,d);
  var html="<div class='popover-arrow'></div>"
    +"<div class='popover-lunar'><strong>"+(l.isLeap?"闰":"")+l.year+"年 "+CM[l.month-1]+"月 "+CD[l.day-1]+"</strong></div>"
    +"<div class='popover-zodiac'>"+z.cn+" "+z.en+" · "+gzy(l.year)+"</div>";
  if(bdays.length){
    bdays.forEach(function(b){html+="<div class='popover-bday'>🎂 "+esc(b.label)+"</div>";});
  }
  if(fs.length){
    html+="<div class='popover-fests'>";
    fs.forEach(function(f){html+="<span class='popover-tag popover-"+f.t+"'>"+esc(f.cn)+"</span>";});
    html+="</div>";
  }
  if(st)html+="<div class='popover-st'>🌿 "+esc(st.cn)+"</div>";
  html+="<div class='popover-moon'>"+mp.ico+" "+esc(mp.cn)+"</div>";
  html+="<div class='popover-alm'><span class='alm-s'>"+alm.suit.slice(0,4).join("/")+"</span><span class='alm-a'>"+alm.avoid.slice(0,4).join("/")+"</span></div>";
  var pop=document.createElement("div");pop.id="datePopover";pop.className="date-popover";pop.innerHTML=html;
  pop.addEventListener("click",function(){pop.remove();jumpToDate(y,m,d);});
  document.body.appendChild(pop);
  // Position near the cell
  var rect=el.getBoundingClientRect();
  var top=rect.bottom+4,left=rect.left+(rect.width/2)-80;
  if(left<4)left=4;
  if(left>window.innerWidth-164)left=window.innerWidth-164;
  pop.style.top=top+"px";pop.style.left=left+"px";
  pop.classList.add("show");
  // Auto-hide after 3s
  popoverTimer=setTimeout(function(){
    if(pop.parentNode){
      pop.remove();
      // Announce to screen readers that popover dismissed
      var ann=document.getElementById("popoverAnnounce");
      if(ann)ann.textContent="Popover closed";
    }
  },3000);
  // Announce popover to screen readers
  var ann=document.getElementById("popoverAnnounce");
  if(ann)ann.textContent="Quick preview shown for "+MEN[m]+" "+d+". Press Escape to close.";
}
// Click outside popover closes it
document.addEventListener("click",function(e){
  var pop=document.getElementById("datePopover");
  if(pop&&!pop.contains(e.target)&&!e.target.closest("td"))pop.remove();
});

/* ── STICKY NOTES MODE ── */
var stickyNotesOn=false;
function toggleStickyNotes(){
  stickyNotesOn=!stickyNotesOn;
  var btn=document.getElementById("stickyNoteBtn");
  if(btn)btn.style.background=stickyNotesOn?"var(--md-primary)":"var(--purple)";
  renderCal();
}

/* ── THEME PICKER ── */
var THEMES=["light","dark","sepia","forest","ocean","midnight"];
var THEME_ICONS=["☀️","🌓","📜","🌲","🌊","🌙"];
var THEME_LABELS=["Light","Dark","Sepia","Forest","Ocean","Midnight"];
function getTheme(){
  for(var i=0;i<THEMES.length;i++){
    if(document.body.classList.contains(THEMES[i]))return THEMES[i];
  }
  return "light";
}
function setTheme(t){
  document.body.classList.remove("dark","sepia","forest","ocean","midnight");
  if(t!=="light")document.body.classList.add(t);
  localStorage.setItem("lunarcal_theme",t);
  // Update theme-color meta
  var colors={"light":"#b03a2e","dark":"#201a19","sepia":"#8b6914","forest":"#1b5e20","ocean":"#006a7f","midnight":"#0d0d1a"};
  var mc=document.getElementById("themeColor");
  if(mc)mc.content=colors[t]||colors.light;
  // Sync dropdown
  var sel=document.getElementById("themeSelect");
  if(sel)sel.value=t;
}

/* ── DECADE JUMP SCROLLER ── */
var decadeScroller=null;
function toggleDecadeScroller(){
  if(decadeScroller){decadeScroller.remove();decadeScroller=null;return;}
  var overlay=document.createElement("div");
  overlay.className="decade-overlay";
  var currentY=VD.getFullYear();
  var startY=Math.floor(currentY/10)*10;
  var html="<div class='decade-panel'><div class='decade-header'>Jump to Year <span class='decade-close' data-decade-close>✕</span></div><div class='decade-grid'>";
  for(var y=1920;y<=2120;y+=1){
    var decade=Math.floor(y/10)*10;
    var inDecade=Math.abs(y-currentY)<=5;
    var cls="decade-year";
    if(y===currentY)cls+=" current";
    if(y%10===0)cls+=" decade-start";
    html+="<div class='"+cls+"' data-decade-year='"+y+"'>"+y+"</div>";
  }
  html+="</div><div class='decade-legend'>Decade: <span id='decadeLabel'>"+startY+"-"+(startY+9)+"</span></div></div>";
  overlay.innerHTML=html;
  document.body.appendChild(overlay);
  decadeScroller=overlay;
  // Scroll current year into view
  setTimeout(function(){
    var cur=overlay.querySelector(".decade-year.current");
    if(cur)cur.scrollIntoView({block:"center"});
  },50);
}
function jumpDecadeYear(y){
  if(decadeScroller){decadeScroller.remove();decadeScroller=null;}
  VD=new Date(y,VD.getMonth(),1);
  renderCal();
  var detail=document.getElementById("detail");
  if(detail)detail.classList.remove("show");
}

/* ── ZODIAC COMPATIBILITY ── */
function calcZodiacCompat(){
  var y1=+document.getElementById("zYear1").value;
  var y2=+document.getElementById("zYear2").value;
  var z1=zod(y1),z2=zod(y2);
  var i1=(y1-4)%12;if(i1<0)i1+=12;
  var i2=(y2-4)%12;if(i2<0)i2+=12;
  var compat=zodiacCompat(i1,i2);
  var html="<div class='zodiac-result'>";
  html+="<div class='zodiac-pair'><span class='zodiac-badge' style='background:"+z1.ex+"'>"+z1.cn+"<small>"+z1.en+"</small></span>";
  html+="<span class='zodiac-heart'>"+(compat.rate>=80?"💕":compat.rate>=60?"💗":compat.rate>=40?"💔":"💀")+"</span>";
  html+="<span class='zodiac-badge' style='background:"+z2.ex+"'>"+z2.cn+"<small>"+z2.en+"</small></span></div>";
  html+="<div class='zodiac-rate'><div class='zodiac-bar'><div style='width:"+compat.rate+"%'></div></div><span>"+compat.rate+"%</span></div>";
  html+="<div class='zodiac-note'>"+compat.note+"</div>";
  var elemMatch=z1.ee===z2.ee;
  if(elemMatch)html+="<div class='zodiac-elem'>⚡ Both are <b>"+z1.ee+" ("+z1.ec+")</b> element! <span style='color:var(--orange)'>Double strength!</span></div>";
  else html+="<div class='zodiac-elem'>Elements: "+z1.ee+" ("+z1.ec+") vs "+z2.ee+" ("+z2.ec+")</div>";
  html+="</div>";
  document.getElementById("zodiacResult").innerHTML=html;
}

/* ── TOAST ── */
/* ── EVENT DELEGATION: Almanac toggle in converter result ── */
document.addEventListener("click",function(e){
  var alm=e.target.closest("[data-alm-toggle]");
  if(alm)alm.classList.toggle("crc-alm-open");
});

/* ── EVENT DELEGATION: Calendar body handler ── */
document.addEventListener("DOMContentLoaded",function(){
  var calBody=document.getElementById("calBody");
  if(calBody){
    calBody.addEventListener("click",function(e){
      var td=e.target.closest("td");
      if(!td)return;
      var y=td.dataset.y,m=td.dataset.m,d=td.dataset.d;
      if(y===undefined||m===undefined||d===undefined)return;
      y=+y;m=+m;d=+d;
        if(e.detail === 0 || !td.querySelector(".c-day")){
          jumpToDate(y,m,d);
        }else{
          showPopover(td,y,m,d,e);
        }
      });
    }

  /* ── EVENT DELEGATION: Detail panel ── */
  var detail=document.getElementById("detail");
  if(detail){
    detail.addEventListener("click",function(e){
      var target=e.target;

      // Close button
      if(target.classList.contains("detail-close-btn")){
        detail.classList.remove("show");
        var focusId=detail.dataset.lastFocusId;
        var focusEl=null;
        if(focusId){
          focusEl=document.getElementById(focusId);
        }
        if(!focusEl){
          var sel=detail.dataset.lastFocusSelector;
          if(sel)try{focusEl=document.querySelector(sel);}catch(e){/* ignore */}
        }
        if(focusEl&&typeof focusEl.focus==="function")focusEl.focus();
        return;
      }

      // Copy button
      if(target.classList.contains("copy-btn")){
        copyDetail();
        return;
      }

      // Share button
      if(target.classList.contains("share-btn")){
        var y=+target.dataset.shareY,m=+target.dataset.shareM,d=+target.dataset.shareD;
        var label=MEN[m]+" "+d+", "+y;
        if(navigator.share){
          navigator.share({title:"Lunar Calendar",text:label}).catch(function(){});
        }else{
          showToast("⚠️ Share not supported in this browser");
        }
        return;
      }

      // Add note
      if(target.classList.contains("detail-add-note")){
        var y=+target.dataset.y,m=+target.dataset.m,d=+target.dataset.d;
        addNoteEntry(y,m,d);
        return;
      }

      // Delete note
      if(target.classList.contains("entry-del")){
        var y=+target.dataset.y,m=+target.dataset.m,d=+target.dataset.d,id=+target.dataset.id;
        delNote(y,m,d,id);
        jumpToDate(y,m,d);
        return;
      }

      // Edit note
      if(target.classList.contains("entry-edit")){
        var y=+target.dataset.y,m=+target.dataset.m,d=+target.dataset.d,id=+target.dataset.id;
        editNoteEntry(y,m,d,id);
        return;
      }

      // Blurb toggle
      if(target.classList.contains("blurb-toggle")){
        var key=target.dataset.blurbKey;
        var blurbEl=target.closest(".fest-blurb");
        if(blurbEl)blurbEl.classList.toggle("blurb-collapsed");
        target.textContent=blurbEl.classList.contains("blurb-collapsed")?"Show more":"Show less";
        return;
      }
    });
  }

  /* ── EVENT DELEGATION: Backup/restore/notify/export ── */
  document.addEventListener("click",function(e){
    if(e.target.closest("[data-backup-export]")){
      exportBackup();
      var menu=document.getElementById("overflowMenu");
      if(menu)menu.classList.remove("show");
      return;
    }
    if(e.target.closest("[data-backup-import]")){
      var input=document.getElementById("backupFileInput");
      if(input)input.click();
      var menu=document.getElementById("overflowMenu");
      if(menu)menu.classList.remove("show");
      return;
    }
    if(e.target.closest("[data-notif-btn]")){
      requestNotifPermission();
      return;
    }
    if(e.target.closest("[data-export-ics]")){
      exportICS();
      return;
    }
  });
  document.addEventListener("change",function(e){
    if(e.target.id==="backupFileInput"&&e.target.files.length){
      importBackup(e.target.files[0]);
      e.target.value="";
    }
  });

  /* ── EVENT DELEGATION: Month events / jump items ── */
  document.addEventListener("click",function(e){
    var jumpEl=e.target.closest("[data-jump-y]");
    if(!jumpEl)return;
    var y=+jumpEl.dataset.jumpY,m=+jumpEl.dataset.jumpM,d=jumpEl.dataset.jumpD;
    if(d!==undefined){
      // Has a day → jump to date
      jumpToDate(y,m,+d);
    }else{
      // No day → jump to month (ymonth grid)
      jumpToMonth(y,m);
    }
  });

  /* ── EVENT DELEGATION: Year festival panel close ── */
  document.addEventListener("click",function(e){
    if(e.target.closest(".yf-close")){
      document.getElementById("yearFestPanel").classList.remove("show");
    }
    var yf=e.target.closest("[data-yf-y]");
    if(yf){
      var y=+yf.dataset.yfY,m=+yf.dataset.yfM,d=+yf.dataset.yfD;
      document.getElementById("yearFestPanel").classList.remove("show");
      // If year view is open, close it
      if(yearViewOn)setTimeout(function(){toggleYearView();},50);
      jumpToDate(y,m,d);
    }
  });

  /* ── EVENT DELEGATION: Year festivals button in grid ── */
  document.addEventListener("click",function(e){
    if(e.target.closest(".btn-year-festivals")){
      showYearFestivals();
    }
  });

  /* ── EVENT DELEGATION: Decade scroller ── */
  document.addEventListener("click",function(e){
    var closeBtn=e.target.closest("[data-decade-close]");
    if(closeBtn){
      var overlay=closeBtn.closest(".decade-overlay");
      if(overlay){overlay.remove();decadeScroller=null;}
      return;
    }
    var yearEl=e.target.closest("[data-decade-year]");
    if(yearEl){
      var y=+yearEl.dataset.decadeYear;
      jumpDecadeYear(y);
    }
  });
});

function showToast(msg){
  var t=document.getElementById("toast");
  if(!t)return;
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(t._hide);
  t._hide=setTimeout(function(){t.classList.remove("show");},2500);
}
