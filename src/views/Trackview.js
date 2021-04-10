import React, { useState } from 'react';
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";
import { drawKeypoints, drawSkeleton } from "../utilities";
import * as posenet from "@tensorflow-models/posenet";


export default function Trackview(){

  const repsGoal = 5;

  const repsPhrases = {
    0:"FAI 20 SQUATS",
    1:"OTTIMO INIZIO",
    5:"NE MANCANO 15",
    10:"SEI A META' STRADA",
    15:"FORZA LE ULTIME CINQUE",
    18:"ANCORA 2"
  }

    let posenetModel = React.useRef(null);
    var [inPosition, setInPosition] = useState(false);
    var [repsCounter, incrementReps] = useState(0);
    var [repsPhrase, setPhrase] = useState(repsPhrases[0]);
    const history = useHistory();

    const webcamRef = React.useRef(null);
    const canvasRef = React.useRef(null);

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

    const getPhrase = (reps) => {
      console.log(repsPhrase);
      for (const key in Object.keys(repsPhrases))
      {
        if(key==reps.toString())
          return repsPhrases[key];
        else if(key>reps)
          break;
      }
      return null;
    }

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

          const newPhrase = getPhrase(repsCounter);
          if(newPhrase!==null)
            setPhrase(newPhrase)
          
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

            <h2>{repsPhrase}</h2>
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