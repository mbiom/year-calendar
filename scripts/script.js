var firstSelectedDate;
var selectedYears = [ new Date().getFullYear() ];

function fillWorkweekSetting() {
  var strTableHtml  = "<TR>";
  for (var i = 0; i < weekdays.length ; i++) 
    strTableHtml += "<TD>" + weekdays[i] + "</TD>";
  strTableHtml += "</TR><TR>";
  for (var i = 0; i < weekdays.length ; i++) {
    strTableHtml += "<TD><input type='checkbox' class='check-workweek' weekday='"+ i + "'" 
      + (work_weekdays[i] ? ' checked' : '') + "></TD>";
  }
  strTableHtml += "</TR>";

  $('#tblWorkweek').html(strTableHtml);

  $('.check-workweek').change(function() {
    var weekday = parseInt($(this).attr('weekday')) || 0;
    work_weekdays[weekday] = $(this).is(':checked') ? 1 : 0;
    getYearCalHtml(selectedYears, $('#divCal'));
  });
}

function toggleExceptions() {
  var isChecked = $(this).is(':checked');
  switch ($(this).attr('id')) {
    case 'chkHoliYes':
      include_holidays = isChecked;
      $('#chkHoliNo').prop('checked', !include_holidays);
      break;
    case 'chkHoliNo':
      include_holidays = !isChecked;
      $('#chkHoliYes').prop('checked', include_holidays);
      break;
    case 'chkExcpYes':
      include_exceptions = isChecked;
      $('#chkExcpNo').prop('checked', !include_exceptions);
      break;
    case 'chkExcpNo':
      include_exceptions = !isChecked;
      $('#chkExcpYes').prop('checked', include_exceptions);
      break;
    default:
      break;
  }

  getYearCalHtml(selectedYears, $('#divCal'));
}

function openExceptionPickers() {
  var holiPicker  = $('#dpHolidays').multiDatesPicker({showOn: 'button', buttonText: 'Customize'});
  holiPicker.multiDatesPicker({
    onSelect: function(dateText) {
      custom_holidays = $('#dpHolidays').val().split(', ');
      getYearCalHtml(selectedYears, $('#divCal'));
    }
  });

  var excpPicker  = $('#dpExceptions').multiDatesPicker({showOn: 'button', buttonText: 'Customize'});
  excpPicker.multiDatesPicker({
    onSelect: function(dateText) {
      custom_exceptions = $('#dpExceptions').val().split(', ');
      getYearCalHtml(selectedYears, $('#divCal'));
    }
  });
}

function resetCalendar() {
  $('#txtProjName').val('');
  $('#txtProjDur').val('');
  $('#dpStartDate').val(firstSelectedDate);

  work_weekdays = [1,1,1,1,1,0,0];
  fillWorkweekSetting();

  include_holidays = false;
  custom_holidays = [];
  $('#dpHolidays').val('');
  include_exceptions = false;
  custom_exceptions = [];
  $('#dpExceptions').val('');

  $('#chkHoliYes').prop('checked', false);
  $('#chkHoliNo').prop('checked', true);
  $('#chkExcpYes').prop('checked', false);
  $('#chkExcpNo').prop('checked', true);

  selectedYears = [ new Date().getFullYear() ];
  getYearCalHtml(selectedYears, $('#divCal'));
}

function submitCalendar () {
  $('#printProjName').html($('#txtProjName').val());
  $('#printProjID').html($('#txtProjID').val());
  $('#printCalTitle').html(selectedYears + ' Working Day Calendar');
  $('#printCalTable').html($('#divCal').html());
}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

function getYearsList() {
  selectedYears = [];
  var startDate = $('#dpStartDate').datepicker("getDate");
  var projDuration = parseInt($('#txtProjDur').val());
  var endDate = startDate.addDays(projDuration);
  for (var i = startDate.getFullYear(); i <= endDate.getFullYear(); i++)
    selectedYears.push(i);
}

$(document).ready(function(){
  
  fillWorkweekSetting();
  $('#dpStartDate').datepicker({dateFormat: 'MM d, yy' })
    .datepicker("setDate", new Date())
    .on('change', function(e) {
      var strDate = $(this).val();
      var year = parseInt(strDate.substr(strDate.length - 4)) || 2017;
      getYearsList();
      getYearCalHtml(selectedYears, $('#divCal'));
    });
  firstSelectedDate = $('#dpStartDate').val();

  $('#txtProjDur').on('keyup', function(){
    var duration = parseInt($('#txtProjDur').val());
    if (duration < 1 || duration > 1000 || !duration) {
      $('.num-alert').show();
      return;
    }
    else {
      getYearsList();
      getYearCalHtml(selectedYears, $('#divCal'));
    }
  });

  $('#chkHoliNo').prop('checked', true);
  $('#chkExcpNo').prop('checked', true);
  $('#chkHoliYes').click(toggleExceptions);
  $('#chkHoliNo').click(toggleExceptions);
  $('#chkExcpYes').click(toggleExceptions);
  $('#chkExcpNo').click(toggleExceptions);

  openExceptionPickers();

  $('#btnReset').click(resetCalendar);
  $('#btnSubmit').click(submitCalendar);


  getYearCalHtml(selectedYears, $('#divCal'));
});