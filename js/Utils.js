const newElement = (tag, classes = [], text = '', attributes = {}) => {
  const element = document.createElement(tag);
  
  classes.forEach(className => element.classList.add(className));
  if (text) element.innerText = text;
  Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
  
  return element;
}

const appendElements = (parent, elements) => {
  elements.forEach(element => parent.appendChild(element));
}

const newDiv = (classes = [],  children = [], attributes = {}) => {
  let div = newElement('div', classes, '', attributes);
  if (children) appendElements(div, children);
  return div;
}

const newText = (text, classes = [], attributes = {}) => {
  return newElement('span', classes, text, attributes);
}

const removeClass = (className, elements) => {
  elements.forEach(element => element.classList.remove(className));
}

const normaliseCondition = (condition) => {
  let cond = condition;
  if (typeof condition === 'function') cond = condition();
  
  return cond;
}

const addClassIf = (className, condition, elements) => {
  let cond = normaliseCondition(condition);

  elements.forEach(element => cond ? element.classList.add(className) : element.classList.remove(className));
}

const addAttributeIf = (attribute, value, condition, elements) => {
  let cond = normaliseCondition(condition);

  elements.forEach(element => {
    if (cond) {
      element.setAttribute(attribute, value)
    } else {
      element.removeAttribute(attribute)
    }
  });
}

const hasClass = (className, elements) => {
  return elements.some(element => element.classList.contains(className));
}

const modifyStyleIf = (attribute, value, elseValue, condition, elements) => {
  elements.forEach(element => {
    if (condition) {
      element.style[attribute] = value(element)
    } else {
      element.style[attribute] = elseValue(element)
    }
  });
}

const clearElementChildren = (target) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild)
  }
}

const anyParentHasClass = (el, className) => {
  // recursively check if any parent has the class
  if (el.classList.contains(className)) {
    return true
  }

  if (el.parentElement) {
    return anyParentHasClass(el.parentElement, className)
  }
  
  return false
}

const anyChildHasClass = (el, className) => {
  // recursively check if any child has the class
  if (el.classList.contains(className)) {
    return true
  }

  if (el.firstChild) {
    return anyChildHasClass(el.firstChild, className)
  }
  
  return false
}
