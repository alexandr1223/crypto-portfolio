import { PortfolioSchema } from 'entities/Portfolio';
import { UserSchema } from 'entities/User';
import { LoginByUsernameSchema } from 'features/loginByUsername/model/types/loginByUsernameSchema';
import { RegisterByUsernameSchema } from 'features/registerByUsername';

export interface StateSchema {
  loginByUsername: LoginByUsernameSchema;
  registerByUsername: RegisterByUsernameSchema;
  portfolio: PortfolioSchema;
  user: UserSchema;
  coinsAPI: any;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  state: StateSchema;
}
