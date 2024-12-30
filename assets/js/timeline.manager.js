class TimelineManager {
  constructor() {
    this.events = [];
    this.container = document.getElementById('events-container');
    this.addEventElement = document.getElementById('add-event');
    this.generateTimelineElement = document.getElementById('generate-timeline');
    this.saveTimelineElement = document.getElementById('save-timeline');
    this.timelineTitleElement = document.getElementById('timeline-title');
    this.timelineDescElement = document.getElementById('timeline-desc');
    this.timelineLoaderElement = document.getElementById('load-file');

    this.setupEventListeners();
    l(this);
  }

  setupEventListeners() {
    this.addEventElement.addEventListener('click', () => this.addEvent());
    this.generateTimelineElement.addEventListener('click', () => this.generateTimeline());
    this.saveTimelineElement.addEventListener('click', () => this.saveTimeline());
    this.timelineLoaderElement.addEventListener('change', (event) => this.loadTimeline(event));
  }

  addEvent(eventData = null) {
    const event = eventData ? TimelineEvent.fromJSON(eventData) : new TimelineEvent();
    const card = new EventCard(event, (element) => this.removeEvent(element));
    this.events.push(card);
    this.container.appendChild(card.element);
  }

  removeEvent(element) {
    element.remove();
    this.events = this.events.filter((event) => event.element !== element);
  }

  generateTimeline() {
    const timelineData = {
      events: this.events.map((card) => {
        return card.getData().toJSON();
      }),
      title: {
        text: {
          headline: this.timelineTitleElement.value,
          text: this.timelineDescElement.value,
        },
      },
    };
    l('timelineData', timelineData);

    new TL.Timeline('timeline-embed', timelineData, {
      is_embed: true,
    });
  }

  saveTimeline() {
    const timelineData = {
      title: {
        text: {
          headline: this.timelineTitleElement.value,
          text: this.timelineDescElement.value,
        },
      },
      events: this.events.map((card) => card.getData().toJSON()),
    };

    const jsonBlob = new Blob([JSON.stringify(timelineData, null, 2)], {
      type: 'application/json',
    });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(jsonBlob);
    downloadLink.download = 'timeline.json';
    downloadLink.click();
  }

  loadTimeline(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);

        if (data?.title?.text) {
          this.timelineTitleElement.value = data.title.text.headline || '';
          this.timelineDescElement.value = data.title.text.text || '';
        }

        if (data?.events) {
          this.container.innerHTML = ''; // Clear existing events in the container
          this.events = data.events.map((eventData) => {
            const timelineEvent = TimelineEvent.fromJSON(eventData);
            const eventCard = new EventCard(timelineEvent, (element) => this.removeEvent(element));
            this.container.appendChild(eventCard.element); // Append the new EventCard to the container
            return eventCard;
          });
        }
      };
      reader.readAsText(file);
    }
  }
}
