
document.addEventListener('DOMContentLoaded', function() {
  
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
      if (title) {
        calendar.addEvent({
          title: title,
          start: arg.start,
          end: arg.end,
          allDay: arg.allDay
        })
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
      {
        title: 'All Day Event',
        start: '2020-09-01'
      },
      {
        title: 'Long Event',
        start: '2020-09-07',
        end: '2020-09-10'
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-09-09T16:00:00'
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-09-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2020-09-11',
        end: '2020-09-13'
      },
      {
        title: 'Meeting',
        start: '2020-09-12T10:30:00',
        end: '2020-09-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2020-09-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2020-09-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2020-09-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2020-09-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2020-09-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2020-09-28'
      }
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
 
  calendar.render();
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
  function continous() {
    var time = moment().format("dddd MMMM Do YYYY hh:mm:ss");
    $(".time-current").text(time);
    }
    
    setInterval(continous, 1000);
