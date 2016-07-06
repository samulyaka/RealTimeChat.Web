class pubnubService {
    protected q: any;
    protected Pubnub: any;
    protected location: ng.ILocationService;
    protected GlobalConfig: GlobalConfigModel;
    protected CurrentUser: LoginUserModel;
    protected ChannelsData: any;
    protected rootScope: any;
    protected contextService: any;
    protected Initialized: boolean;
    static $inject = ['$rootScope', '$q', 'Pubnub', 'contextService'];

    constructor($rootScope: any, $q: any, Pubnub: any, contextService: ContextService) {
        this.q = $q;
        this.rootScope = $rootScope;
        this.Pubnub = Pubnub;
        this.contextService = contextService;
        this.GlobalConfig = window['GlobalConfig'];
        this.ChannelsData = {};
        this.Initialized = false;
    }
    public Init(currentUser: LoginUserModel): void {
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

    }
    private GetChennal(channelUUID: string): any {

        this.ChannelsData[channelUUID] = this.ChannelsData[channelUUID] || {};
        var chennal = this.ChannelsData[channelUUID];
        chennal.messages = chennal.messages || [];
        chennal.messagesAllFetched = chennal.messagesAllFetched || false;
        return chennal;
    }
    public InitChannel(channelUUID: string, callback: (msg: any) => void): void {
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
                var user: any = _.find(this.contextService.Contacts, { uuid: message.sender_uuid });
                message.user = user || { userName: this.contextService.currentUser.name, imageUrl: this.contextService.currentUser.imageUrl };
                chennal.messages.push(message);
                chennal.newMessages(chennal.messages);
                chennal.timeTokenFirstMessage = envelope[1];
            }.bind(this, channelUUID),
            
            presence: function (presenceEvent) {
                this.contextService.RefreshUserStatus(presenceEvent);
            }.bind(this)
            
        });

    }
    public SendMessage(channelUUID: string, message: any) {
        if (!message.text && !message.file && !message.image) {
            return;
        }
        this.Pubnub.publish({
            channel: channelUUID,
            message: {
                uuid: (this.CurrentUser.uuid + Date.now()),
                content: { text: message.text , file: message.file, image: message.image },
                sender_uuid: this.CurrentUser.uuid,
                date: Date.now()
            },
        });
    }
    public GetMessages(channelUUID: string, callback: () => void, callbackResult: (msgs) => void) : void {
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
    
   MessagesAllFetched (channelUUID: string) {

      if (!channelUUID) {
          return [];
       }
       var chennal = this.GetChennal(channelUUID);
      return chennal.messagesAllFetched;

};
    public Populate(channelUUID: string) {
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
                    
                    var user: any = _.find(this.contextService.Contacts, { uuid: m[0][i].sender_uuid });
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


    public FetchPreviousMessages(channelUUID) {

    var chennal = this.GetChennal(channelUUID);
    var defaultMessagesNumber = 5;

    var deferred = this.q.defer()

    this.Pubnub.history({
        channel: channelUUID,
        callback: function (m) {
            chennal.timeTokenFirstMessage = m[1];
            for (var i = 0; i < m[0].length; i++) {

                var user: any = _.find(this.contextService.Contacts, { uuid: m[0][i].sender_uuid });
                m[0][i].user = user || { userName: this.contextService.currentUser.name, imageUrl: this.contextService.currentUser.imageUrl };
            }
            Array.prototype.unshift.apply(chennal.messages, m[0]);

            if (m[0].length < defaultMessagesNumber) {
                chennal.messagesAllFetched = true;
            }
            
            deferred.resolve(m);

        }.bind(this),
        error: function (m) {
            deferred.reject(m)
        },
        count: defaultMessagesNumber,
        start: chennal.timeTokenFirstMessage,
        reverse: false
    });

    return deferred.promise
    }
    public CloseAllChannels(): void{
        for (var channelUUID in this.ChannelsData) {
            this.Pubnub.unsubscribe({
                channel: channelUUID
            });
        }
        this.ChannelsData = {};
    }
}

angular
    .module('app')
    .service('pubnubService', pubnubService);