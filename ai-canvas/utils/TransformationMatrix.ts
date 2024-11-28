import { Point } from '../types/Point';

export class TransformMatrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;

    constructor(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    static identity(): TransformMatrix {
        return new TransformMatrix(1, 0, 0, 1, 0, 0);
    }

    inverse(): TransformMatrix {
        const det = this.a * this.d - this.b * this.c;
        return new TransformMatrix(
            this.d / det,
            -this.b / det,
            -this.c / det,
            this.a / det,
            (this.c * this.f - this.d * this.e) / det,
            (this.b * this.e - this.a * this.f) / det
        );
    }

    multiply(matrix: TransformMatrix): TransformMatrix {
        return new TransformMatrix(
            this.a * matrix.a + this.c * matrix.b,
            this.b * matrix.a + this.d * matrix.b,
            this.a * matrix.c + this.c * matrix.d,
            this.b * matrix.c + this.d * matrix.d,
            this.a * matrix.e + this.c * matrix.f + this.e,
            this.b * matrix.e + this.d * matrix.f + this.f
        );
    }

    translate(tx: number, ty: number): TransformMatrix {
        return this.multiply(new TransformMatrix(1, 0, 0, 1, tx, ty));
    }

    rotate(angle: number): TransformMatrix {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return this.multiply(new TransformMatrix(cos, sin, -sin, cos, 0, 0));
    }

    transformPoint(point: Point): Point {
        return {
            x: this.a * point.x + this.c * point.y + this.e,
            y: this.b * point.x + this.d * point.y + this.f
        } as Point;
    }
}