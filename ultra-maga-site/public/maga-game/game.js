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
  scene: [LeaderboardScene, GameScene]
};



let highScore = 0;

function LeaderboardScene() {}

LeaderboardScene.prototype.preload = function () {
  this.load.image('background', 'https://files.catbox.moe/chw14r.png');
};

LeaderboardScene.prototype.create = function () {
  const scene = this;

  this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0);

  this.add.text(config.width / 2, 30, 'Ultra $MAGA Leaderboard', {
    fontSize: '20px', fill: '#ffff00'
  }).setOrigin(0.5);

  this.add.text(config.width / 2, 60, `Wallet: ${window.walletAddress}`, {
    fontSize: '12px', fill: '#ffffff'
  }).setOrigin(0.5);

  const yourScoreText = this.add.text(config.width / 2, 85, 'Your High Score: ...', {
    fontSize: '14px', fill: '#ffffff'
  }).setOrigin(0.5);

  const leaderboardTitle = this.add.text(config.width / 2, 110, '🏆 Top Scores 🏆', {
    fontSize: '16px', fill: '#ffffff'
  }).setOrigin(0.5);

  const leaderboardText = this.add.text(config.width / 2, 130, 'Loading...', {
    fontSize: '14px', fill: '#ffffff'
  }).setOrigin(0.5);

  const startButton = this.add.text(config.width / 2, config.height - 80, '▶️ Start Game', {
    fontSize: '24px', fill: '#00ff00', backgroundColor: '#000'
  })
    .setOrigin(0.5)
    .setPadding(10)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.scene.start('GameScene');
    });

  window.getHighScore((scoreFromDB) => {
    highScore = scoreFromDB || 0;
    yourScoreText.setText('Your High Score: ' + highScore);
  });

  window.db.ref('users').once('value').then((snapshot) => {
    const data = snapshot.val() || {};
    const leaderboardArray = Object.keys(data).map(wallet => ({
      wallet,
      score: data[wallet].highscore || 0
    }));

    leaderboardArray.sort((a, b) => b.score - a.score);

    const top5 = leaderboardArray.slice(0, 5);

    const display = top5.map((entry, index) =>
      `${index + 1}. ${entry.wallet.slice(0, 5)}...${entry.wallet.slice(-4)} — ${entry.score}`
    ).join('\n');

    leaderboardText.setText(display || 'No scores yet.');
  });
};

function GameScene() {}

GameScene.prototype.preload = function () {
  this.load.image('trump', 'https://files.catbox.moe/kbcy6t.png');
  this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
  this.load.image('background', 'https://files.catbox.moe/chw14r.png');
  this.load.audio('music', 'https://files.catbox.moe/4eq3qy.mp3');
  this.load.image('burger', 'https://files.catbox.moe/hwbf07.png');
  this.load.audio('burp', 'https://files.catbox.moe/5c5st7.mp3');
  this.load.audio('fired', 'https://files.catbox.moe/2v2pm7.mp3');
  this.load.image('fraudcast', 'https://files.catbox.moe/9g3p2j.png');
};

GameScene.prototype.create = function () {
  this.gameOver = false;
  this.score = 0;

  this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0);

  this.trump = this.physics.add.sprite(100, 300, 'trump').setScale(0.07);
  this.trump.body.setSize(this.trump.displayWidth * 1.4, this.trump.displayHeight * 1.4);
  this.trump.body.setOffset(-this.trump.displayWidth * 0.2, -this.trump.displayHeight * 0.2);
  this.trump.setCollideWorldBounds(true);
  this.trump.setVisible(false);
  this.trump.body.allowGravity = false;

  this.pipes = this.physics.add.group();
  this.burgers = this.physics.add.group();

  this.scoreText = this.add.text(config.width / 2, 20, 'Score: 0', {
    fontSize: '20px', fill: '#fff'
  }).setOrigin(0.5).setDepth(2);

  this.highScoreText = this.add.text(config.width / 2, 50, 'High: ' + highScore, {
    fontSize: '16px', fill: '#ffffff'
  }).setOrigin(0.5).setDepth(2);

  this.startText = this.add.text(config.width / 2, config.height / 2, 'TAP TO START', {
    fontSize: '28px', fill: '#ffff00'
  }).setOrigin(0.5).setDepth(2);

  this.input.on('pointerdown', () => {
    if (!this.trump.visible && !this.gameOver) {
      this.startGame();
    } else if (this.gameOver) {
      this.restartGame();
    } else {
      this.flap();
    }
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.collider(this.trump, this.pipes, () => this.hitPipe());
  this.physics.add.overlap(this.trump, this.burgers, (trump, burger) => this.collectBurger(burger));

  window.getHighScore((scoreFromDB) => {
    highScore = scoreFromDB || 0;
    this.highScoreText.setText('High: ' + highScore);
  });
};

GameScene.prototype.startGame = function () {
  if (this.restartText) this.restartText.setVisible(false);
  this.startText.setVisible(false);
  this.trump.setVisible(true);
  this.trump.clearTint();
  this.trump.body.allowGravity = true;
  this.trump.setPosition(100, 300);
  this.trump.setVelocity(0);
  this.gameOver = false;
  this.score = 0;
  this.scoreText.setText('Score: 0');
  this.highScoreText.setText('High: ' + highScore);
  this.pipes.clear(true, true);
  this.burgers.clear(true, true);

  if (this.music) this.music.stop();
  this.music = this.sound.add('music', { loop: true, volume: 0.3 });
  this.music.play();

  if (this.pipeTimer) this.pipeTimer.remove();
  this.pipeTimer = this.time.addEvent({
    delay: 1500,
    callback: () => this.addPipe(),
    callbackScope: this,
    loop: true
  });

  this.physics.resume();
};

GameScene.prototype.restartGame = function () {
  this.startGame();
};

GameScene.prototype.flap = function () {
  this.trump.setVelocityY(-300);
};

GameScene.prototype.addPipe = function () {
  const gap = config.height / 17;
  const y = Phaser.Math.Between(150, config.height - 150);

  const obstacleType = Phaser.Math.Between(0, 1) === 0 ? 'pipe' : 'fraudcast';

  const topPipe = this.pipes.create(config.width, y - gap, obstacleType).setOrigin(0, 1);
  const bottomPipe = this.pipes.create(config.width, y + gap, obstacleType).setOrigin(0, 0);

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

  if (Phaser.Math.Between(0, 9) === 0) {
    const burgerY = Phaser.Math.Between(y - gap + 30, y + gap - 30);
    const burger = this.burgers.create(config.width + 30, burgerY, 'burger').setScale(0.07);
    burger.setVelocityX(-200);
    burger.body.allowGravity = false;
    burger.body.setSize(burger.displayWidth * 9, burger.displayHeight * 9);
    burger.body.setOffset(-burger.displayWidth * 2.25, -burger.displayHeight * 2.25);
    burger.setDepth(1);
  }
};

GameScene.prototype.update = function () {
  if (this.gameOver) return;

  this.background.tilePositionX += 1;

  if (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
    this.flap();
  }

  this.burgers.getChildren().forEach(burger => {
    if (burger.x < -burger.width) {
      burger.destroy();
    }
  });

  this.pipes.getChildren().forEach(pipe => {
    if (!pipe.passed && pipe.x + pipe.displayWidth / 2 < this.trump.x) {
      pipe.passed = true;
      this.score += 1;
      this.scoreText.setText('Score: ' + this.score);
      if (this.score > highScore) {
        highScore = this.score;
        this.highScoreText.setText('High: ' + highScore);
        window.updateHighScore(highScore);
      }
    }
  });
};

GameScene.prototype.hitPipe = function () {
  if (this.gameOver) return;

  this.gameOver = true;
  this.physics.pause();
  this.trump.setTint(0xff0000);
  this.sound.play('fired', { volume: 0.5 });

  this.restartText = this.add.text(config.width / 2, config.height / 2 + 50, 'CLICK TO TRY AGAIN', {
    fontSize: '20px', fill: '#ff0000'
  }).setOrigin(0.5).setDepth(2);

  if (this.pipeTimer) this.pipeTimer.remove();
};

GameScene.prototype.collectBurger = function (burger) {
  burger.destroy();
  this.score += 10;
  this.scoreText.setText('Score: ' + this.score);
  this.sound.play('burp', { volume: 0.5 });
  if (this.score > highScore) {
    highScore = this.score;
    this.highScoreText.setText('High: ' + highScore);
    window.updateHighScore(highScore);
  }
};
