var strCalHtml = '';

var month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVENBER', 'DECEMBER'];
var weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
var holidays = ['1/1', '1-3-1', '2-3-1', '', '', '', '', '', '', '', '', '', '', '', '', ''];
var month_length = [31,28,31,30,31,30,31,31,30,31,30,31];
var today = new Date();
var begin_date = new Date(new Date().getFullYear(), 0, 1);
var start_day = begin_date.getDay()+1;
if (start_day == 1){
  start_day = 8;
}

function day_title(day_name) {
  strCalHtml +="<TD WIDTH=35>"+day_name+"</TD>";
}
function check_holiday (dt_date) {  // check for market holidays
// dt_date = new Date("2017-04-14T12:01:00Z"); // for testing purposes
  // check simple dates (month/date - no leading zeroes)
  var n_date = dt_date.getDate();
  var n_month = dt_date.getMonth() + 1;
  var s_date1 = n_month + '/' + n_date;
  var s_year = dt_date.getFullYear();
  var s_day = dt_date.getDay(); // day of the week 0-6
  switch(s_date1){
    case '1/1':
      return "New Year's";
    case '7/4':
      return "Independence Day";
    case '12/25':
      return "Christmas";
    // case GoodFriday(s_year):
      // return "Good Friday";
    }
  // special cases - friday before or monday after weekend holiday
  if (s_day == 5){  // Friday before
    switch(s_date1){
      case '12/31':
        return "New Year's";
      case '7/3':
        return "Independence Day";
      case '12/24':
        return "Christmas";
      }
    }
  if (s_day == 1){  // Monday after
    switch(s_date1){
      case '1/2':
        return "New Year's";
      case '7/5':
        return "Independence Day";
      case '12/26':
        return "Christmas";
      }
    }
  // weekday from beginning of the month (month/num/day)
  var n_wday = dt_date.getDay();
  var n_wnum = Math.floor((n_date - 1) / 7) + 1;
  var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;
  switch(s_date2){
    case '1/3/1':
      return "ML King Birthday";
    case '2/3/1':
      return "President's Day";
    case '9/1/1':
      return "Labor Day";
    case '11/4/4':
      return "Thanksgiving";
    }
  // weekday number from end of the month (month/num/day)
  var dt_temp = new Date (dt_date);
  dt_temp.setDate(1);
  dt_temp.setMonth(dt_temp.getMonth() + 1);
  dt_temp.setDate(dt_temp.getDate() - 1);
  n_wnum = Math.floor((dt_temp.getDate() - n_date - 1) / 7) + 1;
  var s_date3 = n_month + '/' + n_wnum + '/' + n_wday;
  if (   s_date3 == '5/1/1'  // Memorial Day, last Monday in May
  ) return 'Memorial Day';
  // misc complex dates
//  if (s_date1 == '1/20' && (((dt_date.getFullYear() - 1937) % 4) == 0) 
  // Inauguration Day, January 20th every four years, starting in 1937. 
//  ) return 'Inauguration Day';
//  if (n_month == 11 && n_date >= 2 && n_date < 9 && n_wday == 2
  // Election Day, Tuesday on or after November 2. 
//  ) return 'Election Day';
  return false;
} 
function hilite_nonworking(dayOfWeek, dt_date) {
  // if ((this_day == day) && (this_month == mm))
  //   strCalHtml +="<FONT COLOR=\"#FF0000\">";
  if (dayOfWeek % 7 == 0 || dayOfWeek % 7 == 1)
    return " class='nonworking'";
  else
    return check_holiday(dt_date) ? " class='nonworking'":"";
}

function fill_table(m_name,m_length,mm) {
  day=1;
  strCalHtml +="<TABLE BORDER=1 id='tblCalendar'><TR>";
  strCalHtml +="<TD COLSPAN=7><B>" + m_name + "   " + new Date().getFullYear() + "</B><TR>";
  for (var i  = 0; i < weekdays.length; i++)
    day_title(weekdays[i]);
  strCalHtml +="</TR><TR>";
  for (var i=1;i<start_day;i++) {
    strCalHtml +="<TD>";
  }
  for (var i = start_day; i<8; i++) {
    strCalHtml += "<TD" + hilite_nonworking(i, new Date(new Date().getFullYear(), mm, day)) + ">";
    strCalHtml += day + "</TD>";
    day++;
  }
  strCalHtml +="<TR>";
  var num_rows = (start_day == 8 ? 0 : 1);
  while (day <= m_length) {
    var num_in_row = 0;
    for (var i=1;i<=7 && day<=m_length;i++) {
      strCalHtml += "<TD " + hilite_nonworking(i, new Date(new Date().getFullYear(), mm, day)) + ">";
      strCalHtml += day + "</TD>";
      day++;
      num_in_row++;
    }
    if (num_in_row < 7) {
      for (var j = 0; j < 7 - num_in_row; j++)
        strCalHtml += "<TD>&nbsp;</TD>";
    }
    strCalHtml +="</TR><TR>";
    num_rows++;
  }
  if (num_rows < 6)
    strCalHtml += "<TD>&nbsp;</TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD><TD></TD>";
  strCalHtml +="</TR></TABLE>";
  start_day = i;
}

$(document).ready(function(){
  strCalHtml = "<TABLE><TR>";
  for (var m = 0; m < 12; m++){
    if (m % 3 == 0)
      strCalHtml += "</TR><TR>";
    strCalHtml += "<TD>";
    fill_table(month[m], month_length[m], m);
    strCalHtml += "</TD>";
  }
  strCalHtml += "</TABLE>";
  $('#divCal').html(strCalHtml);
});