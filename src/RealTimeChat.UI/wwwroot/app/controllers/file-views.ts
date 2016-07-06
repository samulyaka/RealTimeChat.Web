class fileViewsController {
    public scope: any;
    public rootScope: any;
    public contextService: ContextService;
    public timeout: ng.ITimeoutService;
    public activeChannelUUID: string;
    public activeFileChannelUUID: string;
    static $inject = ['$scope', '$rootScope', 'contextService', '$timeout', '$window'];
    constructor($scope: any, $rootScope: any, contextService: ContextService, $timeout: ng.ITimeoutService, $window: any) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.contextService = contextService;
        this.scope.Context = contextService;
        this.timeout = $timeout;
        this.scope.moment = $window.moment;
        this.scope.isBlockVisible = true;
        this.scope.SelectFile = this.SelectFile.bind(this);
        this.scope.filesChatSelected = "";
        if ($scope.channel) {
            this.activeChannelUUID = $scope.channel;//JSON.parse($scope.channel).uuid;
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            if (newValue) {
                this.activeChannelUUID = $scope.channel;//JSON.parse($scope.channel).uuid; 
            }
            this.UpdateFiles();
        }.bind(this));
        $scope.$watch('filesChatSelected', this.SelectFile.bind(this));

        this.UpdateFiles();
        $rootScope.$on("FileUploaded", () => {
            this.LoadFiles();
        });

        (<any>$('select#files-list')).selectmenu({
            style: 'popup',
            width: 410,
            height: 50,
            format: this.AddressFormatting
        });
    }
    AddressFormatting(text) {
        var newText = text;
        //array of find replaces
        var findreps = [
            { find: /^([^\|]+) \| /g, rep: '<div class="message-sender">$1</div>' },
            { find: /([^\|><\(\)]+)$/g, rep: '<div class="text">$1</div>' }
        ];
        for (var i in findreps) {
            newText = newText.replace(findreps[i].find, findreps[i].rep);
        }
        return newText;
    }

    SelectFile(): void {
        var newUUID = new UUIDPupNubModel();
        
        if (this.scope.filesChatSelected) {
            this.scope.Files.map((file) => {
                this.scope.filesChatSelected = $('select#files-list').val();
                if (file.id == this.scope.filesChatSelected) {
                    newUUID.uuid = file.filesChatUID;
                    this.scope.activeFileChannelUUID = newUUID;
                }
            });
        } else {
            this.scope.activeFileChannelUUID = newUUID;
        }
    }

    UpdateFiles(): void {
        if (!this.activeChannelUUID) {
            this.scope.isBlockVisible = false;
            return;
        }
        this.LoadFiles();
    }

    LoadFiles(): void {
        if (!this.activeChannelUUID) {
            return;
        }
        var chatUUID = JSON.parse(this.activeChannelUUID).uuid;
        this.contextService.Send("Files", "LoadFiles", { ChatUID: chatUUID }, (res) => {
            this.scope.filesChatSelected = "";
            this.scope.activeFileChannelUUID = ""
            if (res.data.length) {
                this.scope.isBlockVisible = true;
                this.scope.Files = res.data;
                this.timeout(() => {
                    (<any>$('select#files-list')).selectmenu();
                }, 1000);
            } else {
                this.scope.isBlockVisible = false;
                this.scope.Files = [];
            }
        });
    }

}
angular.module("app").controller('fileViewsController', fileViewsController);