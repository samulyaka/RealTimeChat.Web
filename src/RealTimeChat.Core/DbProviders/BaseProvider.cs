namespace RealTimeChat.Core.DbProviders
{
    public class BaseProvider
    {
        protected BaseProvider(DbWrapper connection)
        {
            this.Connection = connection;
        }
        protected readonly DbWrapper Connection;
    }
}
