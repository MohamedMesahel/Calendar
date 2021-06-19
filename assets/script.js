
document.addEventListener('DOMContentLoaded', function (event1) {
  
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialDate: '2021-06-17',

    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
  

  select: function(arg) {
    var title = prompt('Event Title:');
      localStorage.setItem('saveDescription', title);
      localStorage.setItem('saveDATA', arg.start);

      var eventData = {
        title: title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDaym, 
      };

      localStorage.setItem('eventData',JSON.stringify(eventData));


      
      console.log("This is a value of saveDescription" + localStorage.getItem('saveDescription'));
         if (title) {
          console.log( "This value is being passed into the if(title) " +localStorage.getItem('saveDescription'));
          calendar.addEvent(eventData)  
          
        }
      calendar.unselect()  

    
      
    },
    eventClick: function() {
      
      if (confirm('Are you sure you want to delete this event?')) {
        arg.event.remove()
      }
    },
    editable: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: [
    
    ],
    // THIS KEY WON'T WORK IN PRODUCTION!!!
      // To make your own Google API key, follow the directions here:
      // http://fullcalendar.io/docs/google_calendar/
      googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',

      // US Holidays
      events: 'en.usa#holiday@group.v.calendar.google.com',

      eventClick: function(arg) {
        // opens events in a popup window
        window.open(arg.event.url, 'google-calendar-event', 'width=700,height=600');

        arg.jsEvent.preventDefault() // don't navigate in main tab
      },

      loading: function(bool) {
        document.getElementById('loading').style.display =
          bool ? 'block' : 'none';
      },
      
  });

  console.log(localStorage.getItem('saveDATA'));
  var savedData = localStorage.getItem('eventData');
  if(savedData) {
    calendar.addEvent(JSON.parse(savedData))
  }   

  calendar.render()
});


// document.addEventListener('DOMContentLoaded', function() {

//   /* initialize the external events
//   -----------------------------------------------------------------*/

//   var containerEl = document.getElementById('external-events-list');
//   new FullCalendar.Draggable(containerEl, {
//     itemSelector: '.fc-event',
//     eventData: function(eventEl) {
//       return {
//         title: eventEl.innerText.trim()
//       }
//     }
//   });

//   //// the individual way to do it
//   // var containerEl = document.getElementById('external-events-list');
//   // var eventEls = Array.prototype.slice.call(
//   //   containerEl.querySelectorAll('.fc-event')
//   // );
//   // eventEls.forEach(function(eventEl) {
//   //   new FullCalendar.Draggable(eventEl, {
//   //     eventData: {
//   //       title: eventEl.innerText.trim(),
//   //     }
//   //   });
//   // });

//   /* initialize the calendar
//   -----------------------------------------------------------------*/

//   var calendarEl = document.getElementById('calendar');
//   var calendar = new FullCalendar.Calendar(calendarEl, {
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
//     },
//     editable: true,
//     droppable: true, // this allows things to be dropped onto the calendar
//     drop: function(arg) {
//       // is the "remove after drop" checkbox checked?
//       if (document.getElementById('drop-remove').checked) {
//         // if so, remove the element from the "Draggable Events" list
//         arg.draggedEl.parentNode.removeChild(arg.draggedEl);
//       }
//     }
//   });
//   calendar.render();

// });
//$("#calendar.saved-description").val(localStorage.getItem('savedDescription'));
//setInterval(event1);

/* calendar.addEvent({
  title: localStorage.getItem('saveDescription'),
  
  start: arg.start,
  end: arg.end,
  allDay: arg.allDay
});
*/


  function continous() {
    var time = moment().format("dddd MMMM Do YYYY hh:mm:ss");
    $(".time-current").text(time);
    }
    
    setInterval(continous, 1000);
