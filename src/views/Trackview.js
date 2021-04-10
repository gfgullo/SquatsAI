import React, { useState } from 'react';
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";
import { drawKeypoints, drawSkeleton } from "../utilities";
import * as posenet from "@tensorflow-models/posenet";


export default function Trackview(){

    let posenetModel = React.useRef(null);
    var [inPosition, setInPosition] = useState(false);
    var [repsCounter, incrementReps] = useState(0);
    const history = useHistory();

    const webcamRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const repsGoal = 2;

    const imgSize = {height:480, width:640};

    const absStyle = {
      position: "absolute",
      left: 0,
      right: 0,
      width: imgSize['width'],
      height: imgSize['height'],
      marginLeft: "auto",
      marginRight: "auto"
    };

    const detectWebcamFeed = async () => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {

        const video = webcamRef.current.video;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        const pose = await posenetModel.current.estimateSinglePose(video);
        drawResult(pose, video, videoWidth, videoHeight, canvasRef);
      }
    };
  

    const isGoalCompleted = () => repsCounter>=repsGoal;
  

    const loadPosenet = async function () {

      console.log("Loading Posenet");
      
      return await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 257, height: 200 },
        quantBytes: 2
          });
    }


    const runPosenet = async () => {

      posenetModel.current = await loadPosenet();
        
        setInterval(() => {
          detectWebcamFeed();
        }, 100);    
        
      };

    
    const drawResult = (pose, video, videoWidth, videoHeight, canvas) => {

      const ctx = canvas.current.getContext("2d");
      
      canvas.current.width = videoWidth;
      canvas.current.height = videoHeight;
      
      const keypoints = pose["keypoints"]

      drawKeypoints(pose["keypoints"], 0.3, ctx);

      if(!inPosition)
      {
        //console.log("POSITION");
        if(keypoints[13].score>0.3 && keypoints[11].score>0.3 && keypoints[13].position.y-keypoints[11].position.y<50)
        {
          inPosition = true;
          setInPosition(inPosition);
        }
      }
      else
      {
        if(keypoints[13].score>0.3 && keypoints[11].score>0.3 && keypoints[13].position.y-keypoints[11].position.y>80)
        {
          inPosition = false;
          setInPosition(inPosition);
          repsCounter+=1;
          incrementReps(repsCounter);
          
          if(isGoalCompleted())
            history.push("/result")

        }
      }    
    };
  
    if(posenetModel.current==null)
    {
      console.log("posenet is null");
      console.log(window.innerWidth);
      runPosenet();
    } 

    return <div className="Track">



            <h2>SQUATTA ORA</h2>
            <p>SQUATS: {repsCounter}</p>
            <div style={{height:imgSize['height']}}>
              <Webcam
                  ref={webcamRef}
                  style={absStyle}
                />
                <canvas
                  ref={canvasRef}
                  style={absStyle}
                />
          </div>
          <img className="logo" src="res/logo.png"/>
      </div>  

}