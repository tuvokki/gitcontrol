var bogart = require('bogart')
    ,path  = require('path');

require('dotenv').load();

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");
var router = bogart.router();
var mp = require('mongodb-promise');

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
              return col.find({}).toArray()
                .then(function(items) {
                    console.log('Found ' + items.length + ' items.');
                    return viewEngine.respond("index.html", { locals: { items: items } });
                    db.close().then(console.log('success'));
                })
          })
    })
    .fail(function(err) {console.log(err)});
});

router.get('/update/:repo',function(req){
  var Git = require("nodegit");
  var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

var repos = ["bidonvullen", "gitcontrol"];
var repoLocations = ["/webdit/backend/bidonvullen", "/webdit/backend/gitcontrol"];

var repoIndex = repos.indexOf(req.params.repo);

Git.Repository.open(repoLocations[repoIndex])
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  });
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