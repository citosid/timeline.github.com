class TimelineEvent {
  constructor({
    date = new Date(),
    headline = '',
    description = '',
    media = { url: '', caption: '', credit: '' },
    group = '',
    tags = [],
    link = '',
    background = { url: '', color: '#ffffff' },
  } = {}) {
    this.date = date;
    this.headline = headline;
    this.description = description;
    this.media = media;
    this.group = group;
    this.tags = tags;
    this.link = link;
    this.background = background;
  }

  toJSON() {
    const date = this.date instanceof Date ? this.date : new Date(this.date);
    return {
      start_date: {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        day: date.getDate().toString().padStart(2, '0'),
      },
      text: {
        headline: this.headline,
        text: this.description,
      },
      media: this.media,
      group: this.group,
      tags: this.tags,
      link: { url: this.link },
      background: this.background,
    };
  }

  static fromJSON(json) {
    const { start_date, text, media, group, tags, link, background } = json;
    return new TimelineEvent({
      date: new Date(`${start_date.year}-${start_date.month}-${start_date.day}`),
      headline: text.headline,
      description: text.text,
      media: media || {},
      group: group || '',
      tags: tags || [],
      link: link?.url || '',
      background: background || {},
    });
  }
}
