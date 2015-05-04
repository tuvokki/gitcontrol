var assert = require('assert'),
    repos = require('../repos.js');

describe('This repo', function(){
  beforeEach(function(done){
    // db.clear(function(err){
    //   if (err) return done(err);
    //   db.save([tobi, loki, jane], done);
    // });
    repos.clone(2);
    done();
  });

  describe('pull', function() {
    it('should return something usefull', function() {
      var pull = repos.pull(5,2);
      assert.equal(pull, 5.385164807134504);
    })
  });

  describe('Up to date', function(){
    it('should return somethng whatever when doing a pull', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  });
})
