import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  name: string;
  pages: number;
  price: number;
  author: mongoose.Types.ObjectId; // Reference to User by ID
  originalFilename: string;
  fileId: mongoose.Types.ObjectId;
}

const BookSchema: Schema = new Schema({
  name: { type: String, required: true },
  pages: { type: Number, required: true },
  price: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  originalFilename: { type: String },
  fileId: { type: Schema.Types.ObjectId },
});

const Book = mongoose.model<IBook>('Book', BookSchema);

export default Book;
