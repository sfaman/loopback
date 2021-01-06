import { repository } from '@loopback/repository';
import { getModelSchemaRef, post, requestBody } from '@loopback/rest';
import { Users } from '../models';
import { UsersRepository } from '../repositories';
import { authorize } from 'loopback4-authorization';

export class SignUpController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository
  ) {}

  @authorize({ permissions: ['*'] })
  @post('/signup', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Users) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>
  ): Promise<Users> {
    return this.usersRepository.create(users);
  }
}
