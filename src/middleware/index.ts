import jwt from 'jsonwebtoken';
import { appolloServiceLogger } from '../helpers/logger';
import { t } from 'i18next';

// export const getCurrentUser = (token) => {
//   try {
//     const user = jwt.verify(token, process.env.JWT_SECRET);
//     appolloServiceLogger.info(user);

//     return { ...user, ...{ loggedIn: true } };
//   } catch (error) {
//     // appolloServiceLogger.error(error);
//     throw new Error(t('auth_error_userMustBeLoggedIn'));
//     /*
//     return {
//       loggedIn: false,
//     }; */
//   }
// };

export const authenticateUser = (token) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    appolloServiceLogger.info(user);

    return user;
  } catch (error) {
    // appolloServiceLogger.error(error);
    throw new Error(t('auth_error_userMustBeLoggedIn'));
    /*
    return {
      loggedIn: false,
    }; */
  }
};
