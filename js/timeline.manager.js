class TimelineManager {
  constructor(googleDriveService) {
    this.googleDriveService = googleDriveService;
    this.events = [];
    this.timelineBeingWorkedOn = null;

    this.initUIElements();
    this.setupEventListeners();
  }

  addEvent() {
    const event = new TimelineEvent(); // Implement TimelineEvent class elsewhere
    const card = new EventCard(event, (el) => this.removeEvent(el));
    this.events.push(card);
    this.container.appendChild(card.element);
  }

  async backupTimeline() {
    this.loadingSpinner.style.display = 'block';
    await this.googleDriveService.ensureFolderExists('Timeline');

    let fileName = `${this.timelineTitle.value.replace(/\s/g, '-')}.json`;

    if (this.timelineBeingWorkedOn) {
      fileName = this.timelineBeingWorkedOn.name;
    }

    const fileId = await this.googleDriveService.uploadFile(fileName, {
      title: {
        text: {
          headline: this.timelineTitle.value,
          text: this.timelineDesc.value,
        },
      },
      events: this.events.map((card) => card.getData().toJSON()),
    });

    this.timelineBeingWorkedOn = {
      id: fileId,
      name: fileName,
    };
    this.loadingSpinner.style.display = 'none';
  }

  closeParsedTimeline() {
    this.timelineParsed.style.display = 'none';
  }

  createLink(text, onClick) {
    const link = document.createElement('a');
    link.href = '';
    link.className = 'button';
    link.textContent = text;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      onClick();
    });
    return link;
  }

  generateTimeline(event) {
    event.preventDefault();
    this.timelineParsed.style.display = 'block';
    const timelineData = {
      events: this.events.map((card) => card.getData().toJSON()),
      title: {
        text: {
          headline: this.timelineTitle.value,
          text: this.timelineDesc.value,
        },
      },
    };
    new TL.Timeline('timeline-embed', timelineData, { is_embed: true });
  }

  initUIElements() {
    this.addEventButton = document.getElementById('add-event');
    this.backButton = document.getElementById('back-button');
    this.closeTimelineParsed = document.getElementById('close-timeline-parsed');
    this.container = document.getElementById('events-container');
    this.form = document.getElementById('timeline-form');
    this.generateTimelineAction = document.getElementById('generate-timeline-action');
    this.generateTimelineButtons = document.getElementsByClassName('generate-timeline');
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.timelineList = document.getElementById('timelines-list');
    this.timelineName = document.getElementById('timeline-name');
    this.timelineTitle = document.getElementById('timeline-title');
    this.timelineDesc = document.getElementById('timeline-desc');
    this.timelineParsed = document.getElementById('timeline-parsed');
  }

  handleBackButtonClick() {
    this.form.style.display = 'none';
    this.timelineList.style.display = 'grid';
    this.timelineBeingWorkedOn = null;
    this.generateTimelineAction.style.display = 'none';
    this.loadTimelines();
  }

  loadEmptyTimeline() {
    this.timelineTitle.value = '';
    this.timelineDesc.value = '';
    this.events = [];
    this.container.innerHTML = '';
    this.timelineBeingWorkedOn = null;
    this.form.style.display = 'block';
    this.timelineList.style.display = 'none';
    this.addEvent();
  }
  async loadTimeline(timeline) {
    this.loadingSpinner.style.display = 'block';
    const data = await this.googleDriveService.readFile(timeline);
    this.populateTimelineData(data);
    this.loadingSpinner.style.display = 'none';
    this.generateTimelineAction.style.display = 'block';
  }

  async loadTimelines() {
    this.loadingSpinner.style.display = 'block';
    const timelines = await this.googleDriveService.listTimelines();
    this.timelineList.innerHTML = '';

    const newTimelineLink = this.createLink('🆕 New Timeline', () => this.loadEmptyTimeline());
    this.timelineList.appendChild(newTimelineLink);

    timelines.forEach((timeline) => {
      const link = this.createLink(`📝 ${timeline.name}`, async () => {
        await this.loadTimeline(timeline);
        this.form.style.display = 'block';
        this.timelineList.style.display = 'none';
      });
      this.timelineList.appendChild(link);
    });
    this.loadingSpinner.style.display = 'none';
  }

  populateTimelineData(timelineData) {
    this.timelineBeingWorkedOn = timelineData;
    const data = timelineData.data;

    this.timelineName.textContent = `${data.title.text.headline} 📜 ${timelineData.name}`;

    this.timelineTitle.value = data.title.text.headline;
    this.timelineDesc.value = data.title.text.text;
    this.container.innerHTML = '';
    this.events = data.events.map((eventData) => {
      const event = TimelineEvent.fromJSON(eventData); // Implement fromJSON
      const card = new EventCard(event, (el) => this.removeEvent(el)); // Implement EventCard
      this.container.appendChild(card.element);
      return card;
    });
  }

  removeEvent(element) {
    element.remove();
    this.events = this.events.filter((event) => event.element !== element);
  }

  setupEventListeners() {
    this.backButton.addEventListener('click', () => this.handleBackButtonClick());
    this.addEventButton.addEventListener('click', () => this.addEvent());
    this.closeTimelineParsed.addEventListener('click', () => this.closeParsedTimeline());
    this.form.addEventListener('change', (_event) => this.backupTimeline());
    Array.from(this.generateTimelineButtons).forEach((button) => {
      button.addEventListener('click', (e) => this.generateTimeline(e));
    });
  }
}
