import mongoose from 'mongoose';
import CoinSchema from './CoinSchema';

export default mongoose.model('Coin', CoinSchema);
