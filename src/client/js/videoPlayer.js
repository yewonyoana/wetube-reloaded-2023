const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;

let volumeValue = 0.5;
video.volume = volumeValue;

//play&pause with btns
const handlePlayClick = (e) => {
	//if video is playing, pause
	if (video.paused) {
		video.play();
	} else {
		//else, play video
		video.pause();
	}
	playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

//play&pause with spacebar
const handleKeydown = (event) => {
	console.log(event);
	if (event.code === "Space") {
		handlePlayClick();
		event.preventDefault();
	}
};

//play&pause by clicking on video
const handleVideoClickPlay = () => {
	handlePlayClick();
};

//mute with btns
const handleMuteClick = (e) => {
	if (video.muted) {
		video.muted = false;
	} else {
		video.muted = true;
	}
	muteBtnIcon.classList = video.muted
		? "fas fa-volume-mute"
		: "fas fa-volume-up";
	volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
	const {
		target: { value },
	} = event;
	if (video.muted) {
		video.muted = false;
	}
	volumeValue = value;
	video.volume = value;

	//when the volume is set to 0 -> unmute
	if (volumeValue === 0) {
		video.muted = true;
		muteBtnIcon.classList = "fas fa-volume-up";
	}
};

//formatting timelines
const formatTime = (seconds) =>
	new Date(seconds * 1000).toISOString().substring(11, 19);
//11부터 8자리 가져와야 하니까 11, 11+8

const handleLoadedMetadata = () => {
	if (!isNaN(video.duration)) {
		totalTime.innerText = formatTime(Math.floor(video.duration));
		timeline.max = Math.floor(video.duration);
	}
};

const handleTimeUpdate = () => {
	currentTime.innerText = formatTime(Math.floor(video.currentTime));
	timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
	const {
		target: { value },
	} = event;
	video.currentTime = value;

	//change timeline while playing
	if (!setVideoPlayStatus) {
		videoPlayStatus = video.paused ? false : true;
		setVideoPlayStatus = true;
	}
	video.pause();
	video.currentTime = value;
};

//change timeline while playing
const handleTimelineSet = () => {
	videoPlayStatus ? video.play() : video.pause();
	setVideoPlayStatus = false;
};

//fullscreen
const handleFullscreen = () => {
	const fullscreen = document.fullscreenElement;
	if (fullscreen) {
		document.exitFullscreen();
		fullScreenIcon.classList = "fas fa-expand";
	} else {
		videoContainer.requestFullscreen();
		fullScreenIcon.classList = "fas fa-compress";
	}
};

//when using btn to enter and exit
const handleFullScreenBtn = (event) => {
	const fullScreen = document.fullscreenElement;
	if (fullScreen) {
		fullScreenIcon.classList = "fas fa-compress";
	} else {
		fullScreenIcon.classList = "fas fa-expand";
	}
};

//hiding controls
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
	if (controlsTimeout) {
		clearTimeout(controlsTimeout);
		controlsTimeout = null;
	}
	if (controlsMovementTimeout) {
		clearTimeout(controlsMovementTimeout);
		controlsMovementTimeout = null;
	}
	videoControls.classList.add("showing");
	controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
	controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
	const { id } = videoContainer.dataset;
	fetch(`/api/videos/${id}/view`, { method: "POST" });
};

//play&pause with btn
playBtn.addEventListener("click", handlePlayClick);
//play&pause with spacebar
document.addEventListener("keydown", handleKeydown);
//play&pause by clicking on video
video.addEventListener("click", handleVideoClickPlay);
//mute with btn
muteBtn.addEventListener("click", handleMuteClick);
//mute&unmute with "m"
document.addEventListener("keyup", (event) => {
	if (event.key === "m") {
		handleMuteClick();
	}

	if (event.key === "f") {
		handleFullscreen();
	}
});
volumeRange.addEventListener("input", handleVolumeChange);
// video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("canplay", handleLoadedMetadata);
handleLoadedMetadata();
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
//change "exit" to "enter" when esc used to exit fullscreen
videoContainer.addEventListener("fullscreenchange", handleFullScreenBtn);
video.addEventListener("ended", handleEnded);
