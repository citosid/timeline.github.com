class EventCard {
  constructor(event, onRemove) {
    this.event = event;
    this.onRemove = onRemove;
    this.element = this.render();
  }

  render() {
    const card = _DOM.create('div', { className: 'event-card' });

    const header = _DOM.create('div', { className: 'event-header' }, [
      _DOM.create('h3', { className: 'event-title' }, ['🗓 Historic Event Details']),
      _DOM.create(
        'button',
        {
          className: 'button danger',
          onClick: (e) => {
            e.preventDefault();
            if (window.confirm('Are you sure you want to remove this event?')) {
              this.onRemove(this.element);
            }
          },
        },
        ['🗑 Remove']
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
    const bceCheckboxAttributes = {
      type: 'checkbox',
      className: 'input-field compact',
      id: 'bce-checkbox',
    };
    if (this.event.bce) {
      bceCheckboxAttributes.checked = true;
    }
    this.bceCheckbox = _DOM.create('input', bceCheckboxAttributes);
    this.dateInput = _DOM.create('input', {
      type: 'date',
      className: 'input-field compact',
      value: this.event.date.toISOString().split('T')[0],
    });
    this.evetnHeadline = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.headline,
    });
    this.eventDescription = _DOM.create('textarea', {
      className: 'input-field compact',
      value: this.event.description,
    });
    this.eventDescription.textContent = this.event.description;
    this.mediaUrl = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.media?.url,
    });
    this.mediaCaption = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.media?.caption,
    });
    this.mediaCredit = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.media?.credit,
    });
    this.eventGroup = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.group,
    });
    this.eventTags = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.tags.join(', '),
    });
    this.eventLink = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.link?.url,
    });
    this.eventBackground = _DOM.create('input', {
      type: 'text',
      className: 'input-field compact',
      value: this.event.background?.url,
    });
    this.eventBackgroundColor = _DOM.create('input', {
      type: 'color',
      className: 'input-field compact',
      value: this.event.background?.color,
    });

    return [
      // _DOM.createInputGroup('📜 BCE', []),
      _DOM.createInputGroup('📜 BCE', [
        this.bceCheckbox,
        _DOM.create('label', { className: 'input-label' }, ['📅 Date']),
        this.dateInput,
      ]),
      _DOM.createInputGroup('📰 Title', [this.evetnHeadline]),
      _DOM.createInputGroup('📄 Desc:', [this.eventDescription]),
      _DOM.createInputGroup('🌐 Image', [
        this.mediaUrl,
        _DOM.create('label', { className: 'input-label' }, ['🎥 Background']),
        this.eventBackground,
      ]),
      // _DOM.createInputGroup('🎥 Background', [this.eventBackground]),
      // _DOM.createInputGroup('📝 Caption', this.mediaCaption),
      // _DOM.createInputGroup('🎨 Media Credit', this.mediaCredit),
      // _DOM.createInputGroup('📚 Group', this.eventGroup),
      // _DOM.createInputGroup('🏷 Tags', this.eventTags),
      // _DOM.createInputGroup('🔗 Link', this.eventLink),
      // _DOM.createInputGroup('🎨 Background Color', this.eventBackgroundColor),
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
        // color: this.eventBackgroundColor.value,
      },
      bce: this.bceCheckbox.checked,
    });
  }
}
