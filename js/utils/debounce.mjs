export default function (func,delay) {
	let timer = void 0;
	if (!timer) {
		timer = setTimeout(func,delay);
	} else {
		clearTimeout(timer);
		timer = setTimeout(func,delay)
	}
}
