var bogart = require('bogart')
    ,path  = require('path');

require('dotenv').load();

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");
var router = bogart.router();

router.get('/', function(req) { 
    console.log('GET / - Find the saved webhooks.');
    var url = 'mongodb://';
    if (process.env.DB_USER) {
      url = url + process.env.DB_USER+':'+process.env.DB_PASS+'@';
    }
    url = url + process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME

    // Read all documents 
    return mp.MongoClient.connect(url)
        .then(function(db){
          return db.collection('webhooks')
            .then(function(col) {
              return col.find({a : 1}).toArray()
                .then(function(items) {
                    console.log(items);
                    return viewEngine.respond('index.html', items);
                    db.close().then(console.log('success'));
                })
          })
    })
    .fail(function(err) {console.log(err)});

});

router.post('/payload', function(req) {
    console.log('POST /payload - Save the incoming webhook.');
    var MongoClient = require('mongodb').MongoClient;

    var url = 'mongodb://';
    if (process.env.DB_USER) {
      url = url + process.env.DB_USER+':'+process.env.DB_PASS+'@';
    }
    url = url + process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME

    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('webhooks');
      collection.insert(req.body, function(err, result) {
          if(err)
              throw err;
       
          console.log("entry saved");
      });
    });
    return bogart.json({ webhook: 'thanks' });
});

var app = bogart.app();
app.use(bogart.batteries({ secret: 'xGljGo7f4g/a1QveU8VRxhZP5Hwi2YWelejBq5h4ynM'})); // A batteries included JSGI stack including streaming request body parsing, session, flash, and much more.
app.use(bogart.middleware.directory(root));
app.use(router); // Our router
console.log('Loading ... ');
app.start(4567);
console.log('done.\n');