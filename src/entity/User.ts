import { IsEmail, IsEnum, Length } from 'class-validator'
import { Entity, Column, OneToMany } from 'typeorm'

import Model from './Model'
import { Post } from './Post'

@Entity('users')
export class User extends Model {
  @Column()
  @Length(1, 255)
  name: string

  @Column()
  @Length(1, 255)
  @IsEmail()
  email: string

  @Column({
    type: 'enum',
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  })
  @IsEnum(['user', 'admin', 'superadmin', undefined])
  role: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]
}
