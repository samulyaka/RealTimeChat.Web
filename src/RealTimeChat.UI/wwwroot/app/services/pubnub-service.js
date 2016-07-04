var pubnubService = (function () {
    function pubnubService($rootScope, $q, $location, Pubnub) {
        this.q = $q;
        this.rootScope = $rootScope;
        this.location = $location;
        this.Pubnub = Pubnub;
        this.GlobalConfig = window['GlobalConfig'];
        this.ChannelsData = {};
        this.numMessage = 0;
    }
    pubnubService.prototype.Init = function (currentUser) {
        this.CurrentUser = currentUser;
        this.Pubnub.init({
            publish_key: this.GlobalConfig.PubNubSettings.publishKey,
            subscribe_key: this.GlobalConfig.PubNubSettings.subscribeKey,
            uuid: currentUser.uuid,
            ssl: true
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
            //     this.rootScope.$digest();
            return;
        }
        var chennal = this.GetChennal(channelUUID);
        chennal.newMessages = callback;
        this.Pubnub.subscribe({
            channel: channelUUID, noheresync: true,
            disconnect: function () { console.log('dis'); }.bind(this),
            reconnect: function () { console.log('rec'); }.bind(this),
            message: function (channelUUID, message, envelope, channelOrGroup, time, channel) {
                var chennal = this.GetChennal(channelUUID);
                var user = _.find(this.rootScope.Contacts, { uuid: message.sender_uuid });
                message.user = user || { userName: this.rootScope.currentUser.name, imageUrl: this.rootScope.imageUrl };
                chennal.messages.push(message);
                chennal.newMessages(chennal.messages);
            }.bind(this, channelUUID),
            presence: function (m) {
                console.log("usState");
                console.log(m);
            },
            state: {
                name: 'presence-tutorial-user',
                timestamp: new Date()
            }
        });
        this.Pubnub.time(function (time) {
            chennal.firstMessageTimeToken = time;
        });
        // We listen to Presence events :
        this.rootScope.$on(this.Pubnub.getPresenceEventNameFor(channelUUID), function (ngEvent, presenceEvent) {
            console.log("AAA!!!");
            console.log(presenceEvent);
            this.rootScope.RefreshUserStatus(presenceEvent);
        });
        //this.SubcribeNewMessage(channelUUID, function (chUUID, ngEvent, m) {
        //    var chennal = this.GetChennal(chUUID);
        //    chennal.messages.push(m);
        //    chennal
        //    this.rootScope.$digest();
        //}.bind(this, channelUUID));
    };
    pubnubService.prototype.SendMessage = function (channelUUID, message) {
        if (!message) {
            return;
        }
        this.numMessage++;
        this.Pubnub.publish({
            channel: channelUUID,
            message: {
                uuid: (this.numMessage + this.CurrentUser.uuid + Date.now()),
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
        //this.Pubnub.here_now({
        //    channel: channelUUID,
        //    callback: function (m) {
        //        console.log("user");
        //        console.log(m);
        //    }
        //});
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
                //      this.rootScope.$digest()
                //    this.rootScope.$emit('factory:message:populated');
            }.bind(this),
            count: defaultMessagesNumber,
            reverse: false
        });
    };
    ;
    //SubcribeNewMessage(channelUUID, callback) {
    //    var chennal = this.GetChennal(channelUUID);
    //    chennal.newMessages = callback;
    //    this.rootScope.$on(this.Pubnub.getMessageEventNameFor(channelUUID), function (chUUID) {
    //        var chennal = this.GetChennal(chUUID);
    //        chennal.newMessages();
    //    }.bind(this, channelUUID));
    //};
    pubnubService.prototype.FetchPreviousMessages = function (channelUUID) {
        var chennal = this.GetChennal(channelUUID);
        var defaultMessagesNumber = 10;
        var deferred = this.q.defer();
        this.Pubnub.history({
            channel: channelUUID,
            callback: function (m) {
                // Update the timetoken of the first message
                chennal.timeTokenFirstMessage = m[1];
                for (var i = 0; i < m[0].length; i++) {
                    var user = _.find(this.rootScope.Contacts, { uuid: m[0][i].sender_uuid });
                    m[0][i].user = user || { userName: this.rootScope.currentUser.name, imageUrl: this.rootScope.imageUrl };
                }
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
