using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;

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
