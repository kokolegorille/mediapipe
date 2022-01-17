import React, { useRef, useEffect, useState } from "react"
import { FaceMesh } from "@mediapipe/face_mesh"
import * as Facemesh from "@mediapipe/face_mesh"
import * as cam from "@mediapipe/camera_utils"
import Webcam from "react-webcam"
import { drawConnectors } from "@mediapipe/drawing_utils/drawing_utils"

const FaceMeshView = () => {
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
            if (results.multiFaceLandmarks) {
                for (const landmarks of results.multiFaceLandmarks) {
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION,
                        { color: "#C0C0C070", lineWidth: 1 })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, { color: "#FF3030" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, { color: "#FF3030" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, { color: "#30FF30" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, { color: "#30FF30" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, { color: "#30FF30" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, { color: "#E0E0E0" })
                    drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, { color: "#E0E0E0" })
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
        const faceMesh = new FaceMesh({
            locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        })
        faceMesh.setOptions({
            maxNumFaces: 3,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        })
        faceMesh.onResults(onResults)
        if (webcamRef.current) {
            const myCam = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await faceMesh.send({ image: webcamRef.current.video })
                },
                width: 1280,
                height: 960,
            })

            myCam.start()
        }
    }, [webcamRef.current])

    return (
        <div>
            <h1>Face Mesh</h1>
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

export default FaceMeshView