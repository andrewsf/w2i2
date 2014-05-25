'use strict';

var express = require('express'),
	http = require('http'),
	phantom = require('phantom'),
	MD5 = require('MD5');

var listenPort = 9242;

var app = express();

app.get('/getimage', function (req, res) {
	var query = req.query,
		url = query.url || "",
		screenSize = query.screenSize || "1600x1200",
		scaledToHeight = query.scaledToHeight || -1,
		scaledToWidth = query.scaledToWidth || -1,
		maxFileSize = query.maxFileSize || 700000,
		format = query.format || "png";

	// Naive validation
	if (typeof url !== 'string' || url.substr(0, 4) !== 'http' || url.indexOf('://') < 0) {
		invalidParams();
		console.log("Invalid URL: " + url);
		return;
	}

	var screenDims = screenSize.split('x'),
		width = Math.min(1600, screenDims[0]),
		height = Math.min(1200, screenDims[1]);

	// TODO pool multiple phantom processes
	// TODO create phantom process(es) upfront, before starting up the server

	phantom.create(function (ph) {
		ph.createPage(function (page) {

			// Handle scaling
			var zoomFactor = 1;
			if (scaledToHeight > 0) {
				zoomFactor = scaledToHeight / height;
				width = width * zoomFactor;
				height = scaledToHeight;
			} else if (scaledToWidth > 0) {
				zoomFactor = scaledToWidth / width;
				width = scaledToWidth;
				height = height * zoomFactor;
			}
			page.set('zoomFactor', zoomFactor);

			page.set('viewportSize', {
				width: width,
				height: height
			});
			page.set('clipRect', {
				top: 0,
				left: 0,
				width: width,
				height: height
			});

			page.open(url, function(status) {
				page.set('navigationLocked', true);

				if (status !== 'success') {
					res.send(500, 'Remote request failed');
					console.log("Failed to load URL: " + url);
					finish();
				} else {
					setTimeout(function () {
						var filename = 'screenshots/' + MD5(url) + '.png';
						page.render(filename, { format: 'png', quality: '100' }, function () {
							res.sendfile(filename);
							finish();
						});
					}, 0);
				}
			});

			function finish() {
				setTimeout(function () {
					//res.send(...);
					page.close();
					ph.exit();
				}, 0);
			}
		});
	});

	function invalidParams() {
		res.send(400, 'Invalid request parameters');
	}
});

app.listen(listenPort);
console.log("w2i2 is now active and listening on port " + listenPort);
