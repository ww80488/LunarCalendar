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
  if(savedTheme&&["dark","sepia","forest","ocean","midnight"].indexOf(savedTheme)>=0){
    setTheme(savedTheme);
  }else if(savedTheme==="dark"){
    setTheme("dark");
  }else{
    setTheme("light");
  }
  var savedBt=localStorage.getItem("lunarcal_bigtext");
  if(savedBt==="1"){bigTextOn=true;document.body.classList.add("big-text");
    var btBtn=document.getElementById("bigTextBtn");
    if(btBtn)btBtn.setAttribute("aria-pressed","true");
  }

  // Wire install button
  var ib=document.getElementById("installBtn");
  if(ib)ib.addEventListener("click",installPWA);

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

  // Cal title click → decade scroller
  var ct=document.getElementById("calTitle");
  if(ct)ct.addEventListener("click",function(e){
    if(e.target.closest("button"))return;
    toggleDecadeScroller();
  });

  // Populate zodiac compatibility year selectors
  var zy1=document.getElementById("zYear1"),zy2=document.getElementById("zYear2");
  if(zy1&&zy2){
    for(var zy=1920;zy<=2100;zy++){
      zy1.innerHTML+="<option value='"+zy+"'>"+zy+"</option>";
      zy2.innerHTML+="<option value='"+zy+"'>"+zy+"</option>";
    }
    zy1.value=now.getFullYear()-12;
    zy2.value=now.getFullYear();
    zy1.addEventListener("change",calcZodiacCompat);
    zy2.addEventListener("change",calcZodiacCompat);
  }

  // Auspicious dots toggle
  var auspEl=document.getElementById("auspiciousDots");
  if(auspEl)auspEl.addEventListener("change",renderCal);

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
