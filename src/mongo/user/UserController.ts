import { InternalServerException } from '../../graphql/errors';
import { mongoClientLogger } from '../../helpers/logger';
import { authenticateUser } from '../../middleware';
import User from './UserModel';

export const getUser = async (parent, { id, username }, { token, t }) => {
  authenticateUser(token);

  try {
    return id
      ? await User.findById(id).select({ password: 0, __v: 0 })
      : await User.findOne({ username }).select({ password: 0, __v: 0 });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new InternalServerException(
      t('user_error_listCouldNotBeRetrieved', { id })
    );
  }
};

export const getUsers = async (parent, args, { token, t }) => {
  authenticateUser(token);

  try {
    return await User.find({}).select({ password: 0, __v: 0 });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new InternalServerException(t('user_error_usersCouldNotBeRetrieved'));
  }
};

export const updateUser = async (parent, { id, email }, { token, t }) => {
  authenticateUser(token);

  try {
    return await User.findByIdAndUpdate(
      id,
      { $set: { email } },
      { new: true }
    ).select({ password: 0, __v: 0 });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new InternalServerException(t('user_error_userCouldNotBeUpdated'));
  }
};

export const removeUser = async (parent, args, { token, t }) => {
  authenticateUser(token);

  try {
    // Returns removed user
    return User.findOneAndRemove({ _id: args.id });
  } catch (error) {
    mongoClientLogger.error(error);
    throw new InternalServerException(t('user_error_userCouldNotBeRemoved'));
  }
};

export default {
  getUser,
  getUsers,
  updateUser,
  removeUser,
};
