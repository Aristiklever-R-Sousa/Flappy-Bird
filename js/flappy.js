const newElement = (tagName, className) => {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
};

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier");

  const border = newElement("div", "border");
  const body = newElement("div", "body");

  this.element.appendChild(reverse ? body : border);
  this.element.appendChild(reverse ? border : body);

  this.setHeight = height => body.style.height = `${height}px`;
}

function BarrierPair(height, spread, xPosition) {
  this.element = newElement("div", "barrier-pair");

  this.superior = new Barrier(true);
  this.inferior = new Barrier();

  this.element.appendChild(this.superior.element);
  this.element.appendChild(this.inferior.element);

  this.spreadSort = () => {
    const supeiorHeight = Math.random() * (height - spread);
    const inferiorHeight = height - spread - supeiorHeight;

    this.superior.setHeight(supeiorHeight);
    this.inferior.setHeight(inferiorHeight);
  }

  this.getX = () => parseInt(this.element.style.left.split('px')[0]);
  this.setX = xPos => this.element.style.left = `${xPos}px`;

  this.getWidth = () => this.element.clientWidth;

  this.spreadSort();
  this.setX(xPosition);
}

const b = new BarrierPair(700, 300, 400);
console.log(b.element);
document.querySelector("[wm-flappy]").appendChild(b.element);
