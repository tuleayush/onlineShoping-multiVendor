const envconfig = {
    "dev": {
        "debugMode": true,
        "port": 8089,
        "hostName": "localhost",
        "protocol": "http",
        "database": {
            type: 'mongodb',
            "host": 'localhost',
            "port": 27017,
            "username": 'root',
            "password": 'root',
            "dbName": 'livestyleDB',
            "synchronize": false,
            "uri": "mongodb://SHEIDEO:345rtgCDfr3e@54.201.160.69:58173/SHEIDEO"


        },
        "jwt": {
            "expiresIn": "9h",
            "accessTokenSecret": 'bac71d1ec36961e65b696e7630e19af7f17714472786affaed17df08c3546df8',
            "refreshTokenSecret": '001dc946d699cded0e7282e46d358319817a66b36305632fc3eb220ca1d98d76'

        },
        "twillio": {
            "sid": "AC93e5166ab82b1a2b69e2e9a89d1f7678",
            "authToken": "37f65a653181c07432ba80501f5b51c4",
            "messagingServiceSid": {
                "OtpVerify": "MG4207fdd4f437f3d32a3c6955b0132915"
            }
        },
        "mailer": {
            "email": process.env.SMTP_USERNAME || "uydgch",
            "password": process.env.SMTP_PASSWORD || 'jhcgscjhdsgy'
        },
        "aws_s3": {
            "bucket": process.env.S3_BUCKET || 'sheideo-bucket',
            "accessKeyId": process.env.S3_KEYID || 'AKIA3NLWKZLR3VKA3TOO',
            "secretAccessKey": process.env.S3_ACCESSKEY || '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'
        }
    },
    "test": {},
    "stage": {},
    "prod": {
        "debugMode": false,
        "port": 3005,
        "hostName": process.env.HOSTNAME,
        "protocol": process.env.PROTOCOL,
        "database": {
            type: 'mongodb',
            uri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        },
        "jwt": {
            "expiresIn": process.env.JWT_EXPIRES_IN,
            "accessTokenSecret": process.env.JWT_SECRET_KEY

        },
        "mailer": {
            "email": process.env.SMTP_USERNAME,
            "password": process.env.SMTP_PASSWORD
        },
        "aws_s3": {
            "bucket": process.env.S3_BUCKET,
            "accessKeyId": process.env.S3_KEYID,
            "secretAccessKey": process.env.S3_ACCESSKEY
        },
        "twillio": {
            "sid": process.env.TWILIO_SID,
            "authToken": process.env.TWILIO_AUTH_TOKEN,
            "messagingServiceSid": {
                "OtpVerify": process.env.TWILIO_OTP_VERIFY
            }
        },
    }

}

module.exports = envconfig;