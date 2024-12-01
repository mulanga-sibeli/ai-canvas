import { Shape } from "./Shape";
import { DrawMode } from "../types/DrawMode";

export class CustomCanvasElement extends (typeof window !== "undefined" ? HTMLCanvasElement : Object) {
    shapes : Shape[] = [];
    drawingMode: DrawMode = DrawMode.Circle;
    strokeColor: string = "black";
    strokeWidth: number = 1;
}