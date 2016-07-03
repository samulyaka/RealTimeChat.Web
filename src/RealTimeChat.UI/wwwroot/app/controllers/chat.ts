class chatController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.SendMessage = this.SendMessage.bind(this);
        this.scope.ChangeMessage = this.ChangeMessage.bind(this);
        this.scope.message = "";
        
        if (this.scope.channel) {
            this.pubnubService.InitChannel(this.scope.channel, this.NewMessage.bind(this));
        }
    }
    SendMessage(): void {
        if (this.scope.channel) {
            this.pubnubService.SendMessage(this.scope.channel, this.scope.message);
        }
        this.scope.message = "";
        this.scope.messageInputFocus = true;
    }
    NewMessage(message): void {
        console.log("newMessage");
        console.log(message);
    }

    ChangeMessage(event): void {
        if (event.which === 13) {// press enter key
            event.preventDefault();
            this.SendMessage();
        }
    }
}
angular.module("app").controller('chatController', chatController);