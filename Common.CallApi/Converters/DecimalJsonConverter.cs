using System;
using Newtonsoft.Json;

namespace Common.CallApi.Converters
{
    public sealed class DecimalJsonConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(decimal));
        }

        public override object ReadJson(JsonReader reader, Type objectType,
                                        object existingValue, JsonSerializer serializer)
        {
            switch (reader.TokenType)
            {
                case JsonToken.String:
                    if ((string)reader.Value == string.Empty)
                    {
                        return decimal.MinValue;
                    }
                    var a = Convert.ToDecimal(reader.Value);
                    return a;
                case JsonToken.Float:
                case JsonToken.Integer:
                    return Convert.ToDecimal(reader.Value);
            }

            throw new JsonSerializationException(string.Format("Unexpected token type: {0}", reader.TokenType));
        }

        public override void WriteJson(JsonWriter writer, object value,
                                       JsonSerializer serializer)
        {
            decimal dec = (decimal)value;
            if (dec == decimal.MinValue)
            {
                writer.WriteValue(string.Empty);
            }
            else
            {
                writer.WriteValue(dec);
            }
        }
    }
}