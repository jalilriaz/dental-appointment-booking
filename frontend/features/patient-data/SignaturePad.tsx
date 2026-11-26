"use client";

import { useRef, useState } from "react";

interface SignaturePadProps {
    onChange: (dataUrl: string) => void;
}

export default function SignaturePad({ onChange }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);

    const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / rect.width) * canvas.width,
            y: ((e.clientY - rect.top) / rect.height) * canvas.height,
        };
    };

    const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const { x, y } = getPoint(e);
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        setDrawing(true);
    };

    const moveDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        const { x, y } = getPoint(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const endDraw = () => {
        if (!drawing) return;
        setDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) onChange(canvas.toDataURL("image/png"));
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onChange("");
    };

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Patient signature (draw below)</span>
                <button type="button" onClick={clear} className="text-teal-700 hover:underline font-semibold cursor-pointer">
                    Clear signature
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={420}
                height={120}
                onPointerDown={startDraw}
                onPointerMove={moveDraw}
                onPointerUp={endDraw}
                onPointerLeave={endDraw}
                className="w-full h-28 rounded-xl border border-slate-300 bg-slate-50 touch-none cursor-crosshair"
            />
        </div>
    );
}
