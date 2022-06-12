import { Migration } from '@mikro-orm/migrations';

export class Migration20220612132105 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "transaction" drop column "amount";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "transaction" add column "amount" int not null;');
  }
}
