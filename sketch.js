var START = 2;
var PLAY = 1;
var END = 0;
var gameState = 2;

var man, man2, runningMan, fracturedMan;
var ground, groundImage;
var moneyGroup, moneyImage;
var treasureBoxGroup, treasureBoxImage;
var obstacleGroup, obstacleImage1, obstacleImage2, obstacleImage3;
var cloudGroup, cloud1, cloud2, cloud3;

var score = 0;

function preload() {
  runningMan = loadAnimation('running_man1.png', 'running_man2.png', 'running_man3.png', 'running_man4.png', 'running_man5.png', 'running_man6.png', 'running_man7.png', 'running_man8.png', 'running_man9.png');
  fracturedMan = loadAnimation("fractured.png");

  groundImage = loadImage('ground.png');

  obstacleImage1 = loadImage('obstacle1.png');
  obstacleImage2 = loadImage('obstacle2.png');
  obstacleImage3 = loadImage('obstacle3.png');

  moneyImage = loadImage('money.png');

  treasureBoxImage = loadImage('treasure_box.png');

  cloud1 = loadImage("cloud1.png");
  cloud2 = loadImage("cloud2.png");
  cloud3 = loadImage("cloud3.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  man = createSprite(90, windowHeight - 80, 20, 20);
  man.addAnimation('running', runningMan);
  man.scale = 2;

  man2 = createSprite(windowWidth / 2 - 150, windowHeight / 2, 10, 10);
  man2.addAnimation("fractured", fracturedMan);
  man2.scale = 0.2;
  man2.visible = false;

  ground = createSprite(windowWidth / 2, windowHeight - 4, 400, 20);
  ground.addImage(groundImage);
  ground.scale = 1;
  ground.visible = true;

  man.depth = ground.depth;
  man.depth = ground.depth + 1;

  invisibleGround = createSprite(300, windowHeight - 5, 600, 20);
  invisibleGround.visible = false;

  cloudGroup = createGroup();
  obstacleGroup = createGroup();
  moneyGroup = createGroup();
  treasureBoxGroup = createGroup();
}

function draw() {
  background('white');
  // text(mouseX + ',' + mouseY, mouseX, mouseY);

  if (gameState === START) {
    fill('orange');
    textSize(50);
    textFont('Comic Sans MS');
    text('RUN, EARN!!', windowWidth / 2 - 80, windowHeight / 2);
    fill('black');
    text('Press space to start', windowWidth / 2 - 160, windowHeight / 2 + 50);
    if (keyDown('space')) {
      gameState = PLAY;
    }
  } else if (gameState === PLAY) {
    man.visible = true;
    man2.visible = false;

    fill("red");
    textSize(15);
    text("Money collected : " + score, windowWidth - 160, windowHeight - 580);

    ground.velocityX = -4;

    if (ground.x < width) {
      ground.x = width / 2;
    }

    if (touches.length < 0 || keyDown('space') && man.y >= windowHeight - 220) {
      man.velocityY = -8;
      touches = [];
    }

    if (frameCount % 200 === 0) {
      var rand = Math.round(random(1, 2));
      switch (rand) {
        case 1:
          spawnObstacle();
          break;
        case 2:
          spawnMoney();
          break;
        default:
          break;
      }
    }

    if (moneyGroup.isTouching(man)) {
      score = score + 100;
      moneyGroup.destroyEach();
    }

    if (treasureBoxGroup.isTouching(man)) {
      score = score + 200;
      treasureBoxGroup.destroyEach();
    }

    if (obstacleGroup.isTouching(man)) {
      gameState = END;
    }

    spawnCloud();
    spawnTreasure();

    man.velocityY = man.velocityY + 0.6;
  } else if (gameState === END) {
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach = 0;
    moneyGroup.setVelocityXEach = 0;
    treasureBoxGroup.setVelocityXEach = 0;
    obstacleGroup.setVelocityXEach = 0;

    cloudGroup.setLifetimeEach = -1;
    moneyGroup.setLifetimeEach = -1;
    treasureBoxGroup.setLifetimeEach = -1;
    obstacleGroup.setLifetimeEach = -1;

    moneyGroup.destroyEach();
    cloudGroup.destroyEach();
    treasureBoxGroup.destroyEach();
    obstacleGroup.destroyEach();

    man.visible = false;
    man2.visible = true;

    fill('black');
    textSize(20);
    text('YOU FRACTURED YOUR LEG...', windowWidth/2 - 80, windowHeight/2 - 60);

    fill('red');
    text('press space to start...', windowWidth/2 - 40, windowHeight/2 - 20);

    if (keyDown("space")) {
      gameState = PLAY;
      score = 0;
    }
  }

  man.collide(invisibleGround);

  drawSprites();
}

function spawnCloud() {
  if (frameCount % 400 === 0) {
    var cloud = createSprite(windowWidth, Math.round(random(windowHeight - windowHeight, windowHeight - 400)), 20, 20);
    cloud.velocityX = -2;
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        cloud.addImage(cloud1);
        break;
      case 2:
        cloud.addImage(cloud2);
        break;
      case 3:
        cloud.addImage(cloud3);
        break;
      default:
        break;
    }
    cloud.scale = 0.4;
    cloud.lifetime = windowWidth/2;
    cloud.depth = man.depth;
    man.depth = cloud.depth + 1;
    cloudGroup.add(cloud);
  }
}

function spawnObstacle() {
  var obstacle = createSprite(windowWidth + 20, windowHeight - 60, 10, 30);
  obstacle.velocityX = -3;

  //generate random obstacles
  var rand = Math.round(random(1, 3));
  switch (rand) {
    case 1:
      obstacle.addImage(obstacleImage1);
      break;
    case 2:
      obstacle.addImage(obstacleImage2);
      break;
    case 3:
      obstacle.addImage(obstacleImage3);
      break;
    default:
      break;
  }
  obstacle.scale = 0.5;
  obstacle.lifetime = 220;
  obstacle.depth = man.depth;
  man.depth = obstacle.depth + 1;
  obstacleGroup.add(obstacle);

}

function spawnMoney() {
  var money = createSprite(windowWidth + 20, windowHeight - 60, 10, 30);
  money.velocityX = -3;
  money.addImage(moneyImage);
  money.lifetime = 220;
  money.scale = 0.3;
  moneyGroup.add(money);
}

function spawnTreasure() {
  if (frameCount % 440 === 0) {
    var treasure = createSprite(windowWidth + 20, windowHeight - 60, 10, 30);
    treasure.velocityX = -3;
    treasure.addImage(treasureBoxImage);
    treasure.scale = 0.4;
    treasure.lifetime = 220;
    treasureBoxGroup.add(treasure);
    treasure.depth = ground.depth;
    treasure.depth = ground.depth + 1;
  }
}
