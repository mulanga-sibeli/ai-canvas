import {ThemedText} from "@/components/ThemedText";
import {ThemedInput} from "@/components/ThemedInput";
import {Button} from "@/components/Button";
import {DrawOption} from "@/components/DrawOption";

import {Platform, ScrollView, View} from "react-native";
import React, {LegacyRef, useEffect, useRef, useState} from "react";

import {router} from "expo-router";
import {MathJax, MathJaxContext} from 'better-react-mathjax';
import {Entypo, FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";

import {MathJaxConfig} from "@/configs/Mathjax";
import {Point} from "@/types/Point";
import {TransformationType} from "../types/TransformationType"
import {CanvasState} from "../types/CanvasState";
import {DrawMode} from "../types/DrawMode";
import {CanvasConstants} from "../constants/CanvasConfigValues";

import {Circle} from "../utils/Circle";
import {FreeHand} from "../utils/FreeHand";
import {Shape} from "../utils/Shape";
import {CustomCanvasElement} from "../utils/CustomCanvas";
import {ThemedView} from "../components/ThemedView";

import {styles} from "../styles/Index";

export default function SpacePage() {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    const [userQuery, setUserQuery] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const canvasRef = useRef<CustomCanvasElement>();

    const setDrawMode = (mode: DrawMode) => {
        if (canvasRef.current){
            canvasRef.current.drawingMode = mode;
        }
    };

    const setStrokeColor = (color: string) => {
        if (canvasRef.current){
            canvasRef.current.strokeColor = color;
        }
    };

    const setStrokeWidth = (width: number) => {
        if (canvasRef.current){
            canvasRef.current.strokeWidth = width;
        }
    };

    const processCanvas = (userQuery: string) => {
        const canvas = document.getElementById("ai-canvas") as HTMLCanvasElement;
        const base64String = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");

        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiKey,
        };

        const payload = {
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: userQuery,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/png;base64,${base64String}`,
                                detail: "high",
                            },
                        },
                    ],
                },
            ],
            max_tokens: 700,
        };

        axios.post("https://api.openai.com/v1/chat/completions", payload, { headers })
            .then((response: any) => { setMessages((prevMessages) => [...prevMessages, response.data.choices[0].message.content]) })
            .catch((error: any) => { console.error(error.response ? error.response.data : error.message) });
    };

    const sendMessage = () => {
        if (userQuery.trim()) {
            setMessages((prevMessages) => [...prevMessages, userQuery])
            processCanvas(userQuery);
            setUserQuery("");
        }
    };

    useEffect(() => {
        if (Platform.OS === "web") {
            const canvas = canvasRef.current as CustomCanvasElement;
            if (canvas instanceof HTMLCanvasElement) {
                canvas.shapes = [];
                const dpr = window.devicePixelRatio || 1;
                canvas.width = screenWidth * dpr;
                canvas.height = screenHeight * dpr;
                canvas.style.width = `${screenWidth}px`;
                canvas.style.height = `${screenHeight}px`;
                canvas.drawingMode = DrawMode.Freehand;

                const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
                ctx.scale(dpr, dpr);
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.lineCap = "round";
                ctx.lineJoin = "round";

                let startPoint: Point;
                let moveTrace: Point[] = [];
                let selectedShape: Shape | null;
                let currentShape: Shape | null;
                let canvasState: CanvasState = CanvasState.Idle;

                const startPosition = async (e: any) => {
                    startPoint = { x: e.layerX, y: e.layerY } as Point;
                    if (canvas.shapes.length > 0) {
                        for (let shape of canvas.shapes) {
                            shape.registerCursorOverlap(startPoint);
                            if (shape.isSelected) {
                                canvasState = CanvasState.PreTransform;
                                if(shape != selectedShape){
                                    if (selectedShape) {
                                        selectedShape.isSelected = false;
                                        selectedShape.isTransformHandleSelected = false;
                                        selectedShape.isBorderSelected = false;
                                    }
                                    selectedShape = shape;
                                    selectedShape.latestTransform = null;
                                    if (!selectedShape.transformHandle){
                                        const transformHandleY = selectedShape.startPoint.y - (selectedShape.height / 2) - CanvasConstants.HANDLE_PADDING;
                                        selectedShape.transformHandle = new Circle({
                                            x: selectedShape.startPoint.x,
                                            y: transformHandleY
                                        }, CanvasConstants.HANDLE_RADIUS);
                                    }
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                                    canvas.shapes.forEach(shape => {
                                        ctx.beginPath();
                                        shape.drawShape(ctx, [shape.endPoint])
                                    })
                                }
                                return;
                            }
                        }
                    }

                    if(canvasState === CanvasState.ShapeFocused){
                        if (selectedShape){
                            selectedShape.isSelected = false;
                            selectedShape.isTransformHandleSelected = false;
                        }
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        canvas.shapes.forEach(shape => {
                            ctx.beginPath();
                            shape.drawShape(ctx, [shape.endPoint])
                        });
                    }
                    canvasState = CanvasState.PreDraw;
                }

                const draw = (e) => {
                    switch (canvasState) {
                        case CanvasState.PreDraw:
                            canvasState = CanvasState.Drawing;
                            break;
                        case CanvasState.PreTransform:
                            canvasState = CanvasState.Transforming;
                            if (selectedShape) {
                                switch(true){
                                    case selectedShape.isTransformHandleSelected:
                                        selectedShape.latestTransform = TransformationType.Rotation;
                                        break;
                                    case selectedShape.isBorderSelected:
                                        selectedShape.latestTransform = TransformationType.Scaling;
                                        break;
                                    case selectedShape.isSelected && !selectedShape.isBorderSelected && !selectedShape.isTransformHandleSelected:
                                        selectedShape.latestTransform = TransformationType.Translation;
                                }
                            }
                            break;
                        case CanvasState.ShapeFocused:
                            return;
                        case CanvasState.Idle:
                            return
                    }

                    const currentPoint = { x: e.layerX, y: e.layerY };
                    moveTrace.push(currentPoint);
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    switch (canvasState) {
                        case CanvasState.Drawing:
                            if (!currentShape){
                                switch(canvas.drawingMode){
                                    case DrawMode.Circle:
                                        currentShape = new Circle(startPoint, 0, canvas.strokeWidth, canvas.strokeColor);
                                        break;
                                    case DrawMode.Freehand:
                                        currentShape = new FreeHand(startPoint, canvas.strokeWidth, canvas.strokeColor);
                                }
                            };
                            currentShape?.drawShape(ctx, [currentPoint]);
                            canvas.shapes.forEach(shape => {
                                ctx.beginPath();
                                shape.drawShape(ctx, [shape.endPoint])
                            });
                            break;
                        case CanvasState.Transforming:
                            canvas.shapes.forEach(shape => {
                                ctx.beginPath();
                                shape.drawShape(ctx, shape.isSelected ? moveTrace : [shape.endPoint])
                            })
                    }
                }

                const endPosition = async (e) => {
                    switch (canvasState) {
                        case CanvasState.Drawing:
                            if (currentShape) {
                                currentShape.endPoint = { x: e.layerX, y: e.layerY };
                                currentShape.finalizeShape();
                                canvas.shapes.push(currentShape);
                                currentShape = null;
                            }
                            ctx.beginPath();
                            canvasState = CanvasState.Idle;
                            break;
                        case CanvasState.Transforming:
                            canvasState = CanvasState.ShapeFocused;
                            if (selectedShape){
                                selectedShape.isTransformHandleSelected = false;
                                selectedShape.isBorderSelected = false;
                            }
                            moveTrace = [];
                            break;
                        case CanvasState.PreDraw:
                            canvasState = CanvasState.Idle;
                            break;
                        case CanvasState.PreTransform:
                            canvasState = CanvasState.ShapeFocused;
                            return;
                    }
                };

                (canvas as HTMLCanvasElement).addEventListener("mousedown", startPosition);
                (canvas as HTMLCanvasElement).addEventListener("mouseup", endPosition);
                (canvas as HTMLCanvasElement).addEventListener("mousemove", draw);
                return () => {
                    (canvas as HTMLCanvasElement).removeEventListener("mousedown", startPosition);
                    (canvas as HTMLCanvasElement).removeEventListener("mouseup", endPosition);
                    (canvas as HTMLCanvasElement).removeEventListener("mousemove", draw);
                };
            }
        }
    }, [screenHeight, screenWidth]);

    return (
        <ThemedView style={styles.mainContainer}>
            <ThemedView style={styles.contentSectionContent}>
                <ThemedView style={styles.canvas}>
                    <ThemedView style={styles.canvasDrawOptions}>
                        <ThemedText
                            type="Caption"
                            weight="Regular"
                            lightColor="gray"
                        >
                            Mode
                        </ThemedText>
                        <ThemedView style={styles.canvasDrawOptionsSection}>
                            <DrawOption
                                    actionFunction={()=>setDrawMode(DrawMode.Freehand)}
                                    icon={<MaterialCommunityIcons name="draw" size={14} color="black" />} />
                            <DrawOption
                                    actionFunction={()=>setDrawMode(DrawMode.Circle)}
                                    icon={<Entypo name="circle" size={14} color="black" />} />
                        </ThemedView>
                        <ThemedText
                            type="Caption"
                            weight="Regular"
                            lightColor="gray"
                        >
                            Width
                        </ThemedText>
                        <ThemedView style={styles.canvasDrawOptionsSection}>
                            <DrawOption
                                actionFunction={()=>setStrokeWidth(5)}
                                icon={<MaterialIcons name="circle" size={7} color="black" />} />
                            <DrawOption
                                actionFunction={()=>setStrokeWidth(10)}
                                icon={<MaterialCommunityIcons name="circle" size={14} color="black" />} />
                        </ThemedView>
                        <ThemedText
                            type="Caption"
                            weight="Regular"
                            lightColor="gray"
                        >
                            Color
                        </ThemedText>
                        <ThemedView style={styles.canvasDrawOptionsSection}>
                            <DrawOption
                                actionFunction={() => setStrokeColor("black")}
                                icon={<FontAwesome name="square" size={20} color="black" />} />
                            <DrawOption
                                actionFunction={() => setStrokeColor("green")}
                                icon={<FontAwesome name="square" size={20} color="green" />} />
                        </ThemedView>
                    </ThemedView>

                    <canvas
                        id="ai-canvas"
                        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
                        style={{ width: "100%", height: "100%", display: "block" }}
                    />
                    {/*<TextEditorInput*/}
                    {/*  heading={heading}*/}
                    {/*  setHeading={setHeading}*/}
                    {/*  setValue={setText}*/}
                    {/*  value={text}*/}
                    {/*  placeholder="Start..."*/}
                    {/*/>*/}
                </ThemedView>
                <ThemedView style={styles.rightPanel}>
                    <ScrollView style={styles.scrollView}>
                        {messages.map((message, index) => (
                            <View key={index} style={styles.messageContainer}>
                                <ThemedText
                                    type="Caption"
                                    weight="Regular"
                                    lightColor="gray"
                                >
                                    <MathJaxContext config={MathJaxConfig}>
                                        <MathJax>{message}</MathJax>
                                    </MathJaxContext>
                                </ThemedText>
                            </View>
                        ))}
                    </ScrollView>
                    <ThemedInput
                        lightColor="royalblue"
                        type="regular"
                        inputLabel="Ask"
                        inputLabelColor="black"
                        value={userQuery}
                        setValue={setUserQuery}
                        placeholder="Type a message..."
                        submitAction={sendMessage}
                    />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}