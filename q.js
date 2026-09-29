

var START_GRADE = 7;



var STEP_YEARS = 2;




function pad(x) {
  return String(x).padStart(2, '0');
}





function formatDate(d) {
  return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
}







function addYears(d, years) {
  return new Date(d.getFullYear() + years, d.getMonth(), d.getDate());
}






function getToday() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}





function parseInputDate(value) {
  var p = value.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}







function buildAccelerations(startDate, lastGrade) {
  var list = [];
  var k = 1;




  for (var g = START_GRADE - 1; g >= lastGrade; g--, k++) {
    list.push({
      n: k,
      grade: g,
      date: addYears(startDate, STEP_YEARS * k)
    });
  }
  return list;
}





function renderRows(list, startDate, today) {
  var startRow =
    '<tr class="n">' +
      '<td>—</td>' +
      '<td>' + START_GRADE + '</td>' +
      '<td>' + formatDate(startDate) + '</td>' +
      '<td><span class="tag start">البداية</span></td>' +
    '</tr>';





  var rows = list.map(function (x) {
    var isDue = x.date <= today;
    return (
      '<tr class="n">' +
        '<td>' + x.n + '</td>' +
        '<td>' + x.grade + '</td>' +
        '<td>' + formatDate(x.date) + '</td>' +
        '<td><span class="tag ' + (isDue ? 'd' : 'u') + '">' +
          (isDue ? 'مستحق' : 'قادم') +
        '</span></td>' +
      '</tr>'
    );
  }).join('');


  document.getElementById('rows').innerHTML = startRow + rows;
}




function renderSummary(due, upcoming, today) {
  document.getElementById('vDue').textContent  = due.length;
  document.getElementById('vNext').textContent = upcoming.length;

  document.getElementById('dDue').textContent = due.length
    ? 'آخر استحقاق: ' + formatDate(due[due.length - 1].date)
    : 'لا يوجد';

  document.getElementById('dNext').textContent = upcoming.length
    ? ' الترفيع القادم : ' + formatDate(upcoming[0].date) +
      ' - آخر ترفيع :      ' + formatDate(upcoming[upcoming.length - 1].date)
    : 'تسريعك مكتمل';

  document.getElementById('today').textContent =
    'اليوم: ' + formatDate(today);
}






document.getElementById('go').addEventListener('click', function () {
  var err = document.getElementById('err');
  err.textContent = '';



  var value = document.getElementById('d0').value;
  if (!value) {
    err.textContent = 'الرجاء إدخال التاريخ';
    return;
  }

  var startDate = parseInputDate(value);
  var lastGrade = +document.getElementById('g0').value;
  var today     = getToday();



  var list     = buildAccelerations(startDate, lastGrade);
  var due      = list.filter(function (x) { return x.date <= today; });
  var upcoming = list.filter(function (x) { return x.date >  today; });




  renderSummary(due, upcoming, today);
  renderRows(list, startDate, today);



  var card = document.getElementById('resultsCard');
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth' });
});
