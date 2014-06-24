describe('config', function() {

  var config = require('./../config');

  it('should include a response_language', function() {
    expect(config.response_language).not.toBe('');
    expect(config.response_language).toEqual(jasmine.any(String));
  });

  it('should include a target_username', function() {
    expect(config.target_username).not.toBe('');
    expect(config.target_username).toEqual(jasmine.any(String));
  });

  it('should include a ignore_retweets', function() {
    expect(config.ignore_retweets).not.toBe(null);
    expect([true, false]).toContain(config.ignore_retweets);
  });

  it('should include a ignore_replies', function() {
    expect(config.ignore_replies).not.toBe(null);
    expect([true, false]).toContain(config.ignore_replies);
  });

  it('should include a reply_to_usernames', function() {
    expect(config.reply_to_usernames).toEqual(jasmine.any(Array));
  });
});
