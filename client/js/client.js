var $ = require('jquery');

console.log('hello');

window.random = () => {
	let min = $('#min').val();
	min = min === '' ? 0 : min;
	alert(min);
}