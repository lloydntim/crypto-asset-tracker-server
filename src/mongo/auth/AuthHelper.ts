import crypto, { JsonWebKey } from 'crypto';
import jwt from 'jsonwebtoken';

import { CLIENT_DOMAIN } from '../../config';
import { jwtSecret } from '../../config/credentials';

import Token from './TokenModel';
import { appolloServiceLogger } from '../../helpers/logger';
import { TFunction } from 'i18next';
import { InternalServerException } from '../../graphql/errors';

export const SENDER_EMAIL = 'email-verification@crypt-oasset-tracker.com';
export const VERIFICATION_EMAIL = 'email-verification@lloydntim.com';
export const PASSWORD_RESET_EMAIL = 'password-reset@lloydntim.com';

export const sendVerificationEmail = async (
  { email, username, id }: { email?: string; username?: string; id?: string },
  t: TFunction,
  nodemailerMailgun
) => {
  try {
    const { token } = await Token.create({
      userId: id,
      token: crypto.randomBytes(20).toString('hex'),
    });

    await nodemailerMailgun.sendMail({
      to: email,
      from: SENDER_EMAIL,
      subject: t('auth_email_subject_emailVerification'),
      text: t('auth_email_content_emailVerificationMessage', {
        username,
        domain: CLIENT_DOMAIN,
        token,
        interpolation: { escapeValue: false },
      }),
    });
  } catch (error) {
    appolloServiceLogger.error(error);
    throw new InternalServerException(error);
  }
};

export const createToken = (
  user: { id: string; username: string; email?: string },
  expiresIn: string | number
): { token: JsonWebKey } => ({
  token: jwt.sign(user, jwtSecret, { expiresIn }),
});
