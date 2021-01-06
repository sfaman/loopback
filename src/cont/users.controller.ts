import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Users } from '../models';
import { UsersRepository } from '../repositories';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../types';

export class UsersController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository
  ) {}

  @post('/users', {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @get('/users/count', {
    responses: {
      '200': {
        description: 'Users model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(@param.where(Users) where?: Where<Users>): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of Users model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Users, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @patch('/users', {
    responses: {
      '200': {
        description: 'Users PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, { exclude: 'where' })
    filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.ViewUsers] })
  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() users: Users
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: [PermissionKey.DeleteUsers] })
  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'Users DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usersRepository.deleteById(id);
  }
}
