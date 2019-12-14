export function createElement(tagName, prop, children) {
  const dom = document.createElement(tagName);
  const type = getType(children);
  switch (type) {
    case "Array":
      children.forEach(d => {
        dom.append(d);
      });
      break;
    case "String":
      dom.innerText = children;
      break;
    default:
      dom.append(children);
      break;
  }
  for (let key in prop) {
    const value = prop[key];
    dom.setAttribute(key, value);
  }

  return dom;
}

function getType(obj) {
  return Object.prototype.toString.call(obj).replace(/\[.* (.*?)\]/, "$1");
}
