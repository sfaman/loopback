import { DefaultCrudRepository } from '@loopback/repository';
import { Customer, CustomerRelations } from '../models';
import { PgDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  constructor(@inject('datasources.pg') dataSource: PgDataSource) {
    super(Customer, dataSource);
  }
}
