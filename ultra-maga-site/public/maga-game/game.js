// ULTRA $MAGA Flappy Trump Game 
const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: true }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: { preload, create, update }
};

let trump, cursors, pipes, burgers, scoreText, highScoreText, gameOver = false;
let score = 0;
let highScore = 0;
let startText, restartText, background;
let music;
let pipeTimer;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('trump', 'https://files.catbox.moe/kbcy6t.png');
  this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
  this.load.image('background', 'https://files.catbox.moe/chw14r.png');
  this.load.audio('music', 'https://files.catbox.moe/4eq3qy.mp3');
  this.load.image('burger', 'https://files.catbox.moe/hwbf07.png');
  this.load.audio('burp', 'https://files.catbox.moe/5c5st7.mp3');
  this.load.audio('fired', 'https://files.catbox.moe/2v2pm7.mp3');
  this.load.image('fraudcast', 'https://files.catbox.moe/9g3p2j.png'); // new banner
}

function create() {
  background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0);

  trump = this.physics.add.sprite(100, 300, 'trump').setScale(0.07);
  trump.body.setSize(trump.displayWidth * 1.4, trump.displayHeight * 1.4);
  trump.body.setOffset(-trump.displayWidth * 0.2, -trump.displayHeight * 0.2);
  trump.setCollideWorldBounds(true);
  trump.setVisible(false);
  trump.body.allowGravity = false;

  pipes = this.physics.add.group();
  burgers = this.physics.add.group();

  scoreText = this.add.text(config.width / 2, 20, 'Score: 0', {
    fontSize: '20px', fill: '#fff'
  }).setOrigin(0.5).setDepth(2);

  highScoreText = this.add.text(config.width / 2, 50, 'High: 0', {
    fontSize: '16px', fill: '#ffffff'
  }).setOrigin(0.5).setDepth(2);

  startText = this.add.text(config.width / 2, config.height / 2, 'TAP TO START', {
    fontSize: '28px', fill: '#ffff00'
  }).setOrigin(0.5).setDepth(2);

  this.input.on('pointerdown', () => {
    if (!trump.visible && !gameOver) {
      startGame.call(this);
    } else if (gameOver) {
      restartGame.call(this);
    } else {
      flap();
    }
  });

  cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.collider(trump, pipes, hitPipe, null, this);
  this.physics.add.overlap(trump, burgers, collectBurger, null, this);
}

function startGame() {
  startText.setVisible(false);
  if (restartText) restartText.setVisible(false);
  trump.setVisible(true);
  trump.clearTint();
  trump.body.allowGravity = true;
  trump.setPosition(100, 300);
  trump.setVelocity(0);
  gameOver = false;
  score = 0;
  scoreText.setText('Score: 0');
  highScoreText.setText('High: ' + highScore);
  pipes.clear(true, true);
  burgers.clear(true, true);

  if (music) music.stop();
  music = this.sound.add('music', { loop: true, volume: 0.3 });
  music.play();

  if (pipeTimer) pipeTimer.remove();
  pipeTimer = this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });

  this.physics.resume();
}

function restartGame() {
  startGame.call(this);
}

function flap() {
  trump.setVelocityY(-300);
}

function addPipe() {
  const gap = config.height / 17;
  const y = Phaser.Math.Between(150, config.height - 150);

  // Randomly select either 'pipe' or 'fraudcast'
  const obstacleType = Phaser.Math.Between(0, 1) === 0 ? 'pipe' : 'fraudcast';

  const topPipe = pipes.create(config.width, y - gap, obstacleType).setOrigin(0, 1);
  const bottomPipe = pipes.create(config.width, y + gap, obstacleType).setOrigin(0, 0);

  [topPipe, bottomPipe].forEach(pipe => {
    if (obstacleType === 'fraudcast') {
      pipe.setScale(0.18);
      pipe.body.setSize(pipe.displayWidth * 1.2, pipe.displayHeight * 5.5);
    } else {
      pipe.setScale(0.15);
      pipe.body.setSize(pipe.displayWidth * 1.5, pipe.displayHeight * 6.5);
    }

    pipe.setVelocityX(-200);
    pipe.passed = false;
    pipe.body.allowGravity = false;
    pipe.setImmovable(true);
    pipe.body.setOffset(-pipe.displayWidth * 0.2, -pipe.displayHeight);
    pipe.setDepth(1);
  });

  // Keep your burger logic the same
  if (Phaser.Math.Between(0, 9) === 0) { // 10% chance
    const burgerY = Phaser.Math.Between(y - gap + 30, y + gap - 30);
    const burger = burgers.create(config.width + 30, burgerY, 'burger').setScale(0.07);
    burger.setVelocityX(-200);
    burger.body.allowGravity = false;
    burger.body.setSize(burger.displayWidth * 9, burger.displayHeight * 9);
    burger.body.setOffset(-burger.displayWidth * 2.25, -burger.displayHeight * 2.25);
    burger.setDepth(1);
  }
}


function update() {
  if (gameOver) return;

  background.tilePositionX += 1;

  if (cursors.space && Phaser.Input.Keyboard.JustDown(cursors.space)) {
    flap();
  }

  burgers.getChildren().forEach(burger => {
    if (burger.x < -burger.width) {
      burger.destroy();
    }
  });

  pipes.getChildren().forEach(pipe => {
    if (!pipe.passed && pipe.x + pipe.displayWidth / 2 < trump.x) {
      pipe.passed = true;
      score += 1;
      scoreText.setText('Score: ' + score);
      if (score > highScore) {
        highScore = score;
        highScoreText.setText('High: ' + highScore);
      }
    }
  });
}

function hitPipe() {
  if (gameOver) return;

  gameOver = true;
  this.physics.pause();
  trump.setTint(0xff0000);
  this.sound.play('fired', { volume: 0.5 });

  restartText = this.add.text(config.width / 2, config.height / 2 + 50, 'CLICK TO TRY AGAIN', {
    fontSize: '20px', fill: '#ff0000'
  }).setOrigin(0.5).setDepth(2);

  if (pipeTimer) pipeTimer.remove();
}

function collectBurger(trump, burger) {
  burger.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
  this.sound.play('burp', { volume: 0.5 });
  if (score > highScore) {
    highScore = score;
    highScoreText.setText('High: ' + highScore);
  }
}
