import { EntityRepository } from '@mikro-orm/postgresql';
import { Stock } from '../entity/stock.entity';

export class StockRepository extends EntityRepository<Stock> {}
