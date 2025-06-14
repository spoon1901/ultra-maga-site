const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update
  }
};

let trump;
let cursors;
let pipes;
let score = 0;
let highScore = 0;
let scoreText;
let highScoreText;
let gameOver = false;
let gameStarted = false;
let startText;
let restartText;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('trump', 'https://files.catbox.moe/kbcy6t.png');
  this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
  this.load.image('background', 'https://files.catbox.moe/chw14r.png');
}

function create() {
  gameOver = false;
  gameStarted = false;
  score = 0;

  // Background scroll layer
  this.bg = this.add.tileSprite(0, 0, config.width, config.height, 'background')
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(-10);

  startText = this.add.text(config.width / 2, config.height / 2, 'Tap to Start', {
    fontSize: '32px',
    fill: '#ffffff'
  }).setOrigin(0.5);

  restartText = this.add.text(config.width / 2, config.height / 2 + 50, 'Click to Try Again', {
    fontSize: '24px',
    fill: '#ffffff'
  }).setOrigin(0.5).setVisible(false);

  highScore = localStorage.getItem('highScore') || 0;

  scoreText = this.add.text(config.width / 2, 20, 'Score: 0', {
    fontSize: '28px',
    fill: '#fff'
  }).setOrigin(0.5).setDepth(10);

  highScoreText = this.add.text(config.width / 2, 55, 'High Score: ' + highScore, {
    fontSize: '18px',
    fill: '#fff'
  }).setOrigin(0.5).setDepth(10);

  trump = this.physics.add.sprite(100, 300, 'trump').setScale(0.07);
  trump.body.setSize(trump.width * 0.07, trump.height * 0.07);
  trump.setCollideWorldBounds(true);
  trump.setVisible(false);
  trump.body.allowGravity = false;

  pipes = this.physics.add.group();

  this.input.on('pointerdown', () => {
    if (!gameStarted && !gameOver) {
      startGame.call(this);
    } else if (gameOver) {
      this.scene.restart();
    } else {
      flap();
    }
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function startGame() {
  gameStarted = true;
  startText.setVisible(false);
  trump.setVisible(true);
  trump.setActive(true);
  trump.setVelocityY(0);
  trump.body.allowGravity = true;

  this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });

  this.physics.add.collider(trump, pipes, hitPipe, null, this);
}

function update() {
  if (gameStarted && !gameOver) {
    this.bg.tilePositionX += 1.5;
  }

  if (!gameStarted || gameOver) return;

  if (cursors.space && Phaser.Input.Keyboard.JustDown(cursors.space)) {
    flap();
  }

  pipes.getChildren().forEach(pipe => {
    if (pipe.x < trump.x && !pipe.passed) {
      score += 1;
      pipe.passed = true;
      scoreText.setText('Score: ' + score);
    }
  });
}

function flap() {
  trump.setVelocityY(-300);
}

function addPipe() {
  const minY = 100;
  const maxY = config.height - 100;
  const y = Phaser.Math.Between(minY, maxY);
  const gap = config.height / 4;

  const topPipe = pipes.create(config.width, y - gap, 'pipe');
  const bottomPipe = pipes.create(config.width, y + gap, 'pipe');

  [topPipe, bottomPipe].forEach(pipe => {
    pipe.setScale(0.15);
    pipe.setVelocityX(-200);
    pipe.passed = false;
    pipe.body.allowGravity = false;
    pipe.setImmovable(true);
    pipe.body.setSize(pipe.width * 0.15, pipe.height * 1.0);
  });
}

function hitPipe() {
  this.physics.pause();

  gameOver = true;
  gameStarted = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreText.setText('High Score: ' + highScore);
  }

  this.add.text(config.width / 2, config.height / 2, 'GAME OVER', {
    fontSize: '32px',
    fill: '#ff0000'
  }).setOrigin(0.5).setDepth(10);

  restartText.setVisible(true);
}
