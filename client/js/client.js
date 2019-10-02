var $ = require('jquery');

console.log('hello');

$(window).on('load', () => {
	let video = $('#video');
	video.on('click', () => {
		if (video.get(0).paused) video.get(0).play();
		else video.get(0).pause();
	});
	loadFromAddressBar();
});

window.onpopstate = (_event) => loadFromAddressBar();

window.random = () => {
	let min = $('#min').val();
	min = min === '' ? 0 : min;
	unloadVideo();
	fetch(`/getRandomVine/${min}`)
		.then((res) => res.json())
		.then((json) => {
			loadVideo(json.videourl);
			window.history.pushState({ vineId: json.vineid }, json.username, `/v/${json.vineid}`);
		});
}

function loadVideo(videoUrl) {
	let video = $('#video')[0];
	video.src = videoUrl;
	video.load();
	video.play();
}

function loadFromAddressBar() {
	unloadVideo();
	let path = window.location.pathname;
	if (path.startsWith('/v/')) {
		let split = path.split('/');
		let vineId = split[split.length - 1];
		fetch(`/getVine/${vineId}`)
			.then((res) => res.json())
			.then((json) => loadVideo(json.videourl));
	}
}

function unloadVideo() {
	let video = $('#video')[0];
	video.src = '';
}