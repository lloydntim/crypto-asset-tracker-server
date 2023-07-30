import axios from 'axios';
// import dotEnv from 'dotenv';
import { AuthenticationError } from 'apollo-server-express';

import List from './ListModel';
import { processCoinsData, processHoldingsData } from '../../helpers';
import { cmcApiKey } from '../../config/credentials';
import { cmcUrl } from '../../config';

// dotEnv.config(({ debug: process.env.DEBUG }));

export const getList = async (
  parent,
  { id, name },
  { currentUser, t, Sentry }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    return (await id) ? List.findById(id) : List.findOne({ name });
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('list_error_listCouldNotBeRetrieved'));
  }
};

export const getLists = async (
  parent,
  { creatorId },
  { currentUser, t, Sentry }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return await List.find({ creatorId });
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('list_error_listCouldNotBeRetrieved'));
  }
};

export const addList = async (
  parent,
  { name, data, creatorId },
  { currentUser, t, Sentry }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));

  try {
    return await List.create({ name, data, creatorId });
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('list_error_listCouldNotBeAdded'));
  }
};

export const updateList = async (
  parent,
  { id, name, data },
  { currentUser, t, Sentry }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  if (!currentUser.loggedIn)
    throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    return await List.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name || null,
          data: name || null,
        },
      },
      { new: true }
    );
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('list_error_listCouldNotBeUpdated'));
  }
};

export const removeList = async (parent, args, { currentUser, t, Sentry }) => {
  // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username }));
  // if (!currentUser.loggedIn) throw new AuthenticationError(t('auth_error_userMustBeLoggedIn'));
  try {
    const { id: _id, creatorId } = args;
    return creatorId
      ? await List.deleteMany({ creatorId })
      : await List.findOneAndDelete({ _id });
  } catch (error) {
    // Sentry.captureException(error);
    throw new Error(t('list_error_listCouldNotBeRemoved'));
  }
};

export const getCryptoData = async (req, res) => {
  try {
    const { idList, currency } = req.query;
    const response = await axios.get(cmcUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': cmcApiKey,
      },
      params: {
        id: idList,
        convert: currency,
      },
    });

    const results = processCoinsData(response.data.data, currency);

    res.status(200).json({ results });
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Something went wrong');
  }
};

export const getHoldingsData = async (req, res) => {
  try {
    const holdingsData = processHoldingsData([]);
    res.status(200).json({ results: holdingsData });
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Something went wrong');
  }
};

export default {
  getList,
  getLists,
  addList,
  updateList,
  removeList,
};
