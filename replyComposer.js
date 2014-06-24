function ReplyComposer() {

  this.compose = function(recipients, text) {
    if(text.length < 1)
      return [];
    else {
      var textArray = text.split(' ').reverse(),
          newStatus = '.';

      recipientString = recipients.split(' ').map(function(recipient){
        return ['@',recipient].join('');
      }).join(' ');

      newStatus = [newStatus, recipientString].join('');

      while(textArray.length > 0 && (newStatus.length + textArray[textArray.length-1].length) < 139)
        newStatus = [newStatus, textArray.pop()].join(' ');

      var remainingText = textArray.reverse().join(' ');
      var statuses = this.compose(recipients, remainingText);
      statuses.reverse().push(newStatus);
      return statuses.reverse();
    }
  }
}

module.exports = ReplyComposer
