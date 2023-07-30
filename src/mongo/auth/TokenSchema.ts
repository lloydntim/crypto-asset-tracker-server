import { Schema, Model, Types, SchemaDefinitionProperty } from 'mongoose';

interface Token {
  userId: SchemaDefinitionProperty<Types.ObjectId>;
  token: string;
  createdAt: {
    type: number;
    required: boolean;
    expires: number;
    default: string;
  };
}

const TokenSchema = new Schema<Token, Model<Token>>({
  userId: { type: Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    expires: 43200,
    default: Date.now,
  },
}, {
  collection: 'token',
  timestamps: true,
});

export default TokenSchema;
