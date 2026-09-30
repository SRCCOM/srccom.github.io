const $=id=>document.getElementById(id);
const f=n=>Math.round(n).toLocaleString('en-US')+' د.ع';
const res=(t,v,d,main)=>`<div class="res${main?' main':''}"><div class="rt">${t}</div><div class="rv n">${v}</div>${d?`<div class="rd">${d}</div>`:''}</div>`;

$('print').addEventListener('click',()=>window.print());
$('go').addEventListener('click',()=>{
  const avg=+$('avg').value||0,last=+$('last').value||0,allow=+$('allow').value||0;
  const y=+$('yrs').value||0,m=+$('mon').value||0,cr=+$('cert').value/100,cs=$('cs').value;
  const dep=+$('dep').value||0,heirs=+$('heirs').value||0;
  const years=y+(m>=6?1:0),card=$('resultsCard');
  if(years<=0||(years>=15&&!avg)||(years<15&&!last)){
    $('err').textContent='أدخل سنوات الخدمة والراتب المطلوب لحالتك.';card.classList.add('hidden');return;
  }
  $('err').textContent='';
  let h=res('سنوات الخدمة المحتسبة',years+' سنة','6 أشهر فأكثر تُحتسب سنة كاملة'),pension=0,bonus=0,notes=[];
  if(years<15){
    bonus=last*2*years;
    h+=res('مكافأة تقاعدية',f(bonus),'آخر راتب × 2 × السنوات',true);
    notes.push('الخدمة أقل من 15 سنة: تستحق مكافأة تقاعدية بدل الراتب الشهري.');
  }else{
    const pct=Math.min(2.5*years,100),basic=avg*pct/100,cola=basic*years/100,cert=basic*cr;
    let total=basic+cola+cert;
    const special=cs!=='n'||dep>=2,floor=special?460000:500000;
    h+=res('الراتب التقاعدي الأساسي',f(basic),'نسبة '+pct+'% من المعدل');
    h+=res('غلاء المعيشة',f(cola),'1% × السنوات من الأساسي');
    h+=res('مخصص الشهادة',f(cert),(cr*100)+'% من الأساسي');
    if(total<floor){h+=res('رفع إلى الحد الأدنى',f(floor-total),'الحد الأدنى '+f(floor));total=floor}
    if(total<=1000000){h+=res('زيادة مقطوعة',f(100000),'المجموع لا يتجاوز مليون دينار');total+=100000}
    else notes.push('غير مشمول بالزيادة المقطوعة.');
    pension=total;
    h+=res('الراتب التقاعدي الشهري',f(pension),'',true);
    if(special)notes.push('تم تطبيق قانون التقاعد الموحد وفقراته المعدلة.');
    if(years>=25){
      bonus=(last+allow)*12;
      h+=res('مكافأة نهاية الخدمة',f(bonus),'');
      if(!last)notes.push('أدخل آخر راتب اسمي لاحتساب المكافأة.');
    }else notes.push('مكافأة نهاية الخدمة تبدأ عند 25 سنة خدمة.');
  }
  if(heirs>0){
    if(pension)h+=res('حصة كل مستحق شهرياً',f(pension/heirs),'توزيع متساوٍ تقريبي على '+heirs);
    if(bonus)h+=res('حصة كل مستحق من المكافأة',f(bonus/heirs),'توزيع متساوٍ تقريبي');
    notes.push('التوزيع الفعلي بين الزوج أو الزوجة والأولاد والوالدين يتم بحصص يحددها القانون وتحسبها الهيئة.');
  }
  $('resRow').innerHTML=h;$('notes').innerHTML=notes.join('<br>');
  card.classList.remove('hidden');card.scrollIntoView({behavior:'smooth',block:'start'});
});


    const clock = document.getElementById('clock');
    const fmt = new Intl.DateTimeFormat('ar-u-ca-gregory', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    function tick() { clock.textContent = fmt.format(new Date()); }
    tick();
    setInterval(tick, 1000);
