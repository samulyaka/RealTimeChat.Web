var pubnubService = (function () {
    function pubnubService($rootScope, $q, $location, Pubnub) {
        this.q = $q;
        this.rootScope = $rootScope;
        this.location = $location;
        this.Pubnub = Pubnub;
        this.GlobalConfig = window['GlobalConfig'];
    }
    pubnubService.prototype.Init = function (currentUser) {
        this.CurrentUser = currentUser;
        this.Pubnub.init({
            publish_key: this.GlobalConfig.PubNubSettings.publishKey,
            subscribe_key: this.GlobalConfig.PubNubSettings.subscribeKey,
        });
    };
    pubnubService.prototype.InitChannel = function (channelUUID, callback) {
        this.Pubnub.subscribe({
            channel: this.CurrentUser.activeChannelUUID,
            message: function (message, envelope, channelOrGroup, time, channel) {
                callback(JSON.stringify(message));
            },
            connect: function () {
                console.log('connected');
            }.bind(this)
        });
    };
    pubnubService.prototype.SendMessage = function (channelUUID, message) {
        if (!message) {
            return;
        }
        this.Pubnub.time(function (time) {
            this.firstMessageTimeToken = time;
        }.bind(this));
        this.Pubnub.publish({
            channel: channelUUID,
            message: {
                uuid: (Date.now() + this.CurrentUser.id),
                content: { text: message, files: [], images: [] },
                sender_uuid: this.CurrentUser.uuid,
                date: Date.now()
            },
        });
    };
    pubnubService.prototype.GetMessages = function (channelUUID) {
        if (!channelUUID) {
            return [];
        }
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        if (!chennal.messages || chennal.messages.length < 1) {
            this.Populate(channelUUID);
        }
        return chennal.messages;
    };
    ;
    pubnubService.prototype.MessagesAllFetched = function (channelUUID) {
        if (!channelUUID) {
            return [];
        }
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        return chennal.messagesAllFetched;
    };
    ;
    pubnubService.prototype.Populate = function (channelUUID) {
        if (!channelUUID) {
            return [];
        }
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        var defaultMessagesNumber = 20;
        this.Pubnub.history({
            channel: channelUUID,
            callback: function (m) {
                chennal.timeTokenFirstMessage = m[1];
                angular.extend(chennal.messages, m[0]);
                if (m[0].length < defaultMessagesNumber) {
                    chennal.messagesAllFetched = true;
                }
                //       $rootScope.$digest()
                //        $rootScope.$emit('factory:message:populated')
            },
            count: defaultMessagesNumber,
            reverse: false
        });
    };
    ;
    pubnubService.prototype.SubcribeNewMessage = function (channelUUID, callback) {
        this.rootScope.$on(this.Pubnub.getMessageEventNameFor(channelUUID), callback);
    };
    ;
    pubnubService.prototype.FetchPreviousMessages = function (channelUUID) {
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        var defaultMessagesNumber = 10;
        var deferred = this.q.defer();
        this.Pubnub.history({
            channel: channelUUID,
            callback: function (m) {
                // Update the timetoken of the first message
                chennal.timeTokenFirstMessage = m[1];
                Array.prototype.unshift.apply(chennal.messages, m[0]);
                if (m[0].length < defaultMessagesNumber) {
                    chennal.messagesAllFetched = true;
                }
                this.rootScope.$digest();
                deferred.resolve(m);
            },
            error: function (m) {
                deferred.reject(m);
            },
            count: defaultMessagesNumber,
            start: chennal.timeTokenFirstMessage,
            reverse: false
        });
        return deferred.promise;
    };
    ;
    return pubnubService;
}());
angular
    .module('app')
    .service('pubnubService', pubnubService);
