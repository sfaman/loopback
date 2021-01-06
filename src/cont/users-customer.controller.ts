import { repository } from '@loopback/repository';
import { param, get, getModelSchemaRef } from '@loopback/rest';
import { Users, Customer } from '../models';
import { UsersRepository } from '../repositories';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../types';

export class UsersCustomerController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @get('/users/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Users',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Customer) },
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.number('id') id: typeof Users.prototype.id
  ): Promise<Customer> {
    return this.usersRepository.customer(id);
  }
}
