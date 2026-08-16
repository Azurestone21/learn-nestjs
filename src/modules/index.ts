import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';

export const modules = [CatsModule, UsersModule, AuthModule];
