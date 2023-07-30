import { ApolloError } from 'apollo-server-express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { domain, clientUrl } from '../../config';
import { jwtSecret } from '../../config/credentials';

import Token from './TokenModel';

export const VERIFICATION_EMAIL = 'email-verification@lloydntim.com';
export const PASSWORD_RESET_EMAIL = 'password-reset@lloydntim.com';

export const sendVerificationEmail = async (
  { email, username, id }: { email?: string; username?: string; id?: string },
  t,
  nodemailerMailgun
) => {
  try {
    const { token } = await Token.create({
      userId: id,
      token: crypto.randomBytes(20).toString('hex'),
    });

    await nodemailerMailgun.sendMail({
      to: email,
      // from: 'email-verification@lloydntim.com',
      from: 'noreply@test.com',
      subject: t('auth_email_subject_emailVerification'),
      text: t('auth_email_content_emailVerificationMessage', {
        username,
        domain: clientUrl,
        token,
        interpolation: { escapeValue: false },
      }),
    });
  } catch (error) {
    // console.log('Error', error);
    // Sentry.captureException(error);
    throw new ApolloError(error);
  }
};

export const createToken = (user, expiresIn) => ({
  token: jwt.sign(user, jwtSecret, { expiresIn }),
});
