/* ==========================================================
   التسارع الوظيفي
   - الدرجة السابعة تكون عند تاريخ أول ترفيع بعد الاحتساب (البداية)
   - كل سنتين تنزل درجة واحدة (تسريع) حتى الدرجة قبل الاحتساب
   - عدد التسريعات الكلي = START_GRADE - الدرجة قبل الاحتساب
   ========================================================== */

// الدرجة عند تاريخ البداية (تُعدَّل من هنا إن تغيّر القانون)
var START_GRADE = 7;

// المدة بين كل تسريع وآخر (بالسنوات)
var STEP_YEARS = 2;


/* ---------- دوال مساعدة ---------- */

function pad(x) {
  return String(x).padStart(2, '0');
}

// تنسيق التاريخ: yyyy/mm/dd
function formatDate(d) {
  return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
}

// إضافة سنوات إلى تاريخ
function addYears(d, years) {
  return new Date(d.getFullYear() + years, d.getMonth(), d.getDate());
}

// تاريخ اليوم بدون وقت
function getToday() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// تحويل قيمة حقل date (yyyy-mm-dd) إلى Date
function parseInputDate(value) {
  var p = value.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}


/* ---------- الحساب ---------- */

// يرجع قائمة التسريعات: { n, grade, date }
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


/* ---------- العرض ---------- */

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
    ? 'التالي: ' + formatDate(upcoming[0].date) +
      ' — الأخير: ' + formatDate(upcoming[upcoming.length - 1].date)
    : 'انتهى التسريع';

  document.getElementById('today').textContent =
    'التاريخ الحالي: ' + formatDate(today);
}


/* ---------- الحدث الرئيسي ---------- */

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
