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
import { appolloServiceLogger, mongoClientLogger } from '../../helpers/logger';

const { NODE_ENV } = process.env;
const transportConfig =
  NODE_ENV === 'development' ? mailhogConfig : mg(nodemailerAuthConfig);
const nodemailerMailgun = nodemailer.createTransport(transportConfig);

export const register = async (
  parent,
  { username, email, password },
  { t }
) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    const vToken = await Token.create({
      userId: user.id,
      token: crypto.randomBytes(20).toString('hex'),
    });

    if (!vToken) throw new Error(t('token_error_tokenCouldNotBeCreated'));

    sendVerificationEmail(user, t, nodemailerMailgun);

    return createToken({ id: user.id, username }, 60 * 60);
  } catch (error) {
    appolloServiceLogger.error(error);
    throw new Error(t('token_error_tokenCouldNotBeCreated'));
  }
};

export const login = async (parent, { username, password }, { t }) => {
  try {
    const user = await User.findOne({ username });

    if (!user)
      throw new Error(t('user_error_userCouldNotBeFound', { username }));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error(t('auth_error_incorrectPassword'));

    return createToken({ id: user.id, username }, '7d');
  } catch (error) {
    mongoClientLogger.error(error);
    throw new Error(error.message);
  }
};

export const verify = async (parent, { token }, { t }) => {
  try {
    const verificationToken = await Token.findOne({ token });

    if (!verificationToken) throw new Error(t('token_error_tokenNotValid'));

    const user = await User.findOne({ _id: verificationToken.userId });

    if (!user)
      throw new Error(
        t('user_error_userWithIdCouldNotBeFound', {
          userId: verificationToken.userId,
        })
      );
    if (user.isVerified)
      throw new Error(
        t('auth_error_userAlreadyVerified', { username: user.username })
      );

    user.isVerified = true;

    const updatedUser = await user.save();

    if (!updatedUser)
      throw new Error(t('auth_error_userEmailCouldNotBeVerified'));

    return createToken({ id: user.id, username: user.username }, 60 * 60);
  } catch (error) {
    appolloServiceLogger.error(error);
    throw new Error(error.message);
  }
};

export const resendVerificationToken = async (
  parent,
  { email, username },
  { t }
) => {
  try {
    const user = await User.findOne({ email, username });

    if (!user)
      throw new Error(t('auth_error_userHasNoSuchEmail', { username }));
    if (user.isVerified)
      throw new Error(t('auth_error_userAlreadyVerified', { username }));

    sendVerificationEmail(user, t, nodemailerMailgun);
  } catch (error) {
    appolloServiceLogger.error(error);
    throw new Error(error.message);
  }

  return {
    message: t('auth_success_verificationEmailSent'),
  };
};

export const createPasswordToken = async (parent, { username }, { t }) => {
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
      throw new Error(t('user_error_userCouldNotBeFound', { username }));

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
    appolloServiceLogger.error(error);
    throw new Error(error.message);
  }
};

export const getPasswordToken = async (parent, args, { t }) => {
  const { resetPasswordToken } = args;
  const currentUser = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  try {
    if (!currentUser) throw new Error(t('auth_error_passwordTokenInvalid'));

    const { id, username, email } = currentUser;

    return createToken({ id, username, email }, 60 * 10);
  } catch (error) {
    appolloServiceLogger.error(error);
    throw new Error(t('auth_error_passwordTokenInvalid'));
  }
};

export const updatePassword = async (
  parents,
  { password, resetPasswordToken },
  { t }
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

    if (!currentUser) throw new Error(t('auth_error_passwordTokenInvalid'));

    const { id, username, email } = currentUser;

    nodemailerMailgun.sendMail({
      to: email,
      from: 'password-reset@lloydntim.com',
      subject: t('auth_email_subject_passwordChanged'),
      text: t('auth_email_content_passwordChangeMessage', { email, username }),
    });

    return createToken({ id, username, email }, 60 * 10);
  } catch (error) {
    appolloServiceLogger.error(error);
    throw new Error(error.message);
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
