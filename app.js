var express = require('express');
var app = express();

app.get('/', function (req, res) {
  console.log("updating");
  var nodegit = require('nodegit');
  var repoDir = "/tmp/Huna_Server";

  var path = require("path");

  var repository;

  // Open a repository that needs to be fetched and fast-forwarded
  nodegit.Repository.open(path.resolve(__dirname, repoDir))
    .then(function(repo) {
      repository = repo;
      console.log("i'm in");

      return repo.fetch("origin", {
        credentials: function(url, userName) {
          console.log("fetching");
          return nodegit.Cred.sshKeyFromAgent(userName);
        }
      },
      true /* ignoreCertErrors */);
    })
    // Now that we're finished fetching, go ahead and merge our local branch
    // with the new one
    .then(function() {
      repository.mergeBranches("master", "origin/master");
    })
    .done(function() {
      console.log("Done!");
      res.send('updated repo');
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('repos app listening at http://%s:%s', host, port);

});

// var express = require('express');
// var app = express();

// app.get('/', function (req, res) {
//   var nodegit = require('nodegit');
//   var promisify = require("promisify-node");
//   var fse = promisify(require("fs-extra"));
//   var path = "/tmp/Huna_Server";

//   fse.remove(path).then(function() {
//     var entry;

//     nodegit.Clone(
//       "https://github.com/TuvokVersatileKolinahr/Huna_Server.git",
//       path,
//       {
//         remoteCallbacks: {
//           certificateCheck: function() {
//             // github will fail cert check on some OSX machines
//             // this overrides that check
//             return 1;
//           }
//         }
//       })
//     .done(function() {
//       console.log("Done");
//     });
//     // .then(function(repo) {
//     //   return repo.getCommit("5a1ed0c94f781f6490ebaa216ab6fcdeb8f55e2b");
//     // })
//     // .then(function(commit) {
//     //   return commit.getEntry("README.md");
//     // })
//     // .then(function(entryResult) {
//     //   entry = entryResult;
//     //   return entry.getBlob();
//     // })
//     // .done(function(blob) {
//     //   console.log(entry.filename(), entry.sha(), blob.rawsize() + "b");
//     //   console.log("========================================================\n\n");
//     //   var firstTenLines = blob.toString().split("\n").slice(0, 10).join("\n");
//     //   console.log(firstTenLines);
//     //   console.log("...");
//     // });
//   });

//   res.send('updating repo');
// });

// var server = app.listen(3000, function () {

//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('repos app listening at http://%s:%s', host, port);

// });

