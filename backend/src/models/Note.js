import mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'Admin User',
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.leadId = ret.leadId ? ret.leadId.toString() : ret.leadId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

NoteSchema.index({ leadId: 1, createdAt: -1 });

NoteSchema.statics.findByLeadId = function (leadId) {
  return this.find({ leadId, isDeleted: false }).sort({ createdAt: -1 });
};

export const Note = mongoose.model('Note', NoteSchema);
export default Note;
