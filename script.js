window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');

  // Load models
  Promise.all([
     
          faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('./models')
        ])       
      
        
  
  .then(() => {
    console.log("Models loaded successfully!");
    startVideo();
  })
  .catch(err => console.error("Error loading models:", err));

  function startVideo() {
    console.log("Starting webcam...");
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        video.srcObject = stream;
        console.log("Webcam started!");
      })
      .catch(err => console.error('Error accessing webcam:', err));
  }

  video.addEventListener('play', () => {
    console.log("Video playing... Setting up canvas");
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 100);
  });
});

navigator.permissions.query({ name: 'camera' })
.then(function(permissionStatus) {
  console.log('Camera permission state is:', permissionStatus.state);
  if (permissionStatus.state === 'granted') {
    startVideo();
  } else if (permissionStatus.state === 'prompt') {
    startVideo();
  } else {
    alert('Camera permission denied. Please enable it manually.');
  }
});

function startVideo() {
  console.log("Requesting webcam access...");

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      const video = document.getElementById('video');
      video.srcObject = stream;
      video.play();
      console.log("Webcam access granted!");
    })
    .catch(err => {
      console.error('Error accessing webcam:', err);
      alert('Please allow camera access to use the face detection system.');
    });

    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
  
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
  
      setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
      }, 100);
  });
  
}

permissionStatus.onchange = function() {
  console.log('Camera permission state changed to:', permissionStatus.state);
  if (permissionStatus.state === 'granted') {
    startVideo();
  } else if (permissionStatus.state === 'denied') {
    alert('Camera permission denied. Please enable it manually.');
    }
  }
