var bogart = require('bogart')
    ,path  = require('path');

require('dotenv').load();

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");
var router = bogart.router();

router.get('/', function(req) { 
  var article = { };
  return viewEngine.respond('index.html', article);
});

router.post('/payload', function(req) {
    console.log(req.body);
    return bogart.json({ webhook: 'thanks' });
});

var app = bogart.app();
app.use(bogart.batteries({ secret: 'xGljGo7f4g/a1QveU8VRxhZP5Hwi2YWelejBq5h4ynM'})); // A batteries included JSGI stack including streaming request body parsing, session, flash, and much more.
app.use(bogart.middleware.directory(root));
app.use(router); // Our router
console.log('Loading ... ');
app.start(4567);
console.log('done.\n');