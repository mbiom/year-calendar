var strCalHtml = '';

var month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVENBER', 'DECEMBER'];
var weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
var month_length = [31,28,31,30,31,30,31,31,30,31,30,31];
var today = new Date();
var this_day = today.getDate();
var this_month = today.getMonth()+1;
var this_year = today.getYear();
var begin_date = new Date(new Date().getFullYear(), 0, 1);
var start_day = begin_date.getDay()+1;
if (start_day == 1){
  start_day = 8;
}

function day_title(day_name) {
  strCalHtml +="<TD ALIGN=center WIDTH=35>"+day_name+"</TD>";
}
function hilite_today(day,mm) {
  if ((this_day == day) && (this_month == mm))
    strCalHtml +="<FONT COLOR=\"#FF0000\">";
}
function fill_table(m_name,m_length,mm) {
  day=1;
  strCalHtml +="<TABLE BORDER=1><TR>";
  strCalHtml +="<TD COLSPAN=7 ALIGN=center><B>" + m_name + "   " + new Date().getFullYear() + "</B><TR>";
  for (var i  = 0; i < weekdays.length; i++)
    day_title(weekdays[i]);
  strCalHtml +="</TR><TR>";
  for (var i=1;i<start_day;i++) {
    strCalHtml +="<TD>";
  }
  for (var i = start_day; i<8; i++) {
    strCalHtml +="<TD ALIGN=center>";
    hilite_today(day,mm);
    strCalHtml +=day+"</TD>";
    day++;
  }
  strCalHtml +="<TR>";
  var num_rows = (start_day == 8 ? 0 : 1);
  while (day <= m_length) {
    var num_in_row = 0;
    for (var i=1;i<=7 && day<=m_length;i++) {
      strCalHtml +="<TD ALIGN=center>";
      hilite_today(day,mm);
      strCalHtml +=day+"</TD>";
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