using System;
using System.Collections.Generic;
using Amazon;
using Amazon.Runtime;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;

namespace Common.Utility.Sms
{
    //Envio de SMS por AWS SNS con el mismo usuario IAM y region que Common.Utility.Archivos, asi no hay un segundo
    //juego de credenciales que mantener. Ese usuario necesita permiso sns:Publish.
    public static class Sms
    {
        //AmazonSimpleNotificationServiceClient es thread-safe: una sola instancia para toda la app.
        private static readonly Lazy<IAmazonSimpleNotificationService> _client = new Lazy<IAmazonSimpleNotificationService>(() =>
            new AmazonSimpleNotificationServiceClient(
                new BasicAWSCredentials(Archivos.Archivos.AccessKey, Archivos.Archivos.SecretKey),
                RegionEndpoint.GetBySystemName(Archivos.Archivos.Region)));

        //telefono va en formato internacional con el "+" adelante (ej "+5491155555555"), que es lo que pide SNS.
        public static void Enviar(string telefono, string texto)
        {
            var request = new PublishRequest
            {
                PhoneNumber = telefono,
                Message = texto,
                //Transactional prioriza la entrega sobre el costo: un codigo de acceso que llega tarde no sirve.
                MessageAttributes = new Dictionary<string, MessageAttributeValue>
                {
                    { "AWS.SNS.SMS.SMSType", new MessageAttributeValue { DataType = "String", StringValue = "Transactional" } }
                }
            };

            _client.Value.PublishAsync(request).GetAwaiter().GetResult();
        }
    }
}
