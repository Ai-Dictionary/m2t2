function today_class(date, noday) {
    const day_list = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day_index = (date % 7) + noday;
    const selected_day = day_list[day_index==8?0:day_index==9?1:day_index-1];
    console.log("You clicked date: " + date, selected_day);
}

function dropdown_Year(){
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const month_list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dropdown_list = '';
    for(let i=0; i<3; i++){
        if(month+i < 12){
            dropdown_list += `<option value="${month+','+year}" ${i==0?'selected':''}>${month_list[month+i]} ${year}</option>`;
        }else{
            dropdown_list += `<option value="${((month+i) % 12)+','+year+1}" ${i==0?'selected':''}>${month_list[((month+i) % 12)]} ${year+1}</option>`;
        }
    }
    document.getElementById('month-list').innerHTML = dropdown_list;
}

function generateCalendar() {
    const calDate = document.getElementById("cal-date");
    calDate.innerHTML = "";

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calDate.innerHTML += `<div class="date nodate"><div class="d"></div><div class="c">.</div></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate();
        calDate.innerHTML += `
      <div class="date ${isToday ? "todate" : ""}" onclick="today_class(${d}, ${firstDay});">
        <div class="d">${String(d).padStart(2, "0")}</div>
        <div class="c" style="opacity:${d%2==0?1:0};">...</div>
      </div>`;
    }

    const totalCells = firstDay + daysInMonth;
    const extra = 7 - (totalCells % 7);
    if (extra < 7) {
        for (let i = 0; i < extra; i++) {
            calDate.innerHTML += `<div class="date nodate"><div class="d"></div><div class="c">.</div></div>`;
        }
    }
}

generateCalendar();
dropdown_Year();