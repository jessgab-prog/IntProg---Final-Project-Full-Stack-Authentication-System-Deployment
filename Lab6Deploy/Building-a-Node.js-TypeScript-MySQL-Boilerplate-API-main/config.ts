import dotenv from 'dotenv';
dotenv.config();

let fileConfig: any = {};
try {
    fileConfig = require('./config.json');
} catch (e) {
    fileConfig = {};
}

export default {
    database: {
        host: process.env.DB_HOST || fileConfig.database?.host,
        port: Number(process.env.DB_PORT) || fileConfig.database?.port,
        user: process.env.DB_USER || fileConfig.database?.user,
        password: process.env.DB_PASSWORD || fileConfig.database?.password,
        database: process.env.DB_NAME || fileConfig.database?.database
    },
    secret: process.env.JWT_SECRET || fileConfig.secret || '',
    emailFrom: process.env.EMAIL_FROM || fileConfig.emailFrom,
    smtpOptions: {
        host: process.env.SMTP_HOST || fileConfig.smtpOptions?.host,
        port: Number(process.env.SMTP_PORT) || fileConfig.smtpOptions?.port,
        auth: {
            user: process.env.SMTP_USER || fileConfig.smtpOptions?.auth?.user,
            pass: process.env.SMTP_PASS || fileConfig.smtpOptions?.auth?.pass
        }
    }
};