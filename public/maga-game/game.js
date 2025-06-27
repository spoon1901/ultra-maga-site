
// Game Config
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

window.config = config;

// Leaderboard Scene
function LeaderboardScene() {}

LeaderboardScene.prototype.preload = function () {
    this.load.image('background', 'https://files.catbox.moe/chw14r.png');
};

LeaderboardScene.prototype.create = function () {
    this.add.tileSprite(0, 0, 400, 600, 'background').setOrigin(0);

    this.add.text(200, 30, 'Ultra $MAGA Leaderboard', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: '"Press Start 2P"',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(200, 60, `User: @${window.userHandle}`, {
        fontSize: '10px',
        fill: '#ffffff',
        fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5);

    const yourScoreText = this.add.text(200, 85, 'Your High Score: ...', {
        fontSize: '10px',
        fill: '#ffffff',
        fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5);

    const leaderboardText = this.add.text(200, 130, 'Loading...', {
        fontSize: '10px',
        fill: '#ffffff',
        fontFamily: '"Press Start 2P"'
    }).setOrigin(0.5);

    const userRef = window.db.ref('users/' + window.userId);
    userRef.once('value').then(snapshot => {
        const data = snapshot.val();
        highScore = data?.highscore || 0;
        yourScoreText.setText('Your High Score: ' + highScore);
    });

    window.db.ref('users').once('value').then(snapshot => {
        const data = snapshot.val() || {};
        const leaderboard = Object.entries(data)
            .map(([id, val]) => ({
                name: val.handle || id.slice(0, 5) + '...' + id.slice(-4),
                score: val.highscore || 0
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        const display = leaderboard
            .map((entry, index) => `${index + 1}. ${entry.name} — ${entry.score}`)
            .join('\n');

        leaderboardText.setText(display || 'No scores yet.');
    });

    this.add.text(200, 550, 'START GAME', {
        fontSize: '12px',
        fill: '#ffffff',
        fontFamily: '"Press Start 2P"',
        stroke: '#000',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.scene.start('GameScene'));
};

// Game Scene
function GameScene() {}

GameScene.prototype.preload = function () {
    this.load.image('trump', 'https://files.catbox.moe/7wbrf6.png');
    this.load.image('pipe', 'https://files.catbox.moe/qswcqq.png');
    this.load.image('background', 'https://files.catbox.moe/chw14r.png');

    this.load.audio('flap', 'https://files.catbox.moe/2oly9t.mp3');
    this.load.audio('hit', 'https://files.catbox.moe/2v2pm7.mp3');
    this.load.audio('score', 'https://files.catbox.moe/5c5st7.mp3');
    this.load.audio('music', 'https://files.catbox.moe/4eq3qy.mp3');
};

GameScene.prototype.create = function () {
    this.gameOver = false;
    this.score = 0;

    this.background = this.add.tileSprite(0, 0, 400, 600, 'background').setOrigin(0);

    this.trump = this.physics.add.sprite(100, 300, 'trump').setScale(0.07);
    this.trump.setCollideWorldBounds(true);
    this.trump.setVisible(false);
    this.trump.body.allowGravity = false;

    this.pipes = this.physics.add.group();

    this.scoreText = this.add.text(200, 28, 'Score: 0', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: '"Press Start 2P"',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);

    this.highScoreText = this.add.text(200, 65, 'High: ' + highScore, {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: '"Press Start 2P"',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);

    this.startText = this.add.text(200, 300, 'TAP TO START', {
        fontSize: '12px',
        fill: '#ffff00',
        fontFamily: '"Press Start 2P"',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);

    this.music = this.sound.add('music', { loop: true, volume: 0.4 });

    this.input.on('pointerdown', () => {
        if (!this.trump.visible && !this.gameOver) {
            this.startGame();
        } else if (this.gameOver) {
            this.scene.start('LeaderboardScene');
        } else {
            this.flap();
        }
    });

    this.physics.add.collider(this.trump, this.pipes, () => this.hitPipe());

    this.cursors = this.input.keyboard.createCursorKeys();
};

GameScene.prototype.startGame = function () {
    this.startText.setVisible(false);
    this.trump.setVisible(true);
    this.trump.clearTint();
    this.trump.body.allowGravity = true;
    this.trump.setPosition(100, 300);
    this.trump.setVelocity(0);
    this.gameOver = false;
    this.score = 0;
    this.scoreText.setText('Score: 0');
    this.pipes.clear(true, true);

    this.pipeTimer = this.time.addEvent({
        delay: 1500,
        callback: () => this.addPipe(),
        callbackScope: this,
        loop: true
    });

    this.music.play();
    this.physics.resume();
};

GameScene.prototype.addPipe = function () {
    const gap = 150;
    const y = Phaser.Math.Between(200, 400);
    const pipeScale = 0.35;

    const topPipe = this.pipes.create(400, y - gap, 'pipe')
        .setOrigin(0, 1)
        .setScale(pipeScale)
        .refreshBody();

    const bottomPipe = this.pipes.create(400, y + gap, 'pipe')
        .setOrigin(0, 0)
        .setScale(pipeScale)
        .refreshBody();

    [topPipe, bottomPipe].forEach(pipe => {
        pipe.setVelocityX(-200);
        pipe.body.allowGravity = false;
        pipe.setImmovable(true);
    });
};

GameScene.prototype.update = function () {
    if (this.gameOver) return;

    this.background.tilePositionX += 1;

    if (this.cursors.space.isDown) {
        this.flap();
    }

    this.pipes.getChildren().forEach(pipe => {
        if (!pipe.passed && pipe.x + pipe.displayWidth / 2 < this.trump.x) {
            pipe.passed = true;
            this.score += 1;
            this.scoreText.setText('Score: ' + this.score);
            if (this.score > highScore) {
                highScore = this.score;
                this.highScoreText.setText('High: ' + highScore);
                if (window.db) {
                    window.db.ref('users/' + window.userId).set({ highscore: highScore, handle: window.userHandle });
                }
            }
        }
    });
};

GameScene.prototype.flap = function () {
    this.sound.play('flap');
    this.trump.setVelocityY(-300);
};

GameScene.prototype.hitPipe = function () {
    if (this.gameOver) return;

    this.gameOver = true;
    this.physics.pause();
    this.trump.setTint(0xff0000);

    if (this.pipeTimer) this.pipeTimer.remove();
    this.sound.play('hit');
    this.music.stop();
};
