import { AuthenticationError } from 'apollo-server-express';
import User from './UserModel';

export const getUser = async (
  parent,
  { id, username },
  { currentUser, t, Sentry }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    return id
      ? await User.findById(id).select({ password: 0, __v: 0 })
      : await User.findOne({ username }).select({ password: 0, __v: 0 });
  } catch (error) {
    // Sentry.captureException(error);
    throw new AuthenticationError(
      t('user_error_listCouldNotBeRetrieved', { id })
    );
  }
};

export const getUsers = async (parent, args, { currentUser, t, Sentry }) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    return await User.find({}).select({ password: 0, __v: 0 });
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('user_error_usersCouldNotBeRetrieved'));
  }
};

export const updateUser = async (parent, { id, email }, { currentUser, t }) => {
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    return await User.findByIdAndUpdate(
      id,
      { $set: { email } },
      { new: true }
    ).select({ password: 0, __v: 0 });
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('user_error_userCouldNotBeUpdated'));
  }
};

export const removeUser = async (parent, args, { currentUser, t, Sentry }) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    // Returns removed user
    return User.findOneAndRemove({ _id: args.id });
  } catch (error) {
    console.log('removeUser error', error);
    // Sentry.captureException(error);
    throw new Error(t('user_error_userCouldNotBeRemoved'));
  }
};

export default {
  getUser,
  getUsers,
  updateUser,
  removeUser,
};
