const firebaseConfig = {
    apiKey: "AIzaSyBlvFjps90wJtHQjajvmneGwB18mYYDCUI",
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
let isLoggedIn = false;

// Phaser Game Config
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [LoginScene, PreloadScene, MenuScene, GameScene, GameOverScene, LeaderboardScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// ✅ Pixel Text Function
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

// ✅ Login Scene
function LoginScene() {
    Phaser.Scene.call(this, { key: 'LoginScene' });
}
LoginScene.prototype = Object.create(Phaser.Scene.prototype);
LoginScene.prototype.constructor = LoginScene;

LoginScene.prototype.preload = function () {
    this.load.image('xlogo', 'https://files.catbox.moe/asvbfq.png');
};

LoginScene.prototype.create = function () {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    pixelText(this, centerX, centerY + 100, 'Login with X to Continue', 10);

    const xLogo = this.add.image(centerX, centerY, 'xlogo')
        .setScale(0.5)
        .setInteractive({ useHandCursor: true });

    xLogo.on('pointerdown', () => {
        isLoggedIn = true;
        this.scene.start('MenuScene');
    });
};

// ✅ Other Scenes (Preload, Menu, Game, GameOver, Leaderboard)
function PreloadScene() { Phaser.Scene.call(this, { key: 'PreloadScene' }); }
PreloadScene.prototype = Object.create(Phaser.Scene.prototype);
PreloadScene.prototype.constructor = PreloadScene;
PreloadScene.prototype.preload = function () {
    this.load.image('bg', 'your_background_url_here');
    this.load.image('pipe', 'your_pipe_url_here');
    this.load.image('trump', 'your_trump_sprite_url_here');
    this.load.image('soundon', 'https://files.catbox.moe/plr5pn.png');
    this.load.image('soundoff', 'https://files.catbox.moe/i3u2ci.png');
};
PreloadScene.prototype.create = function () {
    this.scene.start('MenuScene');
};

// 🚀 MenuScene
function MenuScene() { Phaser.Scene.call(this, { key: 'MenuScene' }); }
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;
MenuScene.prototype.create = function () {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.image(centerX, centerY, 'bg');

    pixelText(this, centerX, centerY - 100, 'Flappy Trump', 16);
    pixelText(this, centerX, centerY - 60, 'Brought to you', 8);
    pixelText(this, centerX, centerY - 40, 'by Ultra $MAGA', 8);

    const start = pixelText(this, centerX, centerY + 20, 'Start Game', 10).setInteractive();
    start.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboard = pixelText(this, centerX, centerY + 60, 'Leaderboard', 10).setInteractive();
    leaderboard.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    createMuteButton(this, this.scale.width - 20, 20);
};

// 🚀 GameScene
function GameScene() { Phaser.Scene.call(this, { key: 'GameScene' }); }
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;
GameScene.prototype.create = function () {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.image(centerX, centerY, 'bg');

    this.score = 0;
    this.scoreText = pixelText(this, centerX, 30, 'Score: 0', 10);

    this.trump = this.physics.add.sprite(100, 245, 'trump');
    this.trump.setCollideWorldBounds(true);
    this.trump.setSize(30, 20).setOffset(2, 2);

    this.input.on('pointerdown', () => {
        this.trump.setVelocityY(-350);
    });

    this.pipes = this.physics.add.group();

    this.time.addEvent({
        delay: 1500,
        callback: this.spawnPipes,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(this.trump, this.pipes, this.hitPipe, null, this);

    createMuteButton(this, this.scale.width - 20, 20);
};

GameScene.prototype.spawnPipes = function () {
    const gap = 120;
    const topHeight = Phaser.Math.Between(50, this.scale.height - gap - 50);
    const bottomY = topHeight + gap + 160;

    const topPipe = this.pipes.create(400, topHeight, 'pipe').setOrigin(0, 1);
    topPipe.setImmovable(true);
    topPipe.body.allowGravity = false;
    topPipe.setVelocityX(-200);

    const bottomPipe = this.pipes.create(400, bottomY, 'pipe').setOrigin(0, 0);
    bottomPipe.setImmovable(true);
    bottomPipe.body.allowGravity = false;
    bottomPipe.setVelocityX(-200);
};

GameScene.prototype.update = function () {
    this.pipes.getChildren().forEach(pipe => {
        if (pipe.x < -50) {
            pipe.destroy();
            this.score += 1;
            this.scoreText.setText(`Score: ${this.score}`);
        }
    });
};

GameScene.prototype.hitPipe = function () {
    db.ref('leaderboard').push({ score: this.score });
    this.scene.start('GameOverScene', { score: this.score });
};

// 🚀 GameOverScene
function GameOverScene() { Phaser.Scene.call(this, { key: 'GameOverScene' }); }
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;
GameOverScene.prototype.init = function (data) {
    this.finalScore = data.score;
};
GameOverScene.prototype.create = function () {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.image(centerX, centerY, 'bg');

    pixelText(this, centerX, centerY - 80, 'Game Over', 16);
    pixelText(this, centerX, centerY - 40, `Score: ${this.finalScore}`, 12);

    const retry = pixelText(this, centerX, centerY + 20, 'Retry', 10).setInteractive();
    retry.on('pointerdown', () => this.scene.start('GameScene'));

    const leaderboard = pixelText(this, centerX, centerY + 60, 'Leaderboard', 10).setInteractive();
    leaderboard.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    createMuteButton(this, this.scale.width - 20, 20);
};

// 🚀 LeaderboardScene
function LeaderboardScene() { Phaser.Scene.call(this, { key: 'LeaderboardScene' }); }
LeaderboardScene.prototype = Object.create(Phaser.Scene.prototype);
LeaderboardScene.prototype.constructor = LeaderboardScene;
LeaderboardScene.prototype.create = function () {
    const centerX = this.scale.width / 2;

    this.add.image(centerX, this.scale.height / 2, 'bg');
    pixelText(this, centerX, 40, 'Leaderboard', 14);

    const back = pixelText(this, centerX, 550, 'Back', 10).setInteractive();
    back.on('pointerdown', () => this.scene.start('MenuScene'));

    db.ref('leaderboard').orderByChild('score').limitToLast(5).once('value', snapshot => {
        const scores = [];
        snapshot.forEach(child => {
            scores.push(child.val().score);
        });
        scores.reverse();

        scores.forEach((score, index) => {
            pixelText(this, centerX, 100 + index * 40, `${index + 1}. ${score}`, 10);
        });
    });

    createMuteButton(this, this.scale.width - 20, 20);
};

// ✅ Mute Button Helper
function createMuteButton(scene, x, y) {
    const icon = isMuted ? 'soundoff' : 'soundon';
    const muteButton = scene.add.image(x, y, icon)
        .setScale(0.15)
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true });

    muteButton.on('pointerdown', () => {
        isMuted = !isMuted;
        muteButton.setTexture(isMuted ? 'soundoff' : 'soundon');
    });
}
