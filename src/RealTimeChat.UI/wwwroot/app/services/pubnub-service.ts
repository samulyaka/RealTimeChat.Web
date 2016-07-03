class pubnubService {
    protected q: any;
    protected Pubnub: any;
    protected location: ng.ILocationService;
    protected GlobalConfig: GlobalConfigModel;
    protected CurrentUser: LoginUserModel;
    protected FirstMessageTimeToken: any;
    protected ChannelsData: any;
    protected rootScope: any;

    constructor($rootScope : any, $q: any, $location: ng.ILocationService, Pubnub:any) {
        this.q = $q;
        this.rootScope = $rootScope;
        this.location = $location;
        this.Pubnub = Pubnub;
        this.GlobalConfig = window['GlobalConfig'];
    }
    public Init(currentUser: LoginUserModel): void {
        this.CurrentUser = currentUser;
        this.Pubnub.init({
            publish_key: this.GlobalConfig.PubNubSettings.publishKey,
            subscribe_key: this.GlobalConfig.PubNubSettings.subscribeKey,
    //        uuid: currentUser.uuid,
       //     origin: 'pubsub.pubnub.com',
     //       ssl: true
        });

    }
    public InitChannel(channelUUID: string, callback: (message: any) => void): void {
        this.Pubnub.subscribe({
            channel: this.CurrentUser.activeChannelUUID,
            message: function (message, envelope, channelOrGroup, time, channel) {
                callback(JSON.stringify(message));
            },
            connect: function () {
                console.log('connected');
            }.bind(this)
            //triggerEvents: ['callback']
            //        disconnect: function () { console.log('dis') }.bind(this),
            //        reconnect: function () { console.log('rec') }.bind(this),
            //         triggerEvents: function () { console.log('new') }.bind(this)
        });
    }
    public SendMessage(channelUUID: string, message: any) {
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
                content: { text:message , files:[], images:[]},
                sender_uuid: this.CurrentUser.uuid,
                date: Date.now()
            },
        });
    }
    public GetMessages(channelUUID: string) : any {
        if (!channelUUID){
            return [];
        }
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        if (!chennal.messages || chennal.messages.length < 1) {
            this.Populate(channelUUID);
        }

        return chennal.messages;

    };
    
   MessagesAllFetched (channelUUID: string) {

      if (!channelUUID) {
          return [];
      }
      this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
      var chennal = this.ChannelsData[channelUUID];
      return chennal.messagesAllFetched;

};
    public Populate(channelUUID: string) {
        if (!channelUUID) {
            return [];
        }
        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        var defaultMessagesNumber = 20;

        this.Pubnub.history({
            channel: channelUUID,
            callback: function (m) {
                chennal.timeTokenFirstMessage = m[1]
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
    SubcribeNewMessage(channelUUID, callback) {
        this.rootScope.$on(this.Pubnub.getMessageEventNameFor(channelUUID), callback);
    };


    FetchPreviousMessages(channelUUID) {

    this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
    var chennal = this.ChannelsData[channelUUID];
    var defaultMessagesNumber = 10;

    var deferred = this.q.defer()

    this.Pubnub.history({
        channel: channelUUID,
        callback: function (m) {
            // Update the timetoken of the first message
            chennal.timeTokenFirstMessage = m[1]
            Array.prototype.unshift.apply(chennal.messages, m[0])

            if (m[0].length < defaultMessagesNumber) {
                chennal.messagesAllFetched = true;
            }

            this.rootScope.$digest()
            deferred.resolve(m)

        },
        error: function (m) {
            deferred.reject(m)
        },
        count: defaultMessagesNumber,
        start: chennal.timeTokenFirstMessage,
        reverse: false
    });

    return deferred.promise
};

}

angular
    .module('app')
    .service('pubnubService', pubnubService);