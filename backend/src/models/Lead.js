import mongoose from 'mongoose';
import Note from './Note.js';

export const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'lost'],
      default: 'new',
      index: true,
    },
    source: {
      type: String,
      default: 'Web Portal',
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
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

LeadSchema.index({ name: 'text', email: 'text', phone: 'text' });
LeadSchema.index({ createdAt: -1 });

// Helper to find and count leads with filtering, search and pagination
LeadSchema.statics.findAndCountAll = async function ({
  search = '',
  status = '',
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'DESC',
}) {
  const query = { isDeleted: false };

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { source: searchRegex },
    ];
  }

  if (status && status.trim() !== '') {
    query.status = status.trim().toLowerCase();
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const validSortColumns = ['name', 'email', 'status', 'createdAt', 'updatedAt'];
  const sortField = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
  const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
  const sortObj = { [sortField]: sortDirection };

  const [total, leadDocs] = await Promise.all([
    this.countDocuments(query),
    this.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
  ]);

  // Attach notes count for each lead
  const leadIds = leadDocs.map((l) => l._id);
  const noteCounts = await Note.aggregate([
    { $match: { leadId: { $in: leadIds } } },
    { $group: { _id: '$leadId', count: { $sum: 1 } } },
  ]);

  const noteCountMap = new Map();
  noteCounts.forEach((nc) => noteCountMap.set(nc._id.toString(), nc.count));

  const leads = leadDocs.map((l) => ({
    ...l,
    id: l._id.toString(),
    notesCount: noteCountMap.get(l._id.toString()) || 0,
  }));

  return {
    leads,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

LeadSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
        qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
        lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
      },
    },
  ]);

  if (stats.length > 0) {
    const s = stats[0];
    return {
      total: s.total || 0,
      new: s.new || 0,
      contacted: s.contacted || 0,
      qualified: s.qualified || 0,
      lost: s.lost || 0,
    };
  }

  return { total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 };
};

export const Lead = mongoose.model('Lead', LeadSchema);
export default Lead;
