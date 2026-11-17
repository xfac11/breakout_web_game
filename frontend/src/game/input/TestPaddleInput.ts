import { PaddleDirection } from '../PaddleDirection';
import { PaddleInput } from './PaddleInput';

export class TestPaddleInput implements PaddleInput
{
    private direction: PaddleDirection = 'none';

    getDirection (): PaddleDirection
    {
        return this.direction;
    }

    setDirection (direction: PaddleDirection): void
    {
        this.direction = direction;
    }

    destroy (): void
    {
        this.direction = 'none';
    }
}
