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
let scoreText;
let gameOver = false;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('trump', 'https://files.catbox.moe/kbcy6t.png');
  this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
}

function create() {
  trump = this.physics.add.sprite(100, 300, 'trump').setScale(0.07);

  trump.body.setSize(trump.width * spriteScale, trump.height * spriteScale);
  trump.setCollideWorldBounds(true);

  pipes = this.physics.add.group();

  this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });

  scoreText = this.add.text(16, config.height * 0.05, 'Score: 0', {
  fontSize: `${Math.floor(config.height / 30)}px`,
  fill: '#fff'
});


  this.input.on('pointerdown', flap, this);
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(trump, pipes, hitPipe, null, this);
}

function update() {
  if (gameOver) return;

  if (cursors.space && Phaser.Input.Keyboard.JustDown(cursors.space)) {
    flap.call(this);
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
  const gap = config.height / 4; // Adjusts gap to screen height (e.g. 150 on 600px)


  const topPipe = pipes.create(config.width, y - gap, 'pipe');
  const bottomPipe = pipes.create(config.width, y + gap, 'pipe');


  [topPipe, bottomPipe].forEach(pipe => {
    pipe.setScale(0.15);
    pipe.setVelocityX(-200);
    pipe.passed = false;
    pipe.body.allowGravity = false;
    pipe.setImmovable(true);
    pipe.body.setSize(pipe.width * pipeScale, pipe.height * 1.0);
  });
}

function hitPipe() {
  gameOver = true;
  this.add.text(100, config.height / 2, 'GAME OVER', { fontSize: '32px', fill: '#ff0000' });
  this.physics.pause();
}
