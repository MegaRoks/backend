import { utilities, WinstonModuleOptions } from 'nest-winston';
import { config, format, transports } from 'winston';

export const winstonConfig: WinstonModuleOptions = {
    levels: config.npm.levels,
    level: 'verbose',
    transports: [
        new transports.Console({
            format: format.combine(format.timestamp(), utilities.format.nestLike()),
        }),
        new transports.File({
            level: 'verbose',
            filename: 'application.log',
            dirname: 'logs',
        }),
    ],
};
