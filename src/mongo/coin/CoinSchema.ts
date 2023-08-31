import { Schema, Model, Types, SchemaDefinitionProperty } from 'mongoose';

enum HoldingStorageTypes {
  WALLET = 'wallet',
  EXCHANGE = 'exchange',
  STAKING = 'staking',
}

type HoldingStorageType = `${HoldingStorageTypes}`;
export interface Holding {
  id: SchemaDefinitionProperty<Types.ObjectId>;
  slug?: string;
  name: string;
  type: HoldingStorageType;
  amount: number;
  value?: number;
  holdingId?: string;
  currency?: string;
  ownerId?: string;
}

export interface Coin {
  id: SchemaDefinitionProperty<Types.ObjectId>;
  symbol: string;
  holdings: Holding[];
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
