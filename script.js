

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  if (calendarEl) {
    // Load saved events from localStorage
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    savedEvents.forEach(ev => {
    if (ev.difficulty === "Hard") ev.color = "red";
    else if (ev.difficulty === "Medium") ev.color = "orange";
    else ev.color = "green";
});

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      selectable: true,
      editable: true,
      events: savedEvents, // load saved events

      select: function (info) {
        const title = prompt("Enter event title:");
        if (title) {
          const difficulty = prompt("Enter difficulty (Easy, Medium, Hard):");

          let color;
          if (difficulty === "Hard") color = "red";
          else if (difficulty === "Medium") color = "orange";
          else color = "green";

          const newEvent = {
            title: title,
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay,
            difficulty: difficulty
          };
          calendar.addEvent(newEvent);

          
          
         

          // Save updated events to localStorage
          const currentEvents = calendar.getEvents().map(ev => ({
            title: ev.title,
            start: ev.startStr,
            end: ev.endStr,
            allDay: ev.allDay,
            difficulty: ev.extendedProps.difficulty
          }));
          localStorage.setItem("events", JSON.stringify(currentEvents));
        }
        calendar.unselect();
      },

      eventClick: function (info) {
        if (confirm(`Delete event: "${info.event.title}"?`)) {
          info.event.remove();

          // Update localStorage after deletion
          const currentEvents = calendar.getEvents().map(ev => ({
            title: ev.title,
            start: ev.startStr,
            end: ev.endStr,
            allDay: ev.allDay,
            difficulty: ev.extendedProps.difficulty
          }));
          localStorage.setItem("events", JSON.stringify(currentEvents));
        }
      }
    });

    calendar.render();
  }
});
