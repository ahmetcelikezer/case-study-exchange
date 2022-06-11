import { Migration } from '@mikro-orm/migrations';

export class Migration20220611202432 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "wallet" ("id" uuid not null, "balance" decimal(15,2) not null default 0);',
    );
    this.addSql(
      'alter table "wallet" add constraint "wallet_pkey" primary key ("id");',
    );

    this.addSql('alter table "user" add column "wallet_id" uuid not null;');
    this.addSql(
      'alter table "user" add constraint "user_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "user" add constraint "user_wallet_id_unique" unique ("wallet_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_wallet_id_foreign";');

    this.addSql('drop table if exists "wallet" cascade;');

    this.addSql('alter table "user" drop constraint "user_wallet_id_unique";');
    this.addSql('alter table "user" drop column "wallet_id";');
  }
}
