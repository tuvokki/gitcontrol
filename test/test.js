var assert = require("assert")
describe('This repo', function(){
  describe('Up to date', function(){
    git = require('nodegit');
    git.Repo.clone('git@github.com:tuvokki/fuelcalc.git', 'testrepo', null, function(err, repo) {
      console.log(repo.path())
    });
    it('should return somethng whatever when doing a pull', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})
