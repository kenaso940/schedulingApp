document.addEventListener("DOMContentLoaded", function () {

    const calendarEl = document.getElementById("calendar");
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      selectable: true,  // allow date selection
      editable: true,    // allow dragging/resizing events

      // Add a new event when a date is selected
      select: function (info) {
        const title = prompt("Enter event title:");
        if (title) {
          calendar.addEvent({
            title: title,
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay
          });
        }
        calendar.unselect(); // clear the selection
      },

      // Remove an event when clicked
      eventClick: function (info) {
        if (confirm(`Delete event: "${info.event.title}"?`)) {
          info.event.remove();
        }
      },

   
    });

    calendar.render();
  }
});
