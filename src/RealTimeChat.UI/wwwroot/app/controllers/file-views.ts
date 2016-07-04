class fileViewsController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    public timeout: ng.ITimeoutService;
    public activeChannelUUID: String;
    public activeFileChannelUUID: String;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any, $timeout: ng.ITimeoutService, $window: ng.IWindowService) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.timeout = $timeout;
        this.scope.moment = $window.moment;
        this.scope.isBlockVisible = false;
        this.scope.SelectFile = this.SelectFile.bind(this);
        this.scope.filesChatSelected = "";

        $rootScope.$watch('activeChannelUUID', this.UpdateFiles.bind(this));
        $scope.$watch('filesChatSelected', this.SelectFile.bind(this));

        $rootScope.$on("FileUploaded", () => {
            this.LoadFiles();
        });

        $('select#files-list').selectmenu({
            style: 'popup',
            width: 450,
            height: 50,
            format: this.AddressFormatting
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

    SelectFile(): void {
        if (this.scope.filesChatSelected) {
            this.scope.Files.map((file) => {
                this.scope.filesChatSelected = $('select#files-list').val();
                if (file.id == this.scope.filesChatSelected)
                    this.scope.activeFileChannelUUID = file.filesChatUID;
            });
        } else {
            this.scope.activeFileChannelUUID = ""
        }
    }

    UpdateFiles(): void {
        if (!this.rootScope.activeChannelUUID) {
            this.scope.isBlockVisible = false;
            return;
        }
        this.activeChannelUUID = this.rootScope.activeChannelUUID
        this.LoadFiles();
    }

    LoadFiles(): void {
        this.Send("Files", "LoadFiles", { ChatUID: this.activeChannelUUID }, (res) => {
            this.scope.filesChatSelected = "";
            this.scope.activeFileChannelUUID = ""
            if (res.data.length) {
                this.scope.isBlockVisible = true;
                this.scope.Files = res.data;
                this.timeout(() => {
                    $('select#files-list').selectmenu();
                }, 1000);
            } else {
                this.scope.isBlockVisible = false;
                this.scope.Files = [];
            }
        });
    }

}
angular.module("app").controller('fileViewsController', fileViewsController);