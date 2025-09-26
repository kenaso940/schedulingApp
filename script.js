document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const completedBox = document.getElementById("completedTasks").querySelector("#completedList");


  if (calendarEl) {
    // Load saved events from localStorage
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    savedEvents.forEach(ev => {
      if (ev.difficulty === "Hard") ev.color = "red";
      else if (ev.difficulty === "Medium") ev.color = "orange";
      else ev.color = "green";
    });



    // Load saved completed tasks
    const savedCompleted = JSON.parse(localStorage.getItem("completedTasks")) || [];
    savedCompleted.forEach(task => {
      const li = document.createElement("li");
      li.textContent = `${task.title} (${task.difficulty})`;
      completedBox.appendChild(li);
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      selectable: true,
      editable: true,
      events: savedEvents, // load saved events

      // Add new event
      select: function (info) {
        const title = prompt("Enter event title:");
        if (title) {
          let difficulty;
          do {
            difficulty = prompt("Enter difficulty: Easy, Medium, Hard").trim();
          } while (!["Easy", "Medium", "Hard"].includes(difficulty));

          let color = difficulty === "Hard" ? "red" : difficulty === "Medium" ? "orange" : "green";

          const newEvent = {
            title: title,
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay,
            difficulty: difficulty,
            color: color
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

      // Delete event on click
      eventClick: function (info) {
        if (confirm(`Delete event: "${info.event.title}"?`)) {
          info.event.remove();
          const currentEvents = calendar.getEvents().map(ev => ({
            title: ev.title,
            start: ev.startStr,
            end: ev.endStr,
            allDay: ev.allDay,
            difficulty: ev.extendedProps.difficulty
          }));
          localStorage.setItem("events", JSON.stringify(currentEvents));
        }
      },

      // Drag-and-drop to completed box
      eventDragStop: function (info) {
        const rect = completedBox.parentElement.getBoundingClientRect();
        if (
          info.jsEvent.clientX >= rect.left &&
          info.jsEvent.clientX <= rect.right &&
          info.jsEvent.clientY >= rect.top &&
          info.jsEvent.clientY <= rect.bottom
        ) {
          // Remove from calendar
          info.event.remove();

          // Add to completed list in HTML
          const li = document.createElement("li");
          li.textContent = `${info.event.title} (${info.event.extendedProps.difficulty})`;
          completedBox.appendChild(li);

          // Save completed task to localStorage
          let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
          completedTasks.push({
            title: info.event.title,
            difficulty: info.event.extendedProps.difficulty
          });
          localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

          // Update calendar events in localStorage
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


