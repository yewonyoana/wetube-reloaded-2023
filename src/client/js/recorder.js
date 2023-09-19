const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

//downloading recording
const handleDownload = () => {
	//create link
	const a = document.createElement("a");
	a.href = videoFile;
	//adding downloading attribute will allow to save the video
	a.download = "MyRecording.webm";
	document.body.appendChild(a);
	//triggering a click wo the user knowing
	a.click();
};

//stop and download recording btns
const handleStop = () => {
	startBtn.innerText = "Download Recording";
	startBtn.removeEventListener("click", handleStop);
	startBtn.addEventListener("click", handleDownload);

	recorder.stop();
};

//start recording btns
const handleStart = () => {
	startBtn.innerText = "Stop Recording";
	startBtn.removeEventListener("click", handleStart);
	startBtn.addEventListener("click", handleStop);
	//recording
	recorder = new MediaRecorder(stream);
	//fired when the recording is stopped
	recorder.ondataavailable = (event) => {
		//object URL, only created and exists in the browser
		videoFile = URL.createObjectURL(event.data);
		video.srcObject = null;
		video.src = videoFile;
		video.loop = true;
		video.play();
	};
	recorder.start();
};

//access to media device (audio, video, etc.)
const init = async () => {
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true,
	});
	video.srcObject = stream;
	video.play();
};

init();

startBtn.addEventListener("click", handleStart);
