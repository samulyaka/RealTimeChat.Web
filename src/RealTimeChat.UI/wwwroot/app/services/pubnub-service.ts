class pubnubService {
    protected q: any;
    protected Pubnub: any;
    protected location: ng.ILocationService;

    constructor($q: any, $location: ng.ILocationService, Pubnub:any) {
        this.q = $q;
        this.location = $location;
        this.Pubnub = Pubnub;
    }
}

angular
    .module('app')
    .service('pubnubService', pubnubService);