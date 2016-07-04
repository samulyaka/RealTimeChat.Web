class chatController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    private Upload: any;
    private timeout: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any, Upload: any, $timeout: ng.ITimeoutService) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.SendMessage = this.SendMessage.bind(this);
        this.scope.ChangeMessage = this.ChangeMessage.bind(this);
        this.scope.UploadFiles = this.UploadFiles.bind(this);
        this.scope.message = "";

        this.Upload = Upload;
        this.timeout = $timeout;

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

    UploadFiles(file, errFiles): void {
        //var that = this;
        this.scope.f = file;
        this.scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = this.Upload.upload({
                url: this.BuidUrl('Files', 'FileUpload') + '?chatid=' + this.scope.channel,
                data: { file: file, ChatUID: this.scope.channel }
            });

            file.upload.then((response) => {
                this.rootScope.$emit("FileUploaded", {});

                this.timeout(function () {
                    file.result = response.data;
                });
            }, (response) => {
                if (response.status > 0)
                    this.scope.errorMsg = response.status + ': ' + response.data;
            }, (evt) => {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    }
}
angular.module("app").controller('chatController', chatController);