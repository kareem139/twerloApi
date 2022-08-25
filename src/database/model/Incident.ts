import { Schema, model, Document } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Incident';
export const COLLECTION_NAME = 'incidents';

export default interface Incident extends Document {
  title: string;
  description: string;
  author: User;
  isDraft: boolean;
  status?: boolean;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
  asignTo?:User;
}

const schema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isDraft: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
      index: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
    asignTo:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
      index: true,
    }
  },
  {
    versionKey: false,
  },
).index(
  { title: 'text', description: 'text' },
  { weights: { title: 3, description: 1 }, background: false },
);

export const IncidentModel = model<Incident>(DOCUMENT_NAME, schema, COLLECTION_NAME);
