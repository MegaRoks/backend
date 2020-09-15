import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['./dist/**/*.entity.{js,ts}'],
    synchronize: true,
    logging: false,
    migrationsRun: false,
    migrations: ['./dist/modules/database/migration/*.{js,ts}'],
    cli: {
        migrationsDir: 'src/modules/database/migration',
    },
};
