var pubnubService = (function () {
    function pubnubService($q, $location, Pubnub) {
        this.q = $q;
        this.location = $location;
        this.Pubnub = Pubnub;
    }
    return pubnubService;
}());
angular
    .module('app')
    .service('pubnubService', pubnubService);
