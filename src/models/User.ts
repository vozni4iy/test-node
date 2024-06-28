import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  fullName: string;
  books: mongoose.Types.ObjectId[];
  suspended: boolean;
  matchPassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    suspended: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (originalDocument, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;

        // Fallback if firstName and lastName are missing
        if (!returnedObject.firstName || !returnedObject.lastName) {
          const nameParts = (returnedObject.name || '').split(' ');
          returnedObject.firstName = nameParts[0] || '';
          returnedObject.lastName = nameParts.slice(1).join(' ') || '';
        }

        // Include fullName virtual
        returnedObject.fullName = originalDocument.fullName;
        return returnedObject;
      },
    },
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define the virtual property
UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`.trim();
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
