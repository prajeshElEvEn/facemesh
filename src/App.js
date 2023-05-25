import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import './styles/App.css';
import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { drawMesh } from './app/utilities';

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 }, scale: 0.8
    })
    setInterval(() => {
      detect(net)
    }, 100)
  }

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
      const face = await net.estimateFaces(video)
      // console.log(face)
      const ctx = canvasRef.current.getContext("2d")
      drawMesh(face, ctx)
    }
  }

  useEffect(() => {
    runFacemesh()
  }, [])


  return (
    <div className="container">
      <div className="header">
        <div className="left">
          <div className="logo">FaceMesh</div>
        </div>
        <div className="right">
          <a href="https://github.com/prajeshElEvEn/facemesh" target="_blank" rel="noopener noreferrer">
            <span>Github</span>
          </a>
        </div>
      </div>
      <div className="main">
        <Webcam
          ref={webcamRef}
          className='cam'
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            // zindex: 9,
          }}
        />
        <canvas
          ref={canvasRef}
          className='cam'
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            // zindex: 9,
          }}
        />
      </div>
    </div >
  );
}

export default App;
