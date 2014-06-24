describe('ReplyComposer', function() {

  var config = require('./../config'),
      ReplyComposer = require('./../replyComposer'),
      composer = new ReplyComposer();

  describe('compose', function() {
    it('returns an empty array for empty input', function() {
      expect(composer.compose([], '')).toEqual([]);
    });

    it('begins the resulting status with a dot', function() {
      var recipients = 'foo bar';
      var text = 'this is a test';
      var result = composer.compose(recipients, text);
      expect(result[0][0]).toEqual('.');
    });

    it('follows the dot with the recipients', function() {
      var recipients = 'foo bar';
      var text = 'this is a test';
      var result = composer.compose(recipients, text);
      expect(result[0]).toMatch(/^\.@foo @bar/);
    });
  });
});
