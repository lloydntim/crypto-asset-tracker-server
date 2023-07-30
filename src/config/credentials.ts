import 'dotenv/config';

const { NODEMAILER_DOMAIN, NODEMAILER_API_KEY, JWT_SECRET, CMC_PRO_API_KEY } =
  process.env;

export const nodemailerAuthConfig = {
  auth: {
    api_key: NODEMAILER_API_KEY,
    domain: NODEMAILER_DOMAIN,
  },
};

export const mailhogConfig = {
  host: '0.0.0.0',
  port: '1025',
  auth: {
    user: 'admin',
    pass: 'admin',
  },
};

export const jwtSecret = JWT_SECRET;

export const cmcApiKey = CMC_PRO_API_KEY;
