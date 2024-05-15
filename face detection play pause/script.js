const video = document.getElementById('video');
const baseVideo = document.getElementById('srcVideo');
const btn = document.getElementById('primaryBtn');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

function startVideo(){
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play', ()=>{
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.appendChild(canvas)
  const displaySize  =  {width: video.width, height: video.height}
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async ()=>{
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

   canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections) //for bounding box
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) //for landmarks or eye moment tracking
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections) //for face status happy sad
    
    if (detections.length === 0){
        baseVideo.pause()
    }
    if (detections.length === 1){
      baseVideo.play()
    }

    console.log(detections.length)

  }, 100)
})



