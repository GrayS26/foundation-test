// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var engine;
var render;

// bodies
var blocks = [];
var walls = [];
var ground;

// DOM elements
var hBlocks = document.getElementsByClassName("anarchy");
var pinkFooter = document.querySelector(".pink-footer");

function Box(x, y, w, h) {
  var options = {
    density: 0.00005,
    friction: 0.5,
    restitution: 0
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  var xVel = 10 * Math.random() - 5;
  Body.setVelocity(this.body, { x: xVel, y: 0 });
  World.add(engine.world, [this.body]);
}

function setup() {
  engine = Engine.create();
  engine.world.gravity.y = 0.5;

  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      showAngleIndicator: true
    }
  });
  Render.run(render);
}

function startMatterAnimation() {
  // Ініціалізуємо engine і світ перед створенням об'єктів Box
  engine = Engine.create();
  engine.world.gravity.y = 0.5;
  setup();

  // Отримуємо висоту блока pinkFooter
  var pinkFooterHeight = pinkFooter.offsetHeight;

  for (var i = 0; i < hBlocks.length; i++) {
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    
    var startHeight = y;
    if (hBlocks[i].classList.contains("prio1")) {
      startHeight += -1500;
    }
    if (hBlocks[i].classList.contains("block")) {
      blocks.push(new Box(x, startHeight, hBlocks[i].offsetWidth, hBlocks[i].offsetHeight));
    }
  }
// Отримуємо висоту блока pinkFooter
var pinkFooterHeight = pinkFooter.offsetHeight;
var pinkFooterWidth = document.querySelector('.pink-footer__container').offsetWidth;

// Встановлюємо розміри та положення ground і ceiling
  ground = Bodies.rectangle(window.innerWidth / 2, pinkFooterHeight * 0.97, window.innerWidth, 50, { isStatic: true }); // Міняємо положення ground
  ceiling = Bodies.rectangle(10000, 10050, pinkFooterWidth, 60, { isStatic: true });
  walls[0] = Bodies.rectangle(-520, pinkFooterHeight / 2, 1000, pinkFooterHeight * 20, { isStatic: true });
  walls[1] = Bodies.rectangle(pinkFooterWidth - 60, pinkFooterHeight / 2, 120, pinkFooterHeight * 20, { isStatic: true });

  World.add(engine.world, [ground, ceiling, walls[0], walls[1]]);

  // Додаємо обробник для анімації
  function render() {
    Engine.update(engine, 20);
    Body.setPosition(walls[1], { x: document.body.clientWidth + 50, y: 0 });
    for (var i = 0; i < blocks.length; i++) {
      var xTrans = blocks[i].body.position.x - hBlocks[i].offsetWidth / 2;
      var yTrans = blocks[i].body.position.y - hBlocks[i].offsetHeight / 2;
      hBlocks[i].style.transform = "translate(" + xTrans + "px, " + yTrans + "px) rotate(" + blocks[i].body.angle + "rad)";
      hBlocks[i].style.visibility = "visible";
    }
    window.requestAnimationFrame(render);
  }

  // Запускаємо анімацію
  render();
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function updateBlockVisibility() {
  for (var i = 0; i < hBlocks.length; i++) {
    if (isElementInViewport(hBlocks[i]) && isElementInViewport(pinkFooter)) {
      hBlocks[i].classList.add("fall");
    } else {
      hBlocks[i].classList.remove("fall");
    }
  }
}

window.addEventListener("scroll", updateBlockVisibility);

// Ініціалізуємо видимість елементів на початку
updateBlockVisibility();

// Додаємо обробник, щоб запустити анімацію, коли pinkFooter буде видимим
var observer = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    startMatterAnimation();
    observer.disconnect();
  }
});

observer.observe(pinkFooter);
