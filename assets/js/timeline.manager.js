class TimelineManager {
  constructor(googleDriveService) {
    this.googleDriveService = googleDriveService;

    this.events = [];
    this.container = document.getElementById('events-container');

    this.backButtonElement = document.getElementById('back-button');

    this.timelinesListElement = document.getElementById('timelines-list');

    this.timelineNameElement = document.getElementById('timeline-name');
    this.formElement = document.getElementById('timeline-form');

    this.addEventElement = document.getElementById('add-event');

    this.generateTimelineElement = document.getElementById('generate-timeline');

    this.timelineTitleElement = document.getElementById('timeline-title');
    this.timelineDescElement = document.getElementById('timeline-desc');

    this.timelineParsedElement = document.getElementById('timeline-parsed');

    this.closeTimelineParsedElement = document.getElementById('close-timeline-parsed');

    this.timelineBeingWorkedOn = null;

    this.setupEventListeners();
  }

  async loadTimelines() {
    const timelines = await this.googleDriveService.listTimelines();

    this.timelinesListElement.innerHTML = '';

    const newTimelineLink = _DOM.create(
      'a',
      {
        href: '',
        className: 'button secondary timeline-item',
      },
      ['🆕 New Timeline']
    );
    newTimelineLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.loadEmptyTimeline();
    });
    this.timelinesListElement.appendChild(newTimelineLink);

    timelines.forEach((timeline) => {
      const link = _DOM.create(
        'a',
        {
          href: '',
          className: 'button timeline-item',
        },
        [`📝 ${timeline.name}`]
      );

      link.addEventListener('click', async (event) => {
        event.preventDefault();
        await this.loadTimeline(timeline);
        this.formElement.style.display = 'block';
        this.timelinesListElement.style.display = 'none';
      });

      this.timelinesListElement.appendChild(link);
    });
  }

  addEvent(eventData = null) {
    const event = eventData ? TimelineEvent.fromJSON(eventData) : new TimelineEvent();
    const card = new EventCard(event, (element) => this.removeEvent(element));
    this.events.push(card);
    this.container.appendChild(card.element);
  }

  async backupTimeline() {
    await this.googleDriveService.ensureFolderExists('Timeline');

    let fileName = `${this.timelineTitleElement.value.replace(/\s/g, '-')}.json`;

    if (this.timelineBeingWorkedOn) {
      fileName = this.timelineBeingWorkedOn.name;
    }

    const fileId = await this.googleDriveService.uploadFile(fileName, {
      title: {
        text: {
          headline: this.timelineTitleElement.value,
          text: this.timelineDescElement.value,
        },
      },
      events: this.events.map((card) => card.getData().toJSON()),
    });

    this.timelineBeingWorkedOn = {
      id: fileId,
      name: fileName,
    };
  }

  setupEventListeners() {
    this.backButtonElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.formElement.style.display = 'none';
      this.timelinesListElement.style.display = 'grid';
      this.timelinebeingWorkedOn = null;
      this.timelinesListElement.innerHTML = 'Loading your timelines... ⏳';
      this.loadTimelines();
    });
    this.formElement.addEventListener('change', (_event) => this.backupTimeline());
    this.addEventElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.addEvent();
    });
    this.generateTimelineElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.generateTimeline();
    });
    this.closeTimelineParsedElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.timelineParsedElement.style.display = 'none';
    });
  }

  removeEvent(element) {
    element.remove();
    this.events = this.events.filter((event) => event.element !== element);
  }

  generateTimeline() {
    this.timelineParsedElement.style.display = 'block';
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

    new TL.Timeline('timeline-embed', timelineData, {
      is_embed: true,
    });
  }

  loadEmptyTimeline() {
    this.timelineTitleElement.value = '';
    this.timelineDescElement.value = '';
    this.events = [];
    this.container.innerHTML = '';
    this.timelineBeingWorkedOn = null;
    this.formElement.style.display = 'block';
    this.timelinesListElement.style.display = 'none';

    this.addEvent();
  }

  async loadTimeline(timeline) {
    this.timelineBeingWorkedOn = timeline;
    const timelineData = await this.googleDriveService.readFile(timeline);
    const data = timelineData.data;

    if (data?.title?.text) {
      this.timelineTitleElement.value = data.title.text.headline || '';
      this.timelineDescElement.value = data.title.text.text || '';
      this.timelineNameElement.children[0].textContent = `${data.title.text.headline} (${timeline.name})`;
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
  }
}
