import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { PaddleDirection } from '../PaddleDirection';
import { KeyboardPaddleInput } from '../input/KeyboardPaddleInput';
import { TestPaddleInput } from '../input/TestPaddleInput';
import { TouchPaddleInput } from '../input/TouchPaddleInput';
import { Paddle } from '../objects/Paddle';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    paddle: Paddle;
    keyboardInput: KeyboardPaddleInput;
    touchInput: TouchPaddleInput;
    testInput: TestPaddleInput;

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
        this.keyboardInput = new KeyboardPaddleInput(this);
        this.touchInput = new TouchPaddleInput(this);
        this.testInput = new TestPaddleInput();
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
    }

    private cleanupInputs (): void
    {
        this.keyboardInput.destroy();
        this.touchInput.destroy();
        this.testInput.destroy();
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
