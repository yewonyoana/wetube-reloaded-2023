import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
	input: "recording.webm",
	output: "output.mp4",
	thumb: "thumbnail.jpg",
};

//function to download files(recording, thumbnail)
const downloadFile = (fileUrl, fileName) => {
	//create link for recording
	const a = document.createElement("a");
	a.href = fileUrl;
	//adding downloading attribute will allow to save the video
	a.download = fileName;
	document.body.appendChild(a);
	//triggering a click wo the user knowing
	a.click();
};

//downloading recording
const handleDownload = async () => {
	//preventing user from downloading again
	actionBtn.removeEventListener("click", handleDownload);

	actionBtn.innerText = "Transcoding...";

	actionBtn.disabled = true;

	//transcode video from webm -> mp4
	const ffmpeg = createFFmpeg({ log: true });
	await ffmpeg.load();

	ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

	await ffmpeg.run("-i", files.input, "-r", "60", files.output);

	await ffmpeg.run(
		"-i",
		files.input,
		"-ss",
		"00:00:01",
		"-frames:v",
		"1",
		files.thumb
	);

	const mp4File = ffmpeg.FS("readFile", files.output);
	const thumbFile = ffmpeg.FS("readFile", files.thumb);

	const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
	const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

	const mp4Url = URL.createObjectURL(mp4Blob);
	const thumbUrl = URL.createObjectURL(thumbBlob);

	//donwloading files
	downloadFile(mp4Url, "MyRecording.mp4");
	downloadFile(thumbUrl, "MyThumbnail.jpg");

	ffmpeg.FS("unlink", files.input);
	ffmpeg.FS("unlink", files.output);
	ffmpeg.FS("unlink", files.thumb);

	URL.revokeObjectURL(mp4Url);
	URL.revokeObjectURL(thumbUrl);
	URL.revokeObjectURL(videoFile);

	//record again after downloading files
	actionBtn.disabled = false;
	actionBtn.innerText = "Record Again";
	actionBtn.addEventListener("click", handleStart);
};

//start recording btns
const handleStart = () => {
	actionBtn.innerText = "Recording";
	actionBtn.disabled = true;
	actionBtn.removeEventListener("click", handleStart);
	//recording
	recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
	//fired when the recording is stopped
	recorder.ondataavailable = (event) => {
		//object URL, only created and exists in the browser
		videoFile = URL.createObjectURL(event.data);
		video.srcObject = null;
		video.src = videoFile;
		video.loop = true;
		video.play();
		actionBtn.innerText = "Download";
		actionBtn.disabled = false;
		actionBtn.addEventListener("click", handleDownload);
	};
	recorder.start();
	setTimeout(() => {
		recorder.stop();
	}, 5000);
};

//access to media device (audio, video, etc.)
const init = async () => {
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			width: 1024,
			height: 576,
		},
	});
	video.srcObject = stream;
	video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
