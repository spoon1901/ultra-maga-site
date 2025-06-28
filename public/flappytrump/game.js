// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlvFjps9OwJIhQjajvmneGwB18mYYDCUI",
  authDomain: "flappytrump.firebaseapp.com",
  databaseURL: "https://flappytrump-default-rtdb.firebaseio.com",
  projectId: "flappytrump",
  storageBucket: "flappytrump.appspot.com",
  messagingSenderId: "513580021078",
  appId: "1:513580021078:web:caacd9c4a55acee33712f7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ✅ Global state
let isMuted = false;
let isLoggedIn = false;

// ✅ Helper for pixel text with stroke
function pixelText(scene, x, y, text, size = 16) {
  return scene.add.text(x, y, text, {
    fontFamily: '"Press Start 2P"',
    fontSize: `${size}px`,
    color: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 4,
    align: 'center',
    resolution: 10
  }).setOrigin(0.5);
}

// ✅ Game Config
const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1000 }, debug: false }
  },
  scene: [LoginScene, MenuScene, GameScene, GameOverScene, LeaderboardScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);

//////////////////////////////
// ✅ Login Scene
class LoginScene extends Phaser.Scene {
  constructor() {
    super('LoginScene');
  }

  preload() {
    this.load.image('xLogo', 'https://files.catbox.moe/3j4bd9.png');
  }

  create() {
    this.add.rectangle(200, 300, 400, 600, 0x000000); // Background

    pixelText(this, 200, 500, 'Login with X to Continue', 10);

    const logo = this.add.image(200, 300, 'xLogo').setScale(0.8).setInteractive();

    logo.on('pointerdown', async () => {
      const provider = new firebase.auth.TwitterAuthProvider();
      try {
        await auth.signInWithPopup(provider);
        isLoggedIn = true;
        this.scene.start('MenuScene');
      } catch (error) {
        console.error(error);
      }
    });
  }
}

//////////////////////////////
// ✅ Menu Scene
class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.rectangle(200, 300, 400, 600, 0x000000);

    pixelText(this, 200, 100, 'Flappy Trump', 14);
    pixelText(this, 200, 150, 'Brought to you', 8);
    pixelText(this, 200, 180, 'by Ultra $MAGA', 8);

    const start = pixelText(this, 200, 300, 'Start Game', 10).setInteractive();
    const leaderboard = pixelText(this, 200, 350, 'Leaderboard', 10).setInteractive();

    start.on('pointerdown', () => this.scene.start('GameScene'));
    leaderboard.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    this.createMuteIcon();
  }

  createMuteIcon() {
    const icon = this.add.image(380, 20, isMuted ? 'muteOff' : 'muteOn')
      .setScale(0.5)
      .setOrigin(1, 0)
      .setInteractive();

    icon.on('pointerdown', () => {
      isMuted = !isMuted;
      icon.setTexture(isMuted ? 'muteOff' : 'muteOn');
    });
  }
}

//////////////////////////////
// ✅ Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('trump', 'https://files.catbox.moe/wlm5xw.png');
    this.load.image('pipe', 'https://files.catbox.moe/7mgltx.png');
    this.load.image('background', 'https://files.catbox.moe/k7n7fa.png');
    this.load.image('muteOn', 'https://files.catbox.moe/plr5pn.png');
    this.load.image('muteOff', 'https://files.catbox.moe/i3u2ci.png');
  }

  create() {
    this.bg = this.add.tileSprite(200, 300, 400, 600, 'background');

    this.player = this.physics.add.sprite(100, 300, 'trump').setScale(1);
    this.player.setCollideWorldBounds(true);

    this.pipes = this.physics.add.group();

    this.input.on('pointerdown', this.flap, this);

    this.score = 0;
    this.scoreText = pixelText(this, 200, 50, 'Score: 0', 10);

    this.time.addEvent({ delay: 1500, callback: this.addPipe, callbackScope: this, loop: true });

    this.createMuteIcon();

    this.physics.add.overlap(this.player, this.pipes, this.gameOver, null, this);
  }

  update() {
    this.bg.tilePositionX += 2;

    if (this.player.y > 600) {
      this.gameOver();
    }
  }

  flap() {
    this.player.setVelocityY(-350);
  }

  addPipe() {
    const gap = Phaser.Math.Between(120, 200);
    const y = Phaser.Math.Between(100, 400);

    const topPipe = this.pipes.create(400, y - gap / 2 - 320, 'pipe').setOrigin(0, 1).setImmovable();
    const bottomPipe = this.pipes.create(400, y + gap / 2, 'pipe').setOrigin(0, 0).setImmovable();

    topPipe.body.velocity.x = -200;
    bottomPipe.body.velocity.x = -200;

    topPipe.checkWorldBounds = true;
    bottomPipe.checkWorldBounds = true;

    topPipe.outOfBoundsKill = true;
    bottomPipe.outOfBoundsKill = true;

    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
  }

  createMuteIcon() {
    const icon = this.add.image(380, 20, isMuted ? 'muteOff' : 'muteOn')
      .setScale(0.5)
      .setOrigin(1, 0)
      .setInteractive();

    icon.on('pointerdown', () => {
      isMuted = !isMuted;
      icon.setTexture(isMuted ? 'muteOff' : 'muteOn');
    });
  }

  gameOver() {
    db.ref('scores').push(this.score);
    this.scene.start('GameOverScene', { score: this.score });
  }
}

//////////////////////////////
// ✅ Game Over Scene
class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    this.add.rectangle(200, 300, 400, 600, 0x000000);

    pixelText(this, 200, 150, 'Game Over', 14);
    pixelText(this, 200, 230, 'Score: ' + this.score, 10);

    const retry = pixelText(this, 200, 320, 'Retry', 10).setInteractive();
    const leaderboard = pixelText(this, 200, 370, 'Leaderboard', 10).setInteractive();

    retry.on('pointerdown', () => this.scene.start('GameScene'));
    leaderboard.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    this.createMuteIcon();
  }

  createMuteIcon() {
    const icon = this.add.image(380, 20, isMuted ? 'muteOff' : 'muteOn')
      .setScale(0.5)
      .setOrigin(1, 0)
      .setInteractive();

    icon.on('pointerdown', () => {
      isMuted = !isMuted;
      icon.setTexture(isMuted ? 'muteOff' : 'muteOn');
    });
  }
}

//////////////////////////////
// ✅ Leaderboard Scene
class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('LeaderboardScene');
  }

  create() {
    this.add.rectangle(200, 300, 400, 600, 0x000000);

    pixelText(this, 200, 80, 'Leaderboard', 14);

    db.ref('scores').orderByValue().limitToLast(5).once('value', snapshot => {
      const scores = Object.values(snapshot.val() || {}).sort((a, b) => b - a);
      scores.forEach((score, i) => {
        pixelText(this, 200, 150 + i * 50, `${i + 1}. ${score}`, 10);
      });
    });

    const back = pixelText(this, 200, 500, 'Back', 10).setInteractive();
    back.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
