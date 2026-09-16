using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Common.Utility
{

    public class Redis
    {
        const string r = "";
        ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(r);
       
        /// <summary>
        /// Save data in Redis. Keep object serialize
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void saveValue(string key, object value) {
            IDatabase db = redis.GetDatabase();
            db.StringSet(key, JsonConvert.SerializeObject(value));
        }

        /// <summary>
        /// get object deserialize
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>
        public T getValue<T>(string key){
            string valor = redis.GetDatabase().StringGet(key);
            T value = JsonConvert.DeserializeObject<T>(valor);
            return value;
        }

        /// <summary>
        /// Delete object in DB
        /// </summary>
        /// <param name="key"></param>
        public void delete(string key)
        {
            redis.GetDatabase().KeyDelete(key);
        }


    }
}
