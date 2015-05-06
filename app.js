var nodegit = require('nodegit');
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
var path = "/tmp/Huna_Server";

fse.remove(path).then(function() {
  var entry;

  nodegit.Clone(
    "https://github.com/TuvokVersatileKolinahr/Huna_Server.git",
    path,
    {
      remoteCallbacks: {
        certificateCheck: function() {
          // github will fail cert check on some OSX machines
          // this overrides that check
          return 1;
        }
      }
    })
  .done(function() {
    console.log("Done");
  });
  // .then(function(repo) {
  //   return repo.getCommit("5a1ed0c94f781f6490ebaa216ab6fcdeb8f55e2b");
  // })
  // .then(function(commit) {
  //   return commit.getEntry("README.md");
  // })
  // .then(function(entryResult) {
  //   entry = entryResult;
  //   return entry.getBlob();
  // })
  // .done(function(blob) {
  //   console.log(entry.filename(), entry.sha(), blob.rawsize() + "b");
  //   console.log("========================================================\n\n");
  //   var firstTenLines = blob.toString().split("\n").slice(0, 10).join("\n");
  //   console.log(firstTenLines);
  //   console.log("...");
  // });
});