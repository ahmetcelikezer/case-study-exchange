import { Migration } from '@mikro-orm/migrations';

export class Migration20220612030125 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "stock" ("symbol" varchar(3) not null, "name" varchar(255) not null);',
    );
    this.addSql(
      'alter table "stock" add constraint "stock_pkey" primary key ("symbol");',
    );

    this.addSql(
      'create table "stock_price" ("id" uuid not null, "stock_symbol" varchar(3) not null, "rate" decimal(15,2) not null, "issued_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "stock_price" add constraint "stock_price_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "transaction" ("id" uuid not null, "stock_symbol" varchar(3) not null, "amount" int not null, "rate" decimal(15,2) not null, "from_id" uuid not null, "to_id" uuid null, "created_at" timestamptz(0) not null, "completed_at" timestamptz(0) null);',
    );
    this.addSql(
      'alter table "transaction" add constraint "transaction_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "stock_price" add constraint "stock_price_stock_symbol_foreign" foreign key ("stock_symbol") references "stock" ("symbol") on update cascade;',
    );

    this.addSql(
      'alter table "transaction" add constraint "transaction_stock_symbol_foreign" foreign key ("stock_symbol") references "stock" ("symbol") on update cascade;',
    );
    this.addSql(
      'alter table "transaction" add constraint "transaction_from_id_foreign" foreign key ("from_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "transaction" add constraint "transaction_to_id_foreign" foreign key ("to_id") references "user" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "stock_price" drop constraint "stock_price_stock_symbol_foreign";',
    );

    this.addSql(
      'alter table "transaction" drop constraint "transaction_stock_symbol_foreign";',
    );

    this.addSql('drop table if exists "stock" cascade;');

    this.addSql('drop table if exists "stock_price" cascade;');

    this.addSql('drop table if exists "transaction" cascade;');
  }
}
