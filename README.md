
# w2i2 - widget2image service, v2

A new version of the widget2image service using PhantomJS.

## Installation

[Install node](http://nodejs.org/download/).

Install phantomjs.
```bash
sudo npm install -g phantomjs
```

Clone the repository.
```bash
git clone git://github.com/andrewsf/w2i2.git
cd w2i2
```

Get project dependencies.
```bash
npm install
```

## Running

```bash
node server.js
```

Now you can use the service like so: [http://localhost:9242/getimage?url=http://google.com/](http://localhost:9242/getimage?url=http://google.com/)

## Supported URL parameters

### url

Required. String. The URL of the page or asset to capture.

### screenSize

Optional. String. Default: "1600x1200". The dimensions of the viewport within which the widget can be seen.

### scaledToHeight

Optional. Integer. The height that the final screenshot should be scaled to. Takes precedence over scaledToWidth.

### scaledToWidth

Optional. Integer. The width that the final screenshot should be scaled to. Cannot be used if scaledToHeight is used.

## Examples

```
http://localhost:9242/getimage?url=https%3A%2F%2Fgoogle.com/
```
```
http://localhost:9242/getimage?url=https%3A%2F%2Fgoogle.com/&screenSize=1050x550
```
```
http://localhost:9242/getimage?url=https%3A%2F%2Fgoogle.com/&screenSize=1050x550&scaledToWidth=450
```
