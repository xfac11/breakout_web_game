import { Input, Scene } from 'phaser';
import { PaddleDirection } from '../PaddleDirection';
import { PaddleInput } from './PaddleInput';

export class KeyboardPaddleInput implements PaddleInput
{
    private readonly keyboard: Phaser.Input.Keyboard.KeyboardPlugin | null;
    private readonly keys: Phaser.Input.Keyboard.Key[] = [];
    private readonly leftKey?: Phaser.Input.Keyboard.Key;
    private readonly rightKey?: Phaser.Input.Keyboard.Key;
    private readonly aKey?: Phaser.Input.Keyboard.Key;
    private readonly dKey?: Phaser.Input.Keyboard.Key;

    constructor (scene: Scene)
    {
        this.keyboard = scene.input.keyboard;

        if (this.keyboard)
        {
            this.leftKey = this.keyboard.addKey(Input.Keyboard.KeyCodes.LEFT);
            this.rightKey = this.keyboard.addKey(Input.Keyboard.KeyCodes.RIGHT);
            this.aKey = this.keyboard.addKey(Input.Keyboard.KeyCodes.A);
            this.dKey = this.keyboard.addKey(Input.Keyboard.KeyCodes.D);
            this.keys.push(this.leftKey, this.rightKey, this.aKey, this.dKey);
        }
    }

    getDirection (): PaddleDirection
    {
        const leftDown = this.leftKey?.isDown || this.aKey?.isDown;
        const rightDown = this.rightKey?.isDown || this.dKey?.isDown;

        if (leftDown === rightDown)
        {
            return 'none';
        }

        return leftDown ? 'left' : 'right';
    }

    destroy (): void
    {
        for (const key of this.keys)
        {
            this.keyboard?.removeKey(key, true);
        }

        this.keys.length = 0;
    }
}
