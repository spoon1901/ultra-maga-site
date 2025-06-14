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

let trump, cursors, pipes, score = 0, scoreText, gameOver = false;
let bg, bg2;
let startText, restartText, music;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('trump', 'https://files.catbox.moe/kbcy6t.png');
  this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
  this.load.image('bg', 'https://files.catbox.moe/chw14r.png');
  this.load.audio('bgm', 'https://files.catbox.moe/4eq3qy.mp3');
}

function create() {
  const screenWidth = this.scale.width;
  const screenHeight = this.scale.height;

  bg = this.add.tileSprite(0, 0, screenWidth, screenHeight, 'bg').setOrigin(0).setScrollFactor(0);

  trump = this.physics.add.sprite(100, screenHeight / 2, 'trump').setScale(0.07);
  trump.body.setSize(trump.width * 0.8, trump.height * 0.8);
  trump.setCollideWorldBounds(true);
  trump.setVisible(false);

  pipes = this.physics.add.group();

  scoreText = this.add.text(screenWidth / 2, screenHeight * 0.05, 'Score: 0', {
    fontSize: '24px',
    fill: '#fff'
  }).setOrigin(0.5).setDepth(10).setVisible(false);

  startText = this.add.text(screenWidth / 2, screenHeight / 2, 'TAP TO START', {
    fontSize: '28px',
    fill: '#ffffff'
  }).setOrigin(0.5).setDepth(10);

  restartText = this.add.text(screenWidth / 2, screenHeight / 2 + 40, 'CLICK TO TRY AGAIN', {
    fontSize: '20px',
    fill: '#ff0000'
  }).setOrigin(0.5).setDepth(10).setVisible(false);

  cursors = this.input.keyboard.createCursorKeys();

  this.input.on('pointerdown', () => {
    if (!trump.visible && !gameOver) {
      startGame.call(this);
    } else if (gameOver) {
      this.scene.restart();
    } else {
      flap();
    }
  });

  this.physics.add.collider(trump, pipes, hitPipe, null, this);

  music = this.sound.add('bgm', { loop: true, volume: 0.3 });
  music.play();
}

function startGame() {
  trump.setVisible(true);
  scoreText.setVisible(true);
  startText.setVisible(false);
  gameOver = false;
  score = 0;
  scoreText.setText('Score: 0');

  this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });
}

function update() {
  if (!gameOver && trump.visible) {
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

    bg.tilePositionX += 1;
  }
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
    pipe.body.setSize(pipe.width * 0.9, pipe.height * 1.0);
  });
}

function hitPipe() {
  if (gameOver) return;
  gameOver = true;
  this.physics.pause();
  restartText.setVisible(true);
}
