import jwt from 'jsonwebtoken';
import { appolloServiceLogger } from '../helpers/logger';
import { t } from 'i18next';
import { UnauthorizedException } from '../graphql/errors';

export const authenticateUser = (token) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    appolloServiceLogger.info(user);

    return user;
  } catch (error) {
    throw new UnauthorizedException(t('auth_error_userMustBeLoggedIn'));
  }
};
