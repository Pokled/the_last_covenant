const deadline = 'January 19 2038 03:14:08 UTC';

function timeLeft(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total/1000)%60);
    return {total, seconds};
}

function updateClock() {
    const clock = document.getElementsByClassName('clockdiv').item(0);
    const t = timeLeft(deadline);
    clock.innerHTML = '<label>' + t.total.toString(2) + '</label>';
    if (t.total <= 0) {
        clearInterval(timeinterval);
    }
}

updateClock();
var timeinterval = setInterval(updateClock, 1000);