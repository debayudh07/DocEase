import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType'
  },
  senderType: {
    type: String,
    required: true,
    enum: ['User', 'Doctor']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType'
  },
  receiverType: {
    type: String,
    required: true,
    enum: ['User', 'Doctor']
  },
  text: String,
  image: String,
}, { timestamps: true });

messageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.sender = ret.sender.toString();
    ret.receiver = ret.receiver.toString();
    delete ret._id;
    return ret;
  }
});
const Message = mongoose.model("Message", messageSchema);

export default Message;