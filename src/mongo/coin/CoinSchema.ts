import { Schema, Model, Types, SchemaDefinitionProperty } from 'mongoose';

interface Holding {
  slug: string;
  name: string;
  type: 'wallet' | 'staking' | 'exchange';
  amount: number;
  holdingId: string;
  currency: string;
  ownerId: string;
}

interface Coin {
  symbol: string;
  holdings: [Holding];
  name: string;
  creatorId: SchemaDefinitionProperty<Types.ObjectId>;
  coinId: string;
}

const HoldingSchema = new Schema<Holding, Model<Holding>>({
  slug: String,
  name: String,
  amount: Number,
  type: String,
  holdingId: String,
  currency: String,
  ownerId: String,
});

const CoinSchema = new Schema<Coin, Model<Coin>>(
  {
    symbol: { type: String, required: true },
    holdings: [HoldingSchema],
    creatorId: { type: Types.ObjectId, ref: 'User' },
  },
  {
    collection: 'coin',
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

CoinSchema.index({ symbol: 1, creatorId: 1 }, { unique: true });

export default CoinSchema;
