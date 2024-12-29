let _eventCount = 0;

const l = console.log;

function addEventRow(eventData = null) {
  const container = document.getElementById('events-container');
  const eventDiv = document.createElement('div');
  eventDiv.className = 'event-row'; // Correct class name
  eventDiv.id = `event-row-${_eventCount}`;

  eventDiv.innerHTML = `
        <label for="event-date-${_eventCount}">Date</label>
        <input type="date" id="event-date-${_eventCount}" class="p-2" value="${eventData?.start_date?.year || ''}-${eventData?.start_date?.month || ''}-${eventData?.start_date?.day || ''}">
        <label for="event-headline-${_eventCount}">Headline</label>
        <input type="text" id="event-headline-${_eventCount}" class="p-2" value="${eventData?.text?.headline || ''}">
        <label for="event-text-${_eventCount}">Description</label>
        <textarea id="event-text-${_eventCount}" class="p-2">${eventData?.text?.text || ''}</textarea>
        <label for="event-media-${_eventCount}">Media URL</label>
        <input type="text" id="event-media-${_eventCount}" class="p-2" value="${eventData?.media?.url || ''}">
        <label for="event-media-caption-${_eventCount}">Media Caption</label>
        <input type="text" id="event-media-caption-${_eventCount}" class="p-2" value="${eventData?.media?.caption || ''}">
        <label for="event-media-credit-${_eventCount}">Media Credit</label>
        <input type="text" id="event-media-credit-${_eventCount}" class="p-2" value="${eventData?.media?.credit || ''}">
        <label for="event-group-${_eventCount}">Event Group</label>
        <input type="text" id="event-group-${_eventCount}" class="p-2" value="${eventData?.group || ''}">
        <label for="event-tags-${_eventCount}">Event Tags</label>
        <input type="text" id="event-tags-${_eventCount}" class="p-2" value="${eventData?.tags || ''}">
        <label for="event-link-${_eventCount}">Event Link</label>
        <input type="text" id="event-link-${_eventCount}" class="p-2" value="${eventData?.link?.url || ''}">
        <label for="event-background-${_eventCount}">Background Image URL</label>
        <input type="text" id="event-background-${_eventCount}" class="p-2" value="${eventData?.background?.url || ''}">
        <label for="event-background-color-${_eventCount}">Background Color</label>
        <input type="color" id="event-background-color-${_eventCount}" class="p-2" value="${eventData?.background?.color || '#ffffff'}">
        <button type="button" onclick="removeEvent(this)" class="p-2">Remove</button>
    `;
  container.appendChild(eventDiv);
  _eventCount++;
}

function removeEvent(button) {
  button.parentElement.remove();
  _eventCount--;
}

function generateTimeline() {
  const events = [];
  document.querySelectorAll('.event-row').forEach((row) => {
    const eventId = row.id.split('-')[2]; // Extract event ID from row ID

    const dateInput = row.querySelector(`#event-date-${eventId}`);
    const headlineInput = row.querySelector(`#event-headline-${eventId}`);
    const textInput = row.querySelector(`#event-text-${eventId}`);
    const mediaInput = row.querySelector(`#event-media-${eventId}`);
    const mediaCaptionInput = row.querySelector(`#event-media-caption-${eventId}`);
    const mediaCreditInput = row.querySelector(`#event-media-credit-${eventId}`);
    const groupInput = row.querySelector(`#event-group-${eventId}`);
    const tagsInput = row.querySelector(`#event-tags-${eventId}`);
    const linkInput = row.querySelector(`#event-link-${eventId}`);
    const backgroundInput = row.querySelector(`#event-background-${eventId}`);
    const backgroundColorInput = row.querySelector(`#event-background-color-${eventId}`);

    if (!(dateInput && headlineInput && textInput)) {
      console.error('Missing required input fields in event row:', row);
      return; // Skip this row if required inputs are missing
    }

    const dateStr = dateInput.value;
    const [year, month, day] = dateStr.split('-');

    const event = {
      start_date: {
        year: year,
        month: month,
        day: day,
      },
      text: {
        headline: headlineInput.value,
        text: textInput.value,
      },
      group: groupInput?.value || null,
      tags: tagsInput?.value ? tagsInput.value.split(',').map((tag) => tag.trim()) : [],
    };

    if (linkInput?.value) {
      event.link = {
        url: linkInput.value,
      };
    }

    if (backgroundInput?.value) {
      event.background = {
        url: backgroundInput.value,
        color: backgroundColorInput?.value || '#ffffff',
      };
    }

    if (mediaInput?.value) {
      event.media = {
        url: mediaInput.value,
        caption: mediaCaptionInput?.value || null,
        credit: mediaCreditInput?.value || null,
      };
    }

    events.push(event);
  });

  const timelineData = {
    events: events,
    title: {
      text: {
        headline: document.getElementById('timeline-title').value,
        text: document.getElementById('timeline-desc').value,
      },
    },
  };

  l(timelineData);

  try {
    new TL.Timeline('timeline-embed', timelineData);
  } catch (error) {
    console.error('Error creating timeline:', error);
    // Handle the error appropriately, e.g., display a message to the user
    alert('There was an error generating the timeline. Please check your input data.');
  }
}

function saveTimelineAsJSON() {
  const timelineData = {
    title: {
      text: {
        headline: document.getElementById('timeline-title').value,
        text: document.getElementById('timeline-desc').value,
      },
    },
    events: [],
  };

  document.querySelectorAll('.event-row').forEach((row) => {
    const eventId = row.id.split('-')[2]; // Extract event ID from row ID

    const dateInput = row.querySelector(`#event-date-${eventId}`);
    const headlineInput = row.querySelector(`#event-headline-${eventId}`);
    const textInput = row.querySelector(`#event-text-${eventId}`);
    const mediaInput = row.querySelector(`#event-media-${eventId}`);
    const mediaCaptionInput = row.querySelector(`#event-media-caption-${eventId}`);
    const mediaCreditInput = row.querySelector(`#event-media-credit-${eventId}`);
    const groupInput = row.querySelector(`#event-group-${eventId}`);
    const tagsInput = row.querySelector(`#event-tags-${eventId}`);
    const linkInput = row.querySelector(`#event-link-${eventId}`);
    const backgroundInput = row.querySelector(`#event-background-${eventId}`);
    const backgroundColorInput = row.querySelector(`#event-background-color-${eventId}`);

    if (!(dateInput && headlineInput && textInput)) {
      console.error('Missing required input fields in event row:', row);
      return; // Skip this row if required inputs are missing
    }

    const dateStr = dateInput.value;
    const [year, month, day] = dateStr.split('-'); // Split date

    timelineData.events.push({
      start_date: {
        year,
        month,
        day,
      },
      text: {
        headline: headlineInput.value,
        text: textInput.value,
      },
      media: {
        url: mediaInput?.value || null,
        caption: mediaCaptionInput?.value || null,
        credit: mediaCreditInput?.value || null,
      },
      group: groupInput?.value || null,
      tags: tagsInput?.value ? tagsInput.value.split(',').map((tag) => tag.trim()) : [],
      link: { url: linkInput?.value || null },
      background: {
        url: backgroundInput?.value || null,
        color: backgroundColorInput?.value || null,
      },
    });
  });

  const jsonBlob = new Blob([JSON.stringify(timelineData, null, 2)], { type: 'application/json' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(jsonBlob);
  downloadLink.download = 'timeline.json';
  downloadLink.click();
}

function loadTimelineFromJSON(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      if (data?.title?.text) {
        document.getElementById('timeline-title').value = data.title.text.headline || '';
        document.getElementById('timeline-desc').value = data.title.text.text || '';
      }
      if (data?.events) {
        document.getElementById('events-container').innerHTML = '';
        data.events.forEach(addEventRow);
      }
    };
    reader.readAsText(file);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  addEventRow();
});
