
function continous() {
var time = moment().format("dddd MMMM Do YYYY hh:mm:ss");
$(".time-current").text(time);
}

setInterval(continous, 1000);
