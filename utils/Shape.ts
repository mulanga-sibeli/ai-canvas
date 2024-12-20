import { Point } from "../types/Point";
import { TransformationType } from "../types/TransformationType";
import { Circle } from "./Circle";
import { TransformMatrix } from "./TransformationMatrix";
import { CanvasConstants } from "../constants/CanvasConfigValues";

export class Shape {
    private readonly id: string;
    readonly strokeWidth: number;
    width: number;
    height: number;

    isSelected: boolean;
    isBorderSelected: boolean;
    isTransformHandleSelected: boolean;

    strokeColor: string;

    startPoint: Point;
    endPoint: Point;
    boundingCorners : Circle[];
    transformHandle: Circle;
    latestTransform: TransformationType | null;
    transformMatrix: TransformMatrix;

    constructor(startPoint: Point, strokeWidth?: number, strokeColor?: string) {
        this.id = Math.random().toString();
        this.strokeWidth = strokeWidth || 5;
        this.strokeColor = strokeColor || "black";
        this.boundingCorners = [];
        this.startPoint = startPoint;
        this.isSelected = false;
        this.isTransformHandleSelected = false;
        this.isBorderSelected = false;
        this.transformMatrix = TransformMatrix.identity();
    }

    drawShape(ctx: CanvasRenderingContext2D, moveTrace: Point[]) {
        throw new Error("Method not implemented.");
    }

    finalizeShape() {
        throw new Error("Method not implemented.");
    }

    registerCursorOverlap(currentPoint: Point) {
        throw new Error("Method not implemented.");
    }

    isCursorOverlappingHandle(currentPoint: Point, alternateHandle?: Point) {
        const handle = alternateHandle || this.transformHandle.startPoint;
        return currentPoint.x >= handle.x - CanvasConstants.HANDLE_RADIUS && currentPoint.y >= handle.y - CanvasConstants.HANDLE_RADIUS &&
            currentPoint.x <= handle.x + CanvasConstants.HANDLE_RADIUS && currentPoint.y <= handle.y + CanvasConstants.HANDLE_RADIUS;
    }

    isCursorOverlappingScalingCorners(currentPoint: Point) {
        for (const cornerPoint of this.boundingCorners) {
            if (
                currentPoint.x >= cornerPoint.startPoint.x - CanvasConstants.HANDLE_RADIUS && currentPoint.y >= cornerPoint.startPoint.y - CanvasConstants.HANDLE_RADIUS &&
                currentPoint.x <= cornerPoint.startPoint.x + CanvasConstants.HANDLE_RADIUS && currentPoint.y <= cornerPoint.startPoint.y + CanvasConstants.HANDLE_RADIUS
            ) {
                cornerPoint.isSelected = true;
                return true;
            }
        }
        return false;
    }
}
