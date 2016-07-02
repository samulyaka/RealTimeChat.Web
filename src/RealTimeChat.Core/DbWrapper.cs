using System;
using System.Data;
using System.Data.SqlClient;

namespace RealTimeChat.Core
{
    public class DbWrapper : IDisposable
    {
        public DbWrapper(string connectionString)
        {
            ConnectionString = connectionString;
        }
        
        private readonly string ConnectionString;
        private SqlConnection connection;
        public SqlConnection Connection
        {
            get
            {
                if (connection == null)
                {
                    connection = new SqlConnection(this.ConnectionString);
                }
                return connection;
            }
        }

        internal int ExecuteNonQuery(string cmdText, params SqlParameter[] cmdParms)
        {
            SqlCommand cmd = this.Connection.CreateCommand();
            PrepareCommand(cmd, null, CommandType.Text, cmdText, cmdParms);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
            
        }

        internal int ExecuteNonQuery(CommandType cmdType, string cmdText, params SqlParameter[] cmdParms)
        {
            SqlCommand cmd = this.Connection.CreateCommand();
            PrepareCommand(cmd, null, cmdType, cmdText, cmdParms);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
        }


        internal  SqlDataReader ExecuteReader(CommandType cmdType, string cmdText, params SqlParameter[] cmdParms)
        {
            SqlCommand cmd = this.Connection.CreateCommand();
            PrepareCommand(cmd, null, cmdType, cmdText, cmdParms);
            var rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            return rdr; 
        }


        internal object ExecuteScalar(CommandType cmdType, string cmdText, params SqlParameter[] cmdParms)
        {
            SqlCommand cmd = this.Connection.CreateCommand();
            PrepareCommand(cmd, null, cmdType, cmdText, cmdParms);
            object val = cmd.ExecuteScalar();
            cmd.Parameters.Clear();
            return val; 
        }

        internal void PrepareCommand(SqlCommand cmd, SqlTransaction trans, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            if (this.Connection.State != ConnectionState.Open)
            {
                this.Connection.Open();
            }
            cmd.Connection = this.Connection;
            cmd.CommandText = cmdText;
            if (trans != null)
            {
                cmd.Transaction = trans;
            }
            cmd.CommandType = cmdType;
            if (commandParameters != null)
            {
                AttachParameters(cmd, commandParameters);
            }
        }
        internal void AttachParameters(SqlCommand command, params SqlParameter[] commandParameters)
        {
            foreach (SqlParameter p in commandParameters)
            {
                if ((p.Direction == ParameterDirection.InputOutput) && (p.Value == null))
                {
                    p.Value = DBNull.Value;
                }

                command.Parameters.Add(p);
            }
        }

        public void Dispose()
        {
            this.Connection.Dispose();
        }
    }
}
