var $ = require('jquery');
var moment = require('moment');

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
			loadVideo(json);
			window.history.pushState({ vineId: json.vineid }, json.username, `/v/${json.vineid}`);
		});
}

function loadVideo(vine) {
	let videoUrl = vine.videourl;

	// Select username or a vanity URL
	let name = vine.vanityurls.length === 0 ? vine.username : vine.vanityurls[0];
	let link =
		`<a href="/u/${name}">${vine.username}</a>`

	// Format the timestamp
	let date = moment(vine.created).format('MMM Do, YYYY');

	// Format numerical data
	let loops = nFormatter(vine.loops, 1);
	let likes = nFormatter(vine.likes, 1);
	let comments = nFormatter(vine.comments, 1);
	let reposts = nFormatter(vine.reposts, 1);


	// Tags
	let description = vine.description;
	vine.entities.forEach((entity) => {
		entity = JSON.parse(entity);
		if (entity.type !== 'mention') return;
		let range = entity.range;
		let toReplace = description.substring(range[0], range[1]);
		let newTag = entityLink(entity, toReplace);
		description = description.replace(toReplace, newTag);
	});

	// Insert social data
	$('#username').html(link);
	$('#created').html(date);
	$('#loops').html(loops);
	$('#likes').html(likes);
	$('#comments').html(comments);
	$('#reposts').html(reposts);
	$('#description').html(description);


	let video = $('#video')[0];
	video.src = videoUrl;
	video.load();
	video.play();
}

function entityLink(entity, original) {
	let id = entity.vanityUrls.length === 0 ? entity.title : entity.vanityUrls[0];
	let link =
		`<a href="/u/${id}">${original}</a>`;
	return link;
}

function loadFromAddressBar() {
	unloadVideo();
	let path = window.location.pathname;
	if (path.startsWith('/v/')) {
		let split = path.split('/');
		let vineId = split[split.length - 1];
		fetch(`/getVine/${vineId}`)
			.then((res) => res.json())
			.then((json) => loadVideo(json));
	}
}

function unloadVideo() {
	let video = $('#video')[0];
	video.src = '';
}

function nFormatter(num, digits) {
	let si = [
		{ value: 1, symbol: "" },
		{ value: 1E3, symbol: "k" },
		{ value: 1E6, symbol: "M" },
		{ value: 1E9, symbol: "G" },
		{ value: 1E12, symbol: "T" },
		{ value: 1E15, symbol: "P" },
		{ value: 1E18, symbol: "E" }
	];
	let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}