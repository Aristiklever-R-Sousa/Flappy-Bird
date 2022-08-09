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

function Bird(gameHeight) {
  let flyng = false;

  this.element = newElement('img', 'bird');
  this.element.src = "imgs/passaro.png";

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (yPos) => this.element.style.bottom = `${yPos}px`;

  // Tecla clicada
  window.onkeydown = (e) => flyng = true;
  // Soltou a tecla
  window.onkeyup = (e) => flyng = false;

  this.animate = () => {
    const newY = this.getY() + (flyng ? 8 : -5);
    const maxHeight = gameHeight - this.element.clientHeight;

    if (newY <= 0)
      this.setY = 0;
    else if (newY >= maxHeight)
      this.setY(maxHeight);
    else
      this.setY(newY);
  }

  this.setY(gameHeight / 2);
}

const b = new Barriers(700, 1200, 300, 400);
const bird = new Bird(700);
const gameArea = document.querySelector("[wm-flappy]");

gameArea.appendChild(bird.element);
b.pairs.forEach(pair => gameArea.appendChild(pair.element));

setInterval(() => {
  b.animate();
  bird.animate();
}, 20);
