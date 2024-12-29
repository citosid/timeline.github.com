class TimelineManager {
  constructor() {
    this.events = [];
    this.container = document.getElementById('events-container');
    this.addEventElement = document.getElementById('add-event');
    this.generateTimelineElement = document.getElementById('generate-timeline');
    this.saveTimelineElement = document.getElementById('save-timeline');
    this.timelineTitleElement = document.getElementById('timeline-title');
    this.timelineDescElement = document.getElementById('timeline-desc');

    this.setupEventListeners();
    l(this);
  }

  setupEventListeners() {
    this.addEventElement.addEventListener('click', () => this.addEvent());
    this.generateTimelineElement.addEventListener('click', () => this.generateTimeline());
    this.saveTimelineElement.addEventListener('click', () => this.saveTimeline());
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

    new TL.Timeline('timeline-embed', timelineData);
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
}
