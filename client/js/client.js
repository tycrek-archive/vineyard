//// NPM modules ////
var $ = require('jquery');
var moment = require('moment');

// When the DOM has completed loading
$(window).on('load', () => {
	let video = $('#video');
	video.on('click', () => {
		if (video.get(0).paused) video.get(0).play();
		else video.get(0).pause();
	});
	loadFromAddressBar();
});

window.onpopstate = (_event) => loadFromAddressBar();

window.random = () => getRandomVine();


//// Video loading and unloading ////
function loadVideo(url) {
	let video = $('#video')[0];
	video.src = url;
	video.load();
	video.play();
}

function unloadVideo() {
	$('.meta-data').html('');
	$('.fa-question').show();
	try {
		let video = $('#video')[0];
		video.src = '';
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
			loadVine(json);
			window.history.pushState({ vineId: json.vineid }, json.username, `/v/${json.vineid}`);
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
			.then((json) => loadUser(json));
	}
}

function loadVine(vine) {
	let videoUrl = vine.videourl;

	// Select username or a vanity URL
	let name = vine.vanityurls.length === 0 ? vine.username : vine.vanityurls[0];
	let link =
		`<a href="/u/${vine.useridstr}">${vine.username}</a>`

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

function entityLink(entity, original) {
	//let id = entity.vanityUrls.length === 0 ? entity.title : entity.vanityUrls[0];
	let link =
		`<a href="/u/${entity.idStr}">${original}</a>`;
	return link;
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