class EventCard {
  constructor(event, onRemove) {
    this.event = event;
    this.onRemove = onRemove;
    this.element = this.render();
  }

  render() {
    const card = _DOM.create('div', { className: 'event-card' });

    const header = _DOM.create('div', { className: 'event-header' }, [
      _DOM.create('h3', { className: 'event-title' }, ['Event Details']),
      _DOM.create(
        'button',
        {
          className: 'button danger',
          onClick: () => this.onRemove(this.element),
        },
        ['Remove']
      ),
    ]);

    const grid = _DOM.create('div', { className: 'event-grid' });

    // Add input fields
    const fields = this.createFields();
    fields.forEach((field) => grid.appendChild(field));

    card.appendChild(header);
    card.appendChild(grid);

    return card;
  }

  createFields() {
    this.dateInput = _DOM.create('input', {
      type: 'date',
      className: 'input-field',
      value: this.event.date.toISOString().split('T')[0],
    });
    this.evetnHeadline = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.headline,
    });
    this.eventDescription = _DOM.create('textarea', {
      className: 'input-field',
      value: this.event.description,
    });
    this.mediaUrl = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.media?.url,
    });
    this.mediaCaption = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.media?.caption,
    });
    this.mediaCredit = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.media?.credit,
    });
    this.eventGroup = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.group,
    });
    this.eventTags = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.tags.join(', '),
    });
    this.eventLink = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.link?.url,
    });
    this.eventBackground = _DOM.create('input', {
      type: 'text',
      className: 'input-field',
      value: this.event.background?.url,
    });
    this.eventBackgroundColor = _DOM.create('input', {
      type: 'color',
      className: 'input-field',
      value: this.event.background?.color,
    });

    return [
      _DOM.createInputGroup('Date', this.dateInput),
      _DOM.createInputGroup('Headline', this.evetnHeadline),
      _DOM.createInputGroup('Description', this.eventDescription),
      _DOM.createInputGroup('Media URL', this.mediaUrl),
      _DOM.createInputGroup('Media Caption', this.mediaCaption),
      _DOM.createInputGroup('Media Credit', this.mediaCredit),
      _DOM.createInputGroup('Event Group', this.eventGroup),
      _DOM.createInputGroup('Event Tags', this.eventTags),
      _DOM.createInputGroup('Event Link', this.eventLink),
      _DOM.createInputGroup('Background URL', this.eventBackground),
      _DOM.createInputGroup('Background Color', this.eventBackgroundColor),
    ];
  }

  getData() {
    // Collect and return data from all input fields
    return new TimelineEvent({
      date: this.dateInput.value,
      headline: this.evetnHeadline.value,
      description: this.eventDescription.value,
      media: {
        url: this.mediaUrl.value,
        caption: this.mediaCaption.value,
        credit: this.mediaCredit.value,
      },
      group: this.eventGroup.value,
      tags: this.eventTags.value.split(',').map((tag) => tag.trim()),
      link: {
        url: this.eventLink.value,
      },
      background: {
        url: this.eventBackground.value,
        color: this.eventBackgroundColor.value,
      },
    });
  }
}
