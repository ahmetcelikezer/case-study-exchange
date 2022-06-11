import { Migration } from '@mikro-orm/migrations';

export class Migration20220608223449 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "email" varchar(255) not null, "password" varchar(255) not null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }
}
