import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: String,
  date: {
    type: Date,
    required: true,
    default: new Date()
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  paymentMethod: String,
  reference: String,
  creator: String,
  attachments: [String],
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const ExpenseModel = mongoose.model('ExpenseModel', ExpenseSchema);

export default ExpenseModel;