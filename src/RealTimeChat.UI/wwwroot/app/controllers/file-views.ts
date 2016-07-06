class fileViewsController {
    public scope: any;
    public rootScope: any;
    public contextService: ContextService;
    public timeout: ng.ITimeoutService;
    public activeChannelUUID: string;
    public filesChatSelected: string;
    public activeFileChannelUUID: UUIDPupNubModel;
    static $inject = ['$scope', '$rootScope', 'contextService', '$timeout', '$window'];
    constructor($scope: any, $rootScope: any, contextService: ContextService, $timeout: ng.ITimeoutService, $window: any) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.contextService = contextService;
        this.scope.Context = contextService;
        this.timeout = $timeout;
        this.scope.moment = $window.moment;
        this.scope.isBlockVisible = true;
        this.filesChatSelected = "";
        this.scope.activeFileChannelUUID = null;
        if ($scope.channel) {
            this.activeChannelUUID = $scope.channel;
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            if (newValue) {
                this.activeChannelUUID = $scope.channel; 
            }
            this.UpdateFiles();
        }.bind(this));

        this.UpdateFiles();
        $scope.$root.$on("FileUploaded", () => {
            this.LoadFiles();
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
        
        if (this.filesChatSelected) {
            this.scope.Files.map((file) => {
                if (file.id == this.filesChatSelected) {
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
            this.filesChatSelected = "";
            var newUUID = new UUIDPupNubModel();
            if (res.data.length > 0) {
                this.scope.isBlockVisible = true;
                this.scope.Files = res.data;

                newUUID.uuid = res.data[res.data.length-1].filesChatUID;
                this.filesChatSelected = res.data[res.data.length - 1].id + "";
            } else {
                this.scope.isBlockVisible = false;
                this.scope.Files = [];
            }
            this.scope.activeFileChannelUUID = newUUID;
            setTimeout(function () {
                if (this.scope.$root.$$phase != '$apply' && this.scope.$root.$$phase != '$digest') {
                    this.scope.$apply();
                }
            }.bind(this), 5000);
        });
    }

}
angular.module("app").controller('fileViewsController', fileViewsController);