'use strict';

var express = require('express'),
	http = require('http'),
	phantom = require('phantom'),
	MD5 = require('MD5'),
	fs = require('fs');

var listenPort = 9242;

console.log("Starting Phantom JS process...");
phantom.create(function (ph) {
	console.log("Phantom JS started.");

	var app = express();
	app.get('/getimage', function (req, res) {
		var query = req.query,
			url = query.url || "",
			screenSize = query.screenSize || "1600x1200",
			scaledToHeight = query.scaledToHeight || -1,
			scaledToWidth = query.scaledToWidth || -1;
//			maxFileSize = query.maxFileSize || 700000,
//			format = query.format || "png";

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

		var filepath = 'screenshots/' + screenSize + '/' + width + 'x' + height + '/' + MD5(url) + '.png';
		if (fs.existsSync(filepath)) {
			console.log("Found image in file system already: " + filepath);
			res.sendfile(filepath);
			return;
		}	
		
		ph.createPage(function (page) {
			page.set('zoomFactor', zoomFactor);
			page.set('viewportSize', { width: width, height: height });
			page.set('clipRect', { top: 0, left: 0, width: width, height: height });

			page.open(url, function(status) {
				page.set('navigationLocked', true);

				if (status !== 'success') {
					res.send(500, 'Remote request failed');
					console.log("Failed to load URL: " + url);
					closePage();
				} else {
					setTimeout(function () {
						if (fs.existsSync(filepath)) {
							console.log("Found image in file system already: " + filepath);
							imageReady(filepath);
						} else {
							page.render(filepath, { format: 'png', quality: '100' }, imageReady);
						}

						function imageReady() {
							var cleanupFinished = false;

							res.on("end", cleanup);
							res.on("error", cleanup);
							setTimeout(cleanup, 60000);

							res.sendfile(filepath);
							closePage();

							function cleanup () {
								if (!cleanupFinished) {
									fs.unlink(filepath, function (exc) {
										if (exc) {
											console.log("Failed to remove file: " + filepath);
										} else {
											console.log("Removed file: " + filepath);
										}
									});
									cleanupFinished = true;
								}
							}
						}
					}, 0);
				}
			});

			function closePage() {
				setTimeout(function () {
					page.close();
				}, 0);
			}
		});

		function invalidParams() {
			res.send(400, 'Invalid request parameters');
		}
	});

	app.listen(listenPort);
	console.log("w2i2 is now active and listening on port " + listenPort);
});
