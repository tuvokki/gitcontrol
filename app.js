var bogart = require('bogart')
    ,path  = require('path');

require('dotenv').load();

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");
var router = bogart.router();

router.get('/', function(req) { 


  // var articles = nano.db.use('articles');

  // var articlelist = bogart.promisify(articles.view);

  // return articlelist('article_list', 'articleView').then(function(data) {
  //   return viewEngine.respond('posts.html', {
  //     locals: {
  //       pagetitle: 'all posts',
  //       postlist: data.rows
  //     }
  //   });
  // });



    // var article = { };

    var MongoClient = require('mongodb').MongoClient;

    var url = 'mongodb://';
    if (process.env.DB_USER) {
      url = url + process.env.DB_USER+':'+process.env.DB_PASS+'@';
    }
    url = url + process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME
    // Connect to the db
    MongoClient.connect(url, function(err, db) {
      if(err) { return console.dir(err); }

      var collection = db.collection('webhooks');

      collection.find().toArray(function(err, items) {
        db.close();
        return viewEngine.respond('index.html', items);
      });

      // var stream = collection.find({mykey:{$ne:2}}).stream();
      // stream.on("data", function(item) {});
      // stream.on("end", function() {});

      // collection.findOne({mykey:1}, function(err, item) {});

    });

    // MongoClient.connect(url, function(err, db) {
    //     // Find all data
    //     collection.find({})
    //       // .limit(1)
    //       .toArray(function(err, datathings) {
    //         db.close();
    //         if (err != null) {
    //           return viewEngine.respond('index.html', datathings);
    //         }
    //         else {
    //           if (d.length > 0) {
    //             d[0].count = d[0].errordata.length;
    //           }
    //           return viewEngine.respond('index.html', datathings);
    //         }
    //     });
    // });

});

router.post('/payload', function(req) {
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