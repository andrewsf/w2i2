
w2i2 - widget2image service, v2
====

A new version of the widget2image service using PhantomJS.

Installation
--------------------------------------

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

Running
-------------------------------------

```bash
node server.js
```

Now you can use the service like so: [http://localhost:9242/getimage?url=http://google.com/](http://localhost:9242/getimage?url=http://google.com/)

