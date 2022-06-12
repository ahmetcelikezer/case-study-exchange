import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { LoadStrategy } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const config: Options = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/entity/*.entity.js'],
  entitiesTs: ['src/**/entity/*.entity.ts'],
  debug: process.env.NODE_ENV !== 'production',
  loadStrategy: LoadStrategy.JOINED,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  registerRequestContext: false,
  seeder: {
    path: 'dist/src/seeders',
    pathTs: 'src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default config;
