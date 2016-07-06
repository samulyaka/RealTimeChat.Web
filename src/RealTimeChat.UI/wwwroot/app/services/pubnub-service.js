var pubnubService = (function () {
    function pubnubService($rootScope, $q, Pubnub, contextService) {
        this.q = $q;
        this.rootScope = $rootScope;
        this.Pubnub = Pubnub;
        this.contextService = contextService;
        this.GlobalConfig = window['GlobalConfig'];
        this.ChannelsData = {};
        this.Initialized = false;
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
        this.Initialized = true;
    };
    pubnubService.prototype.GetChennal = function (channelUUID) {
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        chennal.messages = chennal.messages || [];
        chennal.messagesAllFetched = chennal.messagesAllFetched || false;
        return chennal;
    };
    pubnubService.prototype.InitChannel = function (channelUUID, callback) {
        if (!channelUUID) {
            return;
        }
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
                var user = _.find(this.contextService.Contacts, { uuid: message.sender_uuid });
                message.user = user || { userName: this.contextService.currentUser.name, imageUrl: this.contextService.currentUser.imageUrl };
                chennal.messages.push(message);
                chennal.newMessages(chennal.messages);
                chennal.timeTokenFirstMessage = envelope[1];
            }.bind(this, channelUUID),
            presence: function (presenceEvent) {
                this.contextService.RefreshUserStatus(presenceEvent);
            }.bind(this)
        });
    };
    pubnubService.prototype.SendMessage = function (channelUUID, message) {
        if (!message.text && !message.file && !message.image) {
            return;
        }
        this.Pubnub.publish({
            channel: channelUUID,
            message: {
                uuid: (this.CurrentUser.uuid + Date.now()),
                content: { text: message.text, file: message.file, image: message.image },
                sender_uuid: this.CurrentUser.uuid,
                date: Date.now()
            }
        });
    };
    pubnubService.prototype.GetMessages = function (channelUUID, callback, callbackResult) {
        if (!channelUUID) {
            callbackResult([]);
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
                    var user = _.find(this.contextService.Contacts, { uuid: m[0][i].sender_uuid });
                    m[0][i].user = user || { userName: this.contextService.currentUser.name, imageUrl: this.contextService.currentUser.imageUrl };
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
                    var user = _.find(this.contextService.Contacts, { uuid: m[0][i].sender_uuid });
                    m[0][i].user = user || { userName: this.contextService.currentUser.name, imageUrl: this.contextService.currentUser.imageUrl };
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
        this.ChannelsData = {};
    };
    pubnubService.$inject = ['$rootScope', '$q', 'Pubnub', 'contextService'];
    return pubnubService;
}());
angular
    .module('app')
    .service('pubnubService', pubnubService);
