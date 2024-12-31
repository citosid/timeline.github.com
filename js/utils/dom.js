const _DOM = {
  create(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key.startsWith('on')) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  },

  createInputGroup(label, inputs) {
    return _DOM.create('div', { className: 'input-group' }, [
      _DOM.create('label', { className: 'input-label' }, [label]),
      ...inputs,
    ]);
  },
};
