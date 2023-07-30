import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import { holdingsItems } from './mongo/data';
import { processCoinsData, processHoldingsData } from './helpers';

const app = express();

const apiVersion = '1';
const routes = express.Router();
const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || /http:\/\/localhost:*/;

const cmcApiKey = process.env.CMC_PRO_API_KEY;
const cmcUrl =
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

const getCryptoData = async (req, res) => {
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

const getHoldingsData = async (req, res) => {
  try {
    const holdingsData = processHoldingsData(holdingsItems);
    res.status(200).json({ results: holdingsData });
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Something went wrong');
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Website you wish to allow to connect
app.use(cors({ origin: clientUrl }));

// Add headers
app.use((req, res, next) => {
  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Pass to next layer of middleware
  next();
});

app.use(`/api/v${apiVersion}/`, routes);

app.get('/', (req, res) => {
  res.send('Welcome to LNCD Crypto Checker API');
});

routes.get('/holdings', getHoldingsData);
routes.get('/coins', getCryptoData);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
