
interface GlobalConfigModel {
    baseUrl: string;
    baseApiUlr: string;
    PubNubSettings: PubNubSettingsModel;
    NoAvatarUrl: string;
}
interface PubNubSettingsModel {
    publishKey: string;
    subscribeKey: string;
}