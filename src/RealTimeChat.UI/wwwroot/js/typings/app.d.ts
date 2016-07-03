
interface GlobalConfigModel {
    baseUrl: string;
    baseApiUlr: string;
    PubNubSettings: PubNubSettingsModel;
}
interface PubNubSettingsModel {
    PublishKey: string;
    SubscribeKey: string;
}