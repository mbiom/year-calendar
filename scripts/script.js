var firstSelectedDate;
var selectedYears = [ new Date().getFullYear() ];
var moratCount = 0;

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
    case 'chkMoratYes':
      include_morat = isChecked;
      $('#chkMoratNo').prop('checked', !include_morat);
      $('#divMoratOptions').toggle(include_morat);
      break;
    case 'chkMoratNo':
      include_morat = !isChecked;
      $('#chkMoratYes').prop('checked', include_morat);
      $('#divMoratOptions').toggle(include_morat);
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
    },
    beforeShowDay: function(date) {
      var highlight = check_holiday(date, false);
      if (highlight) {
        return [true, "holid", highlight];
      } else {
        return [false, '', ''];
      }
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
  $('.num-alert').hide();
  $('#txtProjID').val('');
  $('#dpStartDate').val(firstSelectedDate);

  work_weekdays = [0,1,1,1,1,1,0];
  fillWorkweekSetting();

  $('#chkHoliYes').prop('checked', false);
  $('#chkHoliNo').prop('checked', true);
  $('#chkExcpYes').prop('checked', false);
  $('#chkExcpNo').prop('checked', true);
  $('#chkMoratYes').prop('checked', false);
  $('#chkMoratNo').prop('checked', true);

  include_holidays = false;
  custom_holidays = [];
  $('#dpHolidays').val('');
  include_exceptions = false;
  custom_exceptions = [];
  $('#dpExceptions').val('');
  include_morat = false;
  for (var i = 0; i < 10; i++) {
    morat_ranges[i] = [null, null];
    morat_repeat[i] = false;
    $("input[rng-num='"+i+"_0']").val('');
    $("input[rng-num='"+i+"_1']").val('');
    $(".rngchk[rng-num='"+i+"']").prop('checked', false);
    $("div[rng-num='"+(i+1)+"']").hide();
  }
  moratCount = 0;
  $('#divMoratOptions').hide();

  selectedYears = [ new Date().getFullYear() ];
  getYearCalHtml(selectedYears, $('#divCal'));
}

function submitCalendar () {
  $('#printProjName').html($('#txtProjName').val());
  $('#printProjID').html("Project ID: " + $('#txtProjID').val());
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
  var projDuration = parseInt($('#txtProjDur').val()) || 0;
  var endDate = startDate.addDays(projDuration);
  for (var i = startDate.getFullYear(); i <= endDate.getFullYear(); i++)
    selectedYears.push(i);
}

function fillMoratOptions() {
  morat_ranges = [];
  var strMoratHtml = "";
  for (var i = 0; i < 10; i++) {
    strMoratHtml += "<div rng-num='" + i 
      + "'><button type='button' class='btn btn-xs btn-default del-morat' rng-num='"
      + i + "'><span class='glyphicon glyphicon-minus'></span>"
      + "</button>Start: <input type='text' class=rngdp rng-num='"
      + i + "_0'>Finish: <input type='text' class='rngdp' rng-num='" 
      + i + "_1'>&emsp;&emsp; Repeat Annually: <input type='checkbox' class='rngchk' rng-num='"
      + i + "'></div>";
    morat_ranges[i] = [null, null];
    morat_repeat[i] = false;
  }
  $('#divMoratOptions').html(strMoratHtml + $('#divMoratOptions').html());
  $('#divMoratOptions').hide();

  for (var i = 1; i < 10; i++)
    $("div[rng-num='"+i+"']").hide();

  $('#divMoratOptions .rngdp').datepicker()
    .on('change', function(e){
      var rngs = $(this).attr('rng-num').split('_');
      morat_ranges[parseInt(rngs[0])][parseInt(rngs[1])] = $(this).datepicker('getDate');

      var date1 = $("input[rng-num='"+rngs[0]+"_0']").datepicker('getDate');
      var date2 = $("input[rng-num='"+rngs[0]+"_1']").datepicker('getDate');
      if (!include_morat)
        return;
      if (!date1 || !date2)
        return;
      if (date1.getTime() > date2.getTime())
        return;
      getYearCalHtml(selectedYears, $('#divCal'));
    });

  $('#divMoratOptions .rngchk').click(function(){
    var rngNum = parseInt($(this).attr('rng-num'));
    morat_repeat[rngNum] = $(this).is(':checked');
    var date1 = $("input[rng-num='"+rngNum+"_0']").datepicker('getDate');
    var date2 = $("input[rng-num='"+rngNum+"_1']").datepicker('getDate');
    if (!include_morat)
      return;
    if (!date1 || !date2)
      return;
    if (date1.getTime() > date2.getTime())
      return;
    getYearCalHtml(selectedYears, $('#divCal'));
  });

  $('#addMorat').click(function() {
    console.log(moratCount);
    if (moratCount > 7)
      $(this).hide();
    if (moratCount > 8)
      return;

    moratCount++;
    $("div[rng-num='"+moratCount+"']").show();
  });

  $('.del-morat').click(function() {
    var rngNum = parseInt($(this).attr('rng-num'));
    for (var i = rngNum+1; i <= moratCount; i++) {
      $("input[rng-num='"+(i-1)+"_0']").val($("input[rng-num='"+i+"_0']").val());
      $("input[rng-num='"+(i-1)+"_1']").val($("input[rng-num='"+i+"_1']").val());
      if (!morat_ranges[i][0])
        morat_ranges[i-1][0] = null;
      else
        morat_ranges[i-1][0] = new Date(morat_ranges[i][0].getTime());
      if (!morat_ranges[i][1])
        morat_ranges[i-1][1] = null;
      else
        morat_ranges[i-1][1] = new Date(morat_ranges[i][1].getTime());

      $(".rngchk[rng-num='"+(i-1)+"']").prop('checked', $(".rngchk[rng-num='"+i+"']").is(':checked'));
    }
    
    morat_ranges[moratCount][0] = null;
    morat_ranges[moratCount][1] = null;
    $("input[rng-num='"+moratCount+"_0']").val('');
    $("input[rng-num='"+moratCount+"_1']").val('');
    $(".rngchk[rng-num='"+moratCount+"']").prop('checked', false);
    $("div[rng-num='"+moratCount+"']").hide();
    moratCount--;

    getYearCalHtml(selectedYears, $('#divCal'));
  });
}

$(document).ready(function(){
  
  fillWorkweekSetting();
  $('#dpStartDate').datepicker({dateFormat: 'MM d, yy' })
    .datepicker("setDate", new Date())
    .on('change', function(e) {
      getYearsList();
      getYearCalHtml(selectedYears, $('#divCal'));
    });
  firstSelectedDate = $('#dpStartDate').val();

  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
   };
  })();

  $('#txtProjDur').on('keyup', function(){
    delay(function(){
      var duration = parseInt($('#txtProjDur').val());
      if (duration < 1 || duration > 1000 || !duration) {
        $('.num-alert').show();
        return;
      }
      else {
        $('.num-alert').hide();
        getYearsList();
        getYearCalHtml(selectedYears, $('#divCal'));
      }
    }, 1000 );
  });

  $('#chkHoliNo').prop('checked', true);
  $('#chkExcpNo').prop('checked', true);
  $('#chkMoratNo').prop('checked', true);
  $('#chkHoliYes').click(toggleExceptions);
  $('#chkHoliNo').click(toggleExceptions);
  $('#chkExcpYes').click(toggleExceptions);
  $('#chkExcpNo').click(toggleExceptions);
  $('#chkMoratYes').click(toggleExceptions);
  $('#chkMoratNo').click(toggleExceptions);

  openExceptionPickers();
  fillMoratOptions();

  $('#btnReset').click(resetCalendar);
  $('#btnSubmit').click(submitCalendar);

  getYearCalHtml(selectedYears, $('#divCal'));
});