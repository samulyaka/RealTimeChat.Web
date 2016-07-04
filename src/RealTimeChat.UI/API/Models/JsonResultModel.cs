namespace RealTimeChat.UI.API.Models
{
    public class JsonResultModel<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public string ErrorMessage { get; set; }
    }
}
