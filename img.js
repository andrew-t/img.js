(function() {

	function changeFile(jsfn, imgfn, repeat, overwrite, runOnParentScope) {
		var toBrackets = require('./jsfuck/jsfuck.js').JSFuck.encode,
			fromPng = require('./png.js/png-node.js'),
			uglify = require('./UglifyJS/uglify-js.js'),
			fs = require('fs');

		// Encode js:
		var js = fs.readFileSync(jsfn, 'utf8'),
			ast = uglify.parser.parse(js);
		ast = uglify.uglify.ast_mangle(ast);
		ast = uglify.uglify.ast_squeeze(ast);
		var minified = uglify.uglify.gen_code(ast),
			encoded = toBrackets(minified, true, runOnParentScope),
			jsLen = encoded.length;

		console.log('Original js is ' + js.length + ' chars');
		console.log('Minified js is ' + minified.length + ' chars');
		console.log('Encoded js is ' + jsLen + ' chars');

		// Read image:
		var img = fromPng.load(imgfn),
			w = img.width,
			h = img.height,
			fullArea = w * h,
			area = 0,
			binary = [];

		// Edit this if you want:
		function pixToBinary(p) {
			return (p[0] + p[1] + p[2]) * p[3] < 97538;
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

			console.log('Image is ' + (area * 100 / fullArea) + '% full');

			// Calculate correct size:
			var scale = repeat ? 1 : Math.sqrt(area / jsLen),
				result = '',
				pos = 0;

			// Create reformatted file:
			do for (var y = 0; y < h; y += scale) {
				var newY = Math.floor(y);
				for (var x = 0; x < w; x += scale) {
					result += binary[newY][Math.floor(x)]
						? encoded[pos++] || ';' // semicolon acts like no-op
						: ' ';
				}
				result += '\n';
			} while (repeat && pos < encoded.length);
			if (pos < encoded.length)
				result += '\n' + encoded.substr(pos);

			// Trim trailing whitespace for filesize.
			result = result.replace(/([^ ]|^) +\n/g, '$1\n');

			// Save file:
			fs.writeFileSync(jsfn + (overwrite ? '' : '.img.js'), result, {encoding: 'utf8'});
			console.log('Image is ' + result.length + ' chars.');
			// Usually these files gzip pretty well so on a good server it's not so bad.
		});
	}

	if (require.main === module)
		changeFile(process.argv[2],
				   process.argv[3], 
				   eval(process.argv[4]),
				   eval(process.argv[5]),
				   eval(process.argv[6]));
	else
		exports.file = changeFile;
})();