//// NPM modules ////
var $ = require('jquery');
var moment = require('moment');

// When the DOM has completed loading
$(window).on('load', () => {
	loadFromAddressBar();
});

window.random = () => getRandomVine();

window.search = () => {
	$('#loading').show();
	$('#videos').html('');
	let terms = btoa($('input#search').val());
	fetch(`/search/${terms}`)
		.then((res) => res.json())
		.then((vines) => loadUser(vines))
		.then(() => $('#loading').hide());
};

//// Video loading and unloading ////
function loadVideo(url, id = '#video') {
	let video = $(id);

	video.unbind();

	video[0].src = url;

	if (id === '#video') {
		video[0].load();
		video[0].play();
	}

	video.on('click', () => {
		if (id !== '#video') return window.location = `/v/${id.replace('#', '')}`;

		if (video[0].paused) video[0].play();
		else video[0].pause();
	});

	if (id !== '#video') video.hover(
		() => { if (video[0].paused) video[0].play() },
		() => { if (!video[0].paused) video[0].pause() }
	);
}

function unloadVideo() {
	$('.meta-data').html('');
	$('.fa-question').show();
	try {
		let video = $('.video');
		video.attr('src', '');
	} catch { }
}

//// Vine loading and metadata manipulation ////
function getRandomVine() {
	let min = $('#min').val();
	min = min === '' ? 0 : min;

	unloadVideo();

	fetch(`/getRandomVine/${min}`)
		.then((res) => res.json())
		.then((json) => {
			//window.location = `/v/${json.vineid}`;
			window.history.pushState(null, null, `/v/${json.vineid}`);
			loadVine(json);
		});
}

function loadFromAddressBar() {
	unloadVideo();
	let path = window.location.pathname;
	let split = path.split('/');
	let parameter = split[split.length - 1];

	if (path.startsWith('/v/')) {
		fetch(`/getVine/${parameter}`)
			.then((res) => res.json())
			.then((json) => loadVine(json));
	} else if (path.startsWith('/u/')) {
		fetch(`/getUser/${parameter}`)
			.then((res) => res.json())
			.then((json) => loadUser(json, true));
	}
}

function loadVine(vine) {
	let videoUrl = vine.videourl;

	// Make the username a link
	let link = `<a href="/u/${vine.useridstr}">${vine.username}</a>`;

	// Format the timestamp
	let date = moment(vine.created).format('MMM Do, YYYY');

	// Format numerical data
	let loops = nFormatter(vine.loops, 1);
	let likes = nFormatter(vine.likes, 1);
	let comments = nFormatter(vine.comments, 1);
	let reposts = nFormatter(vine.reposts, 1);

	// Tags
	let description = vine.description;
	let originals = [];
	let replacements = [];

	vine.entities.forEach((entity) => {
		entity = JSON.parse(entity);
		if (entity.type !== 'mention') return;
		let range = entity.range;
		let original = description.substring(range[0], range[1] + 1);
		let replacement = entityLink(entity, original);
		originals.push(original);
		replacements.push(replacement);
	});

	for (let index = 0; index < originals.length; index++) {
		let original = originals[index];
		let replacement = replacements[index];
		description = description.replace(original, replacement);
	}

	// Insert social data
	$('#username').html(link);
	$('#created').html(date);
	$('#loops').html(loops);
	$('#likes').html(likes);
	$('#comments').html(comments);
	$('#reposts').html(reposts);
	$('#description').html(description);

	$('.fa-question').hide();

	loadVideo(videoUrl);
}

function loadUser(vines, isUser) {
	if (isUser) $('#username').html(vines[0].username);
	vines.forEach((vine) => {
		let id = vine.vineid;
		let jid = `#${id}`;
		let html = `<video preload="none" class="video grid" loop id=${id} poster="${vine.thumbnailurl}"></video>`;
		$('#videos').append(html);

		loadVideo(vine.videourl, jid);
	});
}

function entityLink(entity, original) {
	return `<a href="/u/${entity.idStr}">${original}</a>`;
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