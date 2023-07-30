import { Schema, Model, Types, SchemaDefinitionProperty } from 'mongoose';

interface Entry {
  slug: string;
  name: string;
  amount: number;
}

interface List {
  coinId: number;
  symbol: string;
  exchanges: [Entry],
  wallets: [Entry],
  staking: [Entry],
  creatorId: SchemaDefinitionProperty<Types.ObjectId>
}

const EntrySchema = new Schema<Entry, Model<Entry>>({
  slug: String,
  name: String,
  amount: Number,
});

const ListSchema = new Schema<List, Model<Entry>>({
  coinId: Number,
  symbol: String,
  exchanges: [EntrySchema],
  wallets: [EntrySchema],
  staking: [EntrySchema],
  creatorId: { type: Types.ObjectId, ref: 'User' },
}, {
  collection: 'list',
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
});

export default ListSchema;
