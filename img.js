var toBrackets = require('./jsfuck/jsfuck.js').JSFuck.encode,
	fromPng = require('./png.js/png-node.js'),
	fs = require('fs');

// Encode js

var jsfn = process.argv[2],
	js = fs.readFileSync(jsfn, 'utf8'),
	encoded = toBrackets(js, true),
	jsLen = encoded.length;

console.log('js is ' + encoded.length + 'chars');

// Read image...

var imgfn = process.argv[3],
	img = fromPng.load(imgfn),
	w = img.width,
	h = img.height,
	fullArea = w * h,
	area = 0,
	binary = [];

console.log(img);

console.log('image is ' + w + '*' + h);

// edit this if you want
function pixToBinary (p) {
	return p[0] < 128;
}

img.decode(function(px) {
	var c = 4, p = [], k = 0, on, j, x = 0, y = 0;
	for (var i = 0; i < fullArea; ++i) {
		if (++x == w) {
			x = 0;
			++y;
		}
		if (!binary[y])
			binary[y] = [];
		for (j = 0; j < c; ++j)
			p[j] = px[k++];
		on = pixToBinary(p);
		if (on)
			++area;
		binary[y][x] = on;
	}

	console.log('image size: ' + fullArea);
	console.log('buffer size: ' + binary.length);
	console.log('black pixels: ' + area);
	console.log('image is ' + (area * 100 / fullArea) + '% full');

	// Calculate correct size...

	var scale = Math.sqrt(area / jsLen),
		result = '',
		pos = 0;

	// Create reformatted file:

	for (var y = 0; y < h; y += scale) {
		var newY = Math.floor(y);
		for (var x = 0; x < w; x += scale) {
			result += binary[newY][Math.floor(x)]
				? encoded[pos++] || ';' // semicolon acts like no-op
				: ' ';
		}
		result += '\n';
	}
	if (pos < encoded.length)
		result += '\n' + encoded.substr(pos);

	// Save file

	fs.writeFileSync(jsfn + '.img.js', result, {encoding: 'utf8'});
});