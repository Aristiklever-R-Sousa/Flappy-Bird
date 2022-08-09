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

function Barriers(height, width, spread, spaceBetween, notifyPoint) {
  this.pairs = [
    new BarrierPair(height, spread, width),
    new BarrierPair(height, spread, width + spaceBetween),
    new BarrierPair(height, spread, width + spaceBetween * 2),
    new BarrierPair(height, spread, width + spaceBetween * 3),
  ];

  const steps = 3;

  this.animate = () => {
    this.pairs.forEach(pair => {
      pair.setX(pair.getX() - steps);

      if (pair.getX() < -pair.getWidth()) {
        pair.setX(pair.getX() + spaceBetween * this.pairs.length)
        pair.spreadSort();
      }

      const middle = width / 2;
      const crossedMiddle = pair.getX() + steps >= middle && pair.getX() < middle;

      crossedMiddle && notifyPoint();
    });
  }
}



const b = new Barriers(700, 1200, 300, 400);
const gameArea = document.querySelector("[wm-flappy]");

b.pairs.forEach(pair => gameArea.appendChild(pair.element));

setInterval(() => {
  b.animate();

}, 20);
