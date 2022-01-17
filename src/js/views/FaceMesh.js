import React, { useRef, useEffect } from "react"
import { FaceMesh } from "@mediapipe/face_mesh"
import * as Facemesh from "@mediapipe/face_mesh"
import * as cam from "@mediapipe/camera_utils"
import Webcam from "react-webcam"

const FaceMeshView = () => {
    const webcamRef = useRef()
    const canvasRef = useRef()

    const onResults = results => {
        console.log(results)
    }

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
                    await faceMesh.send({image: webcamRef.current.video})
                },
                width: 1280,
                height: 960,
            })
            
            myCam.start()
        }
    }, [webcamRef])

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
    );
}

export default FaceMeshView