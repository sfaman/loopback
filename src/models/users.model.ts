import { Entity, model, property, belongsTo } from '@loopback/repository';
import { IAuthUser } from 'loopback4-authentication';
import { Customer } from './customer.model';
import { Role } from './role.model';
import { SoftDeleteEntity } from 'loopback4-soft-delete';

@model()
export class Users extends SoftDeleteEntity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  firstname?: string;

  @property({
    type: 'string',
  })
  middlename?: string;

  @property({
    type: 'string',
  })
  lastname?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  phoneNo?: string;

  @property({
    type: 'string',
  })
  role?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  createdOn?: string;

  @property({
    type: 'string',
  })
  modifiedOn?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  @belongsTo(() => Customer)
  customerId: number;

  @belongsTo(() => Role)
  roleId: number;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
