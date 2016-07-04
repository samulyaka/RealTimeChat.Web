var pubnubService = (function () {
    function pubnubService($rootScope, $q, $location, Pubnub) {
        this.q = $q;
        this.rootScope = $rootScope;
        this.location = $location;
        this.Pubnub = Pubnub;
        this.GlobalConfig = window['GlobalConfig'];
        this.ChannelsData = {};
    }
    pubnubService.prototype.Init = function (currentUser) {
        this.CurrentUser = currentUser;
        this.Pubnub.init({
            publish_key: this.GlobalConfig.PubNubSettings.publishKey,
            subscribe_key: this.GlobalConfig.PubNubSettings.subscribeKey,
            uuid: currentUser.uuid,
            ssl: true,
            heartbeat: 40,
            heartbeat_interval: 60
        });
    };
    pubnubService.prototype.GetChennal = function (channelUUID) {
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        chennal.messages = chennal.messages || [];
        chennal.messagesAllFetched = chennal.messagesAllFetched || false;
        return chennal;
    };
    pubnubService.prototype.InitChannel = function (channelUUID, callback) {
        if (this.ChannelsData[channelUUID]) {
            this.ChannelsData[channelUUID].newMessages = callback;
            this.Pubnub.time(function (time) {
                this.ChannelsData[channelUUID].firstMessageTimeToken = time;
            }.bind(this));
            return;
        }
        var chennal = this.GetChennal(channelUUID);
        chennal.newMessages = callback;
        this.Pubnub.subscribe({
            channel: channelUUID,
            message: function (channelUUID, message, envelope, channelOrGroup, time) {
                var chennal = this.GetChennal(channelUUID);
                var user = _.find(this.rootScope.Contacts, { uuid: message.sender_uuid });
                message.user = user || { userName: this.rootScope.currentUser.name, imageUrl: this.rootScope.imageUrl };
                chennal.messages.push(message);
                chennal.newMessages(chennal.messages);
                chennal.timeTokenFirstMessage = envelope[1];
            }.bind(this, channelUUID),
            presence: function (presenceEvent) {
                this.rootScope.RefreshUserStatus(presenceEvent);
            }.bind(this)
        });
    };
    pubnubService.prototype.SendMessage = function (channelUUID, message) {
        if (!message) {
            return;
        }
        this.Pubnub.publish({
            channel: channelUUID,
            message: {
                uuid: (this.CurrentUser.uuid + Date.now()),
                content: { text: message, files: [], images: [] },
                sender_uuid: this.CurrentUser.uuid,
                date: Date.now()
            },
        });
    };
    pubnubService.prototype.GetMessages = function (channelUUID, callback, callbackResult) {
        if (!channelUUID) {
            callbackResult([]);
            chennal.populatedCallbeck();
            return;
        }
        var chennal = this.GetChennal(channelUUID);
        chennal.populatedCallbeck = callback;
        chennal.populatedCallbeckResult = callbackResult;
        if (!chennal.messages || chennal.messages.length < 1) {
            this.Populate(channelUUID);
            return;
        }
        callbackResult(chennal.messages);
        chennal.populatedCallbeck();
    };
    ;
    pubnubService.prototype.MessagesAllFetched = function (channelUUID) {
        if (!channelUUID) {
            return [];
        }
        var chennal = this.GetChennal(channelUUID);
        return chennal.messagesAllFetched;
    };
    ;
    pubnubService.prototype.Populate = function (channelUUID) {
        if (!channelUUID) {
            return [];
        }
        var chennal = this.GetChennal(channelUUID);
        var defaultMessagesNumber = 10;
        this.Pubnub.history({
            channel: channelUUID,
            callback: function (m) {
                chennal.timeTokenFirstMessage = m[1];
                for (var i = 0; i < m[0].length; i++) {
                    var user = _.find(this.rootScope.Contacts, { uuid: m[0][i].sender_uuid });
                    m[0][i].user = user || { userName: this.rootScope.currentUser.name, imageUrl: this.rootScope.imageUrl };
                }
                angular.extend(chennal.messages, m[0]);
                if (m[0].length < defaultMessagesNumber) {
                    chennal.messagesAllFetched = true;
                }
                chennal.populatedCallbeckResult(chennal.messages);
                chennal.populatedCallbeck();
            }.bind(this),
            count: defaultMessagesNumber,
            reverse: false
        });
    };
    ;
    pubnubService.prototype.FetchPreviousMessages = function (channelUUID) {
        var chennal = this.GetChennal(channelUUID);
        var defaultMessagesNumber = 5;
        var deferred = this.q.defer();
        this.Pubnub.history({
            channel: channelUUID,
            callback: function (m) {
                chennal.timeTokenFirstMessage = m[1];
                for (var i = 0; i < m[0].length; i++) {
                    var user = _.find(this.rootScope.Contacts, { uuid: m[0][i].sender_uuid });
                    m[0][i].user = user || { userName: this.rootScope.currentUser.name, imageUrl: this.rootScope.imageUrl };
                }
                Array.prototype.unshift.apply(chennal.messages, m[0]);
                if (m[0].length < defaultMessagesNumber) {
                    chennal.messagesAllFetched = true;
                }
                deferred.resolve(m);
            }.bind(this),
            error: function (m) {
                deferred.reject(m);
            },
            count: defaultMessagesNumber,
            start: chennal.timeTokenFirstMessage,
            reverse: false
        });
        return deferred.promise;
    };
    pubnubService.prototype.CloseAllChannels = function () {
        for (var channelUUID in this.ChannelsData) {
            this.Pubnub.unsubscribe({
                channel: channelUUID
            });
        }
        this.ChannelsData();
    };
    return pubnubService;
}());
angular
    .module('app')
    .service('pubnubService', pubnubService);
