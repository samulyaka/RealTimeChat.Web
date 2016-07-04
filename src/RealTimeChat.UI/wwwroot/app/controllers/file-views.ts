class fileViewsController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    public timeout: ng.ITimeoutService;
    public activeChannelUUID: String;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any, $timeout: ng.ITimeoutService, $window: ng.IWindowService) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.timeout = $timeout;
        this.scope.moment = $window.moment;
        this.scope.isBlockVisible = false;

        this.rootScope.$watch('currentUser.activeChannelUUID', this.UpdateFiles.bind(this));

        this.rootScope.$on("FileUploaded", () => {
            this.LoadFiles();
        });
    }
    AddressFormatting(text) {
        var newText = text;
        //array of find replaces
        var findreps = [
            { find: /^([^\|]+) \| /g, rep: '<div class="text-muted">$1</div>' },
            { find: /([^\|><\(\)]+)$/g, rep: '<div class="text-primary">$1</div>' }
        ];
        for (var i in findreps) {
            newText = newText.replace(findreps[i].find, findreps[i].rep);
        }
        return newText;
    }
    UpdateFiles(): void {
        if (!this.rootScope.currentUser.activeChannelUUID) {
            this.scope.isBlockVisible = false;
            return;
        }
        this.activeChannelUUID = this.rootScope.currentUser.activeChannelUUID
        this.LoadFiles();
    }
    LoadFiles(): void {
        this.Send("Files", "LoadFiles", { ChatUID: this.activeChannelUUID }, (res) => {
            if (res.data.length) {
                this.scope.isBlockVisible = true;
                this.scope.Files = res.data;
                this.timeout(() => {
                    $('select#files-list').selectmenu({
                        style: 'popup',
                        width: 450,
                        height: 50,
                        format: this.AddressFormatting
                    });
                }, 1000);
            }
        });
    }

}
angular.module("app").controller('fileViewsController', fileViewsController);