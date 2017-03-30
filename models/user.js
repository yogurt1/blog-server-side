import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-as-promised';

const UserSchema = new Schema ({
  login: { type: String, unique: true, lowrcase: true, index: true },
  password: String
});

UserSchema.pre('save', async function (next) {
  if (!this.Modified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
})

UserSchema.methods.comparePasswords = function (password) {
  return bcrypt.compare(password, this.password);
}

export default mongoose.model('User', UserSchema);
