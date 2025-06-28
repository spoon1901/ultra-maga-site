// ✅ Flappy Trump — Full Game.js with Pixel Font + Stroke + Scrollable Background + Clean Hitboxes 

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
const db = firebase.database();

let isMuted = false;

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene, LeaderboardScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Helper function for pixel text with stroke
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

// Preload Scene
function PreloadScene() { Phaser.Scene.call(this, { key: 'PreloadScene' }); }
PreloadScene.prototype = Object.create(Phaser.Scene.prototype);
PreloadScene.prototype.constructor = PreloadScene;
PreloadScene.prototype.preload = function () {
    this.load.image('background', 'https://files.catbox.moe/chw14r.png');
    this.load.image('pipe', 'https://files.catbox.moe/7mgltx.png');
    this.load.image('burger', 'https://files.catbox.moe/uif031.png');
    this.load.image('trump', 'https://files.catbox.moe/wlm5xw.png');
    this.load.audio('flap', 'https://files.catbox.moe/2oly9t.mp3');
    this.load.audio('hit', 'https://files.catbox.moe/2v2pm7.mp3');
    this.load.audio('burgerSound', 'https://files.catbox.moe/5c5st7.mp3');
    this.load.audio('bgm', 'https://files.catbox.moe/4eq3qy.mp3');
};
PreloadScene.prototype.create = function () {
    this.scene.start('MenuScene');
};

// Menu Scene
function MenuScene() { Phaser.Scene.call(this, { key: 'MenuScene' }); }
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;
MenuScene.prototype.create = function () {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);

    pixelText(this, 200, 120, 'Flappy Trump', 18);
    pixelText(this, 200, 160, 'Brought to you', 10);
    pixelText(this, 200, 180, 'by Ultra $MAGA', 10);

    const startBtn = pixelText(this, 200, 260, 'Start Game', 14).setInteractive();
    startBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardBtn = pixelText(this, 200, 320, 'Leaderboard', 14).setInteractive();
    leaderboardBtn.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const muteBtn = pixelText(this, 370, 570, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
    });
};
// Game Scene
function GameScene() { Phaser.Scene.call(this, { key: 'GameScene' }); }
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;
GameScene.prototype.create = function () {
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);

    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    if (!isMuted) this.bgm.play();

    this.flapSound = this.sound.add('flap');
    this.hitSound = this.sound.add('hit');
    this.burgerSound = this.sound.add('burgerSound');

    this.trump = this.physics.add.sprite(100, 245, 'trump').setOrigin(0.5);
    this.trump.setSize(50, 50).setOffset(7, 7);
    this.trump.setCollideWorldBounds(true);

    this.input.on('pointerdown', () => {
        this.trump.setVelocityY(-350);
        if (!isMuted) this.flapSound.play();
    });

    this.pipes = this.physics.add.group({ allowGravity: false, immovable: true });
    this.burgers = this.physics.add.group({ allowGravity: false });

    this.score = 0;
    this.scoreText = pixelText(this, 200, 30, 'Score: 0', 14);

    this.timer = this.time.addEvent({
        delay: 1500,
        callback: this.spawnPipes,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(this.trump, this.pipes, this.gameOver, null, this);
    this.physics.add.overlap(this.trump, this.burgers, this.collectBurger, null, this);

    const muteBtn = pixelText(this, 370, 570, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
        if (isMuted) this.bgm.pause();
        else this.bgm.resume();
    });
};

GameScene.prototype.spawnPipes = function () {
    const gap = 160;
    const minPipeY = 100;
    const maxPipeY = 350;

    const topPipeY = Phaser.Math.Between(minPipeY, maxPipeY);
    const bottomPipeY = topPipeY + gap;

    const topPipe = this.pipes.create(400, topPipeY, 'pipe').setOrigin(0, 1).setFlipY(true);
    topPipe.body.velocity.x = -200;
    topPipe.setSize(64, 450).setOffset(0, 0);
    topPipe.scored = false;

    const bottomPipe = this.pipes.create(400, bottomPipeY, 'pipe').setOrigin(0, 0);
    bottomPipe.body.velocity.x = -200;
    bottomPipe.setSize(64, 450).setOffset(0, 0);

    if (Phaser.Math.Between(0, 9) === 0) {
        const burger = this.burgers.create(400, topPipeY + gap / 2, 'burger');
        burger.body.velocity.x = -200;
    }
};

GameScene.prototype.update = function () {
    this.bg.tilePositionX += 0.7;

    this.pipes.children.iterate(pipe => {
        if (!pipe.scored && pipe.x + pipe.width < this.trump.x) {
            pipe.scored = true;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }
    });

    if (this.trump.y > 600 || this.trump.y < 0) {
        this.gameOver();
    }
};

GameScene.prototype.collectBurger = function (trump, burger) {
    if (!isMuted) this.burgerSound.play();
    burger.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
};

GameScene.prototype.gameOver = function () {
    if (!isMuted) this.hitSound.play();
    this.bgm.stop();
    this.scene.start('GameOverScene', { score: this.score });
};
// Game Over Scene
function GameOverScene() { Phaser.Scene.call(this, { key: 'GameOverScene' }); }
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;
GameOverScene.prototype.init = function (data) {
    this.finalScore = data.score;
};
GameOverScene.prototype.create = function () {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);

    pixelText(this, 200, 200, 'Game Over', 18);
    pixelText(this, 200, 250, 'Score: ' + this.finalScore, 14);

    // Save score to Firebase
    db.ref('scores').push({ score: this.finalScore });

    const retryBtn = pixelText(this, 200, 320, 'Retry', 14).setInteractive();
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboardBtn = pixelText(this, 200, 380, 'Leaderboard', 14).setInteractive();
    leaderboardBtn.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const muteBtn = pixelText(this, 370, 570, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
    });
};

// Leaderboard Scene
function LeaderboardScene() { Phaser.Scene.call(this, { key: 'LeaderboardScene' }); }
LeaderboardScene.prototype = Object.create(Phaser.Scene.prototype);
LeaderboardScene.prototype.constructor = LeaderboardScene;
LeaderboardScene.prototype.create = function () {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);
    pixelText(this, 200, 80, 'Leaderboard', 18);

    db.ref('scores').orderByChild('score').limitToLast(5).once('value', snapshot => {
        const scores = [];
        snapshot.forEach(data => {
            scores.push(data.val().score);
        });
        scores.sort((a, b) => b - a);

        scores.forEach((score, index) => {
            pixelText(this, 200, 150 + index * 30, (index + 1) + '. ' + score, 14);
        });
    });

    const startBtn = pixelText(this, 200, 500, 'Start Game', 14).setInteractive();
    startBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const muteBtn = pixelText(this, 370, 570, isMuted ? '🔇' : '🔊', 12).setInteractive();
    muteBtn.on('pointerdown', () => {
        isMuted = !isMuted;
        muteBtn.setText(isMuted ? '🔇' : '🔊');
    });
};
