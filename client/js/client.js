var $ = require('jquery');

console.log('hello');

$(window).on('load', () => {
	let video = $('#video');
	video.on('click', () => {
		if (video.get(0).paused) video.get(0).play();
		else video.get(0).pause();
	});
});

window.random = () => {
	let min = $('#min').val();
	min = min === '' ? 0 : min;
	fetch(`/getVine/${min}`)
		.then((res) => res.json())
		.then((json) => {
			$('#video').attr('src', json.videourl);
			$('#video').load();
		});
}