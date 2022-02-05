import express from 'express';
import axios from 'axios';
import 'dotenv/config';

import { holdingsItems } from './data';
import { processCoinsData, processHoldingsData } from './helpers';

const app = express();

const apiVersion = '1';
const routes = express.Router();
const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3002';

const cmcApiKey = process.env.CMC_PRO_API_KEY;
const cmcUrl =
  'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

const getCryptoData = async (req, res) => {
  try {
    const { idList, currency } = req.params;
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

    console.log('results', results);
    res.status(200).json({ results });
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Something went wrong');
  }
};

const getHoldingsData = async (req, res) => {
  try {
    console.log('holdings:', holdingsItems);
    const holdingsData = processHoldingsData(holdingsItems);
    console.log('holdingsData', holdingsData);
    res.status(200).json({ results: holdingsData });
  } catch (ex) {
    res.status(500).send('Something went wrong');
  }
};

// Add headers
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', clientUrl);

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
  res.send('Hello World');
});

routes.get('/test', (req, res) => {
  res.send('Some data');
});

routes.get('/holdings', getHoldingsData);
routes.get('/coins/:currency/:idList', getCryptoData);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
