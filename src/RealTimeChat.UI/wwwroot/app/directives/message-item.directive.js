angular.module('app').directive('messageItem', function() {
  return {
    restrict: "E",
    templateUrl: 'app/views/message-item.html',
    scope: {
      senderUuid: "@",
      content: "@",
      date: "@"
    }
  };
});