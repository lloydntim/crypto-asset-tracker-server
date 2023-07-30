import { ApolloError, AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

import { clientUrl } from '../../config';
import { mailhogConfig, nodemailerAuthConfig } from '../../config/credentials';
import { sendVerificationEmail, createToken } from './AuthHelper';

import User from '../user/UserModel';
import Token from './TokenModel';

import 'dotenv/config';

const { NODE_ENV } = process.env;

// const nodemailerMailgun = nodemailer.createTransport(mg(nodemailerAuthConfig));

const transportConfig =
  NODE_ENV === 'development' ? mailhogConfig : mg(nodemailerAuthConfig);
const nodemailerMailgun = nodemailer.createTransport(transportConfig);

export const register = async (
  parent,
  { username, email, password },
  { t /*,  Sentry */ }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username }));
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    const vToken = await Token.create({
      userId: user.id,
      token: crypto.randomBytes(20).toString('hex'),
    });

    if (!vToken)
      throw new AuthenticationError(t('token_error_tokenCouldNotBeCreated'));

    sendVerificationEmail(user, t, nodemailerMailgun);

    return createToken({ id: user.id, username }, 60 * 60);
  } catch (error) {
    console.log('error', error);
    // Sentry.captureException(error);
    throw new AuthenticationError(t('token_error_tokenCouldNotBeCreated'));
  }
};

export const login = async (
  parent,
  { username, password },
  { t /* , Sentry */ }
) => {
  // Sentry.configureScope((scope) => scope.setUser({ username }));
  try {
    const user = await User.findOne({ username });

    if (!user)
      throw new AuthenticationError(
        t('user_error_userCouldNotBeFound', { username })
      );

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new AuthenticationError(t('auth_error_incorrectPassword'));

    return createToken({ id: user.id, username }, '7d');
  } catch (error) {
    // Sentry.captureException(error);
    throw new AuthenticationError(error.message);
  }
};

export const verify = async (parent, { token }, { t /* , Sentry */ }) => {
  try {
    const verificationToken = await Token.findOne({ token });

    if (!verificationToken)
      throw new AuthenticationError(t('token_error_tokenNotValid'));

    const user = await User.findOne({ _id: verificationToken.userId });

    if (!user)
      throw new AuthenticationError(
        t('user_error_userWithIdCouldNotBeFound', {
          userId: verificationToken.userId,
        })
      );
    // Sentry.configureScope((scope) => scope.setUser({ username: user.username }));
    if (user.isVerified)
      throw new AuthenticationError(
        t('auth_error_userAlreadyVerified', { username: user.username })
      );

    user.isVerified = true;

    const updatedUser = await user.save();

    if (!updatedUser)
      throw new AuthenticationError(
        t('auth_error_userEmailCouldNotBeVerified')
      );

    return createToken({ id: user.id, username: user.username }, 60 * 60);
  } catch (error) {
    console.log(error);
    // Sentry.captureException(error);
    throw new AuthenticationError(error.message);
  }
};

export const resendVerificationToken = async (
  parent,
  { email, username },
  { t /*  Sentry */ }
) => {
  try {
    const user = await User.findOne({ email, username });

    if (!user)
      throw new AuthenticationError(
        t('auth_error_userHasNoSuchEmail', { username })
      );
    // Sentry.configureScope((scope) => scope.setUser({ username, email }));
    if (user.isVerified)
      throw new AuthenticationError(
        t('auth_error_userAlreadyVerified', { username })
      );

    sendVerificationEmail(user, t, nodemailerMailgun);
  } catch (error) {
    // Sentry.captureException(error);
    throw new AuthenticationError(error.message);
  }

  return {
    message: t('auth_success_verificationEmailSent'),
  };
};

export const createPasswordToken = async (
  parent,
  { username },
  { t /* , Sentry */ }
) => {
  try {
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    console.log('createPasswordToken - resetPasswordToken', resetPasswordToken);
    console.log('createPasswordToken - username', username);
    const currentUser = await User.findOneAndUpdate(
      { username },
      { resetPasswordToken, resetPasswordExpires: Date.now() + 3600000 },
      { new: true }
    );

    if (!currentUser)
      throw new ApolloError(t('user_error_userCouldNotBeFound', { username }));
    // Sentry.configureScope((scope) => scope.setUser({ username: currentUser.username, email: currentUser.email }));

    await nodemailerMailgun.sendMail({
      to: currentUser.email,
      from: 'password-reset@lloydntim.com',
      subject: t('auth_email_subject_passwordReset'),
      text: t('auth_email_content_passwordResetMessage', {
        username: currentUser.username,
        resetPasswordToken,
        domain: clientUrl,
        interpolation: { escapeValue: false },
      }),
    });

    return { message: t('auth_success_passwordEmailSent') };
  } catch (error) {
    // Sentry.captureException(error);
    throw new AuthenticationError(error.message);
  }
};

export const getPasswordToken = async (parent, args, { t /* , Sentry */ }) => {
  const { resetPasswordToken } = args;
  console.log('getPasswordToken - resetPasswordToken', resetPasswordToken);
  const currentUser = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  try {
    // if (!currentUser)
    //   throw new AuthenticationError(t('auth_error_passwordTokenInvalid'));

    const { id, username, email } = currentUser;

    // Sentry.configureScope((scope) => scope.setUser({ username, email }));
    return createToken({ id, username, email }, 60 * 10);
  } catch (error) {
    console.log('Error', error);
    throw new AuthenticationError(t('auth_error_passwordTokenInvalid'));
  }
};

export const updatePassword = async (
  parents,
  { password, resetPasswordToken },
  { t /* , Sentry */ }
) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const currentUser = await User.findOneAndUpdate(
      {
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
      },
      {
        password: hash,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      }
    );

    if (!currentUser)
      throw new AuthenticationError(t('auth_error_passwordTokenInvalid'));

    const { id, username, email } = currentUser;
    // Sentry.configureScope((scope) => scope.setUser({ username, email }));
    nodemailerMailgun.sendMail({
      to: email,
      from: 'password-reset@lloydntim.com',
      subject: t('auth_email_subject_passwordChanged'),
      text: t('auth_email_content_passwordChangeMessage', { email, username }),
    });

    return createToken({ id, username, email }, 60 * 10);
  } catch (error) {
    // Sentry.captureException(error);
    throw new AuthenticationError(error.message);
  }
};

export default {
  login,
  register,
  verify,
  resendVerificationToken,
  createPasswordToken,
  getPasswordToken,
  updatePassword,
};
