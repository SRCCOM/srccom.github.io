
<script>
(function(){
  var $=function(id){return document.getElementById(id)};
  function days(a,b){return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000)}
  function br(a,b){
    var y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth(),d=b.getDate()-a.getDate();
    if(d<0){m--;d+=new Date(b.getFullYear(),b.getMonth(),0).getDate()}
    if(m<0){y--;m+=12}
    return {y:y,m:m,d:d};
  }
  function f(o){return o.y+" سنة، "+o.m+" شهر، "+o.d+" يوم"}
  function am(o,n){var t=o.y*12+o.m+n;return {y:Math.floor(t/12),m:t%12,d:o.d}}
  function ps(s){return s?new Date(s+"T00:00:00"):null}

  function addMonths(dt,n){
    var t=new Date(dt.getFullYear(),dt.getMonth()+n,1);
    var last=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();
    t.setDate(Math.min(dt.getDate(),last));
    return t;
  }
  function fd(dt){
    var m=dt.getMonth()+1,d=dt.getDate();
    return dt.getFullYear()+"/"+(m<10?"0"+m:m)+"/"+(d<10?"0"+d:d);
  }
  function baseYears(g){return g>=6?4:5}

  function calc(){
    var d1=ps($("d1").value),d2=ps($("d2").value),d3=ps($("d3").value);
    var grade=parseInt($("grade").value),stage=parseInt($("stage").value);
    var e="";
    if(!d1||!d2||!d3)e="أملىء جميع الحقول.";
    else if(d1>d2)e="تاريخ آخر عنوان يجب أن يكون قبل أو في تاريخ احتساب الشهادة.";
    else if(!grade||!stage)e="يرجى اختيار الدرجة والمرحلة.";
    $("err").textContent=e;
    if(e){
      $("resultsCard").classList.add("hidden");
      $("rmod").textContent=$("rmah").textContent=$("rgrand").textContent=$("rnext").textContent=$("rfinal").textContent="—";
      $("rmodd").textContent=$("rmahd").textContent=$("rgrandd").textContent=$("rnextd").textContent=$("rfinald").textContent="";
      return;
    }
    var early = d3 < d2;
    var ma = early ? {y:0,m:0,d:0} : br(d2,d3);
    var md = days(d1,d2);
    var hd = early ? 0 : days(d2,d3);
    var tm=Math.max(0,parseInt($("tm").value)||0);
    function dc(o){
      var t=new Date(d1.getFullYear(),d1.getMonth()+o.y*12+o.m,1);
      t.setDate(Math.min(d1.getDate(),new Date(t.getFullYear(),t.getMonth()+1,0).getDate()));
      t.setDate(t.getDate()+o.d);
      return days(d1,t);
    }
    var om=am(br(d1,d2),tm);
    var og = early ? om : am(br(d1,d3),tm);
    var modAll=dc(om);
    var grand=dc(og);
    $("rmod").textContent=f(om);
    $("rmodd").textContent="عدد الأيام: "+modAll;
    $("rmah").textContent=f(ma);
    $("rmahd").textContent="عدد الأيام: "+hd;
    $("rgrand").textContent=f(og);
    $("rgrandd").textContent="عدد الأيام: "+grand;

    $("extra").classList.add("hidden");
    
    function firstInc(base,m,d){
      var t=addMonths(base,12-m);
      t.setDate(t.getDate()-d);
      return t;
    }
    function show(k,t,v,d){$("ex"+k+"t").textContent=t;$("ex"+k+"v").textContent=v;$("ex"+k+"d").textContent=d}
    if(grade===1){
      
      $("rnext").textContent="لا توجد ترقية أعلى";
      $("rnextd").textContent="";
      $("rfinal").textContent="—";
      $("rfinald").textContent="";
      var ns=Math.min(11,stage+og.y);
      show(1," عدد العلاوات المتراكمة",og.y+" علاوة","المرحلة الجديدة: "+ns+(stage+og.y>11?"":""));
      show(2,"موعد العلاوة القادمة",fd(firstInc(d3,og.m,og.d)),"");
      $("extra").classList.remove("hidden");
    }else{
      var yrs=Math.max(0,baseYears(grade)-(stage-1));
      var next=addMonths(d3,yrs*12);
      $("rnext").textContent=fd(next);
    
      var fin=addMonths(next,-(og.y*12+og.m));
      fin.setDate(fin.getDate()-og.d);
      $("rfinal").textContent=fd(fin);
    }
    $("resultsCard").classList.remove("hidden");
  }
  function fillStages(){
    var g=parseInt($("grade").value),st=$("stage"),cur=st.value;
    var max=!g?0:(g>=6?5:(g===1?11:6));
    st.innerHTML='<option value="">اختر</option>';
    for(var i=1;i<=max;i++){var o=document.createElement("option");o.value=i;o.textContent=i;st.appendChild(o)}
    if(cur&&parseInt(cur)<=max)st.value=cur;
  }
  $("grade").addEventListener("change",fillStages);
  fillStages();
  $("calcBtn").addEventListener("click",calc);

  $("printBtn").addEventListener("click", function(){
    window.print();
  });
})();
</script>