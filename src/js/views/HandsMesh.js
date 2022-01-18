import React, { useRef, useEffect, useState } from "react"
import { Hands } from "@mediapipe/hands"
import * as Handsmesh from "@mediapipe/hands"

import * as cam from "@mediapipe/camera_utils"
import Webcam from "react-webcam"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils"

const HandsMesh = () => {
    const webcamRef = useRef()
    const canvasRef = useRef()
    const [canvasCtx, setCanvasCtx] = useState()

    const onResults = results => {
        const canvasElement = canvasRef.current
        if (canvasCtx) {
            canvasCtx.save()
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
            canvasCtx.drawImage(
                results.image, 0, 0, canvasElement.width, canvasElement.height)
            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(canvasCtx, landmarks, Handsmesh.HAND_CONNECTIONS,
                        {color: '#00FF00', lineWidth: 5});
                    drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
                }
            }
            canvasCtx.restore()
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            setCanvasCtx(canvasRef.current.getContext("2d"))
        }
    }, [canvasRef.current])

    useEffect(() => {
        const hands = new Hands({
            locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        })
        // https://github.com/google/mediapipe/issues/2181
        // Add modelComplexity to force fetch!
        hands.setOptions({
            maxNumHands: 4,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            modelComplexity: 1
        })
        hands.onResults(onResults)
        if (webcamRef.current) {
            const myCam = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current) {
                        await hands.send({ image: webcamRef.current.video })
                    }
                },
                width: 1280,
                height: 960,
            })

            myCam.start()
        }
    }, [webcamRef.current])

    return (
        <div>
            <h1>Hands Mesh</h1>
            <Webcam
                ref={webcamRef}
                style={{
                    position: "absolute",
                    marginRight: "auto",
                    marginLeft: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 10,
                    width: 1280,
                    height: 960
                }} />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    marginRight: "auto",
                    marginLeft: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 10,
                    width: 1280,
                    height: 960
                }} />
        </div>
    )
}

export default HandsMesh