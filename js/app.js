l = console.log;

class TimelineManager {
  constructor() {
    this.events = [];
    this.container = document.getElementById('events-container');
    this.setupEventListeners();
    l(this);
  }

  setupEventListeners() {
    document.getElementById('add-event').addEventListener('click', () => this.addEvent());
    document
      .getElementById('generate-timeline')
      .addEventListener('click', () => this.generateTimeline());
    document.getElementById('save-timeline').addEventListener('click', () => this.saveTimeline());
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
          headline: document.getElementById('timeline-title').value,
          text: document.getElementById('timeline-desc').value,
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
          headline: document.getElementById('timeline-title').value,
          text: document.getElementById('timeline-desc').value,
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

window.onload = async () => {
  await _configureClient();
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    l('authenticated');
    l(TimelineManager);
    // _updateUI();

    window.timeline = new TimelineManager();
    window.timeline.addEvent();
    return;
  }

  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    _updateUI();
    window.history.replaceState({}, document.title, '/');
  }
};
