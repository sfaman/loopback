import {
  DataObject,
  DefaultCrudRepository,
  Options,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import { Users, UsersRelations, Customer, Role } from '../models';
import { PgDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import bcrypt from 'bcrypt';
import { CustomerRepository } from './customer.repository';
import { RoleRepository } from './role.repository';
import { SoftCrudRepository } from 'loopback4-soft-delete';

const saltRounds = 10;
export class UsersRepository extends SoftCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  public readonly customer: BelongsToAccessor<
    Customer,
    typeof Users.prototype.id
  >;

  public readonly role: BelongsToAccessor<Role, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>
  ) {
    super(Users, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor(
      'customer',
      customerRepositoryGetter
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }

  async create(entity: DataObject<Users>, options?: Options): Promise<Users> {
    try {
      // Add password for first time
      entity.password = await bcrypt.hash(entity.password, saltRounds);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    if (entity.email) {
      entity.email = entity.email.toLowerCase();
    }
    return super.create(entity, options);
  }

  async verifyPassword(username: string, password: string): Promise<Users> {
    const user = await super.findOne({ where: { username } });
    if (!user || !user.password) {
      throw new HttpErrors.Unauthorized('UserDoesNotExist');
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpErrors.Unauthorized('InvalidCredentials');
    }
    return user;
  }
}
