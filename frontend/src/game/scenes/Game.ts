import { EventBus } from '../EventBus';
import { Input, Scene } from 'phaser';
import { PaddleDirection } from '../PaddleDirection';
import { KeyboardPaddleInput } from '../input/KeyboardPaddleInput';
import { TestPaddleInput } from '../input/TestPaddleInput';
import { TouchPaddleInput } from '../input/TouchPaddleInput';
import { Paddle } from '../objects/Paddle';
import { Ball } from '../objects/Ball';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    paddle: Paddle;
    ball: Ball;
    launchText: Phaser.GameObjects.Text;
    keyboardInput: KeyboardPaddleInput;
    touchInput: TouchPaddleInput;
    testInput: TestPaddleInput;
    private spaceKey?: Phaser.Input.Keyboard.Key;
    private readonly launchWithPointer = (): void =>
    {
        this.launchBall();
    };

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.paddle = new Paddle(this, this.scale.width / 2, this.scale.height - 48, 128, 20);
        this.ball = new Ball(this, this.paddle.x, this.paddle.y - this.paddle.height / 2 - 12);
        this.keyboardInput = new KeyboardPaddleInput(this);
        this.touchInput = new TouchPaddleInput(this);
        this.testInput = new TestPaddleInput();
        this.launchText = this.add.text(this.scale.width / 2, this.scale.height - 100, 'Press SPACE or tap to launch', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.spaceKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE);
        this.input.on('pointerdown', this.launchWithPointer);
        this.events.once('shutdown', this.cleanupInputs, this);

        EventBus.emit('current-scene-ready', this);
    }

    update (_time: number, delta: number): void
    {
        const testDirection = this.testInput.getDirection();
        const keyboardDirection = this.keyboardInput.getDirection();
        const touchDirection = this.touchInput.getDirection();
        const direction: PaddleDirection = testDirection !== 'none'
            ? testDirection
            : keyboardDirection !== 'none'
                ? keyboardDirection
                : touchDirection;

        this.paddle.move(direction, delta);
        this.ball.update(this.paddle, delta);

        if (this.spaceKey?.isDown)
        {
            this.launchBall();
        }

        this.launchText.setVisible(!this.ball.isLaunched);
    }

    private launchBall (): void
    {
        this.ball.launch();
    }

    private cleanupInputs (): void
    {
        this.keyboardInput.destroy();
        this.touchInput.destroy();
        this.testInput.destroy();
        this.input.off('pointerdown', this.launchWithPointer);
        if (this.spaceKey)
        {
            this.input.keyboard?.removeKey(this.spaceKey, true);
            this.spaceKey = undefined;
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
