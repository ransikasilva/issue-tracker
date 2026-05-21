import mongoose, { Schema } from 'mongoose';
import { IIssue, IssuePriority, IssueStatus, IssueSeverity } from '../types';

const IssueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long']
    },
    priority: {
      type: String,
      enum: Object.values(IssuePriority),
      default: IssuePriority.MEDIUM,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(IssueStatus),
      default: IssueStatus.OPEN,
      required: true
    },
    severity: {
      type: String,
      enum: Object.values(IssueSeverity),
      default: IssueSeverity.MODERATE,
      required: true
    },
    createdBy: {
      type: String,
      required: true,
      ref: 'User'
    },
    assignedTo: {
      type: String,
      ref: 'User'
    },
    tags: {
      type: [String],
      default: []
    },
    resolvedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc: any, ret: any) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better query performance
IssueSchema.index({ title: 'text', description: 'text' });
IssueSchema.index({ status: 1, priority: 1 });
IssueSchema.index({ createdBy: 1 });
IssueSchema.index({ createdAt: -1 });

// Middleware to set resolvedAt when status changes to resolved or closed
IssueSchema.pre('save', function (next) {
  if (
    this.isModified('status') &&
    (this.status === IssueStatus.RESOLVED || this.status === IssueStatus.CLOSED) &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }
  next();
});

export const Issue = mongoose.model<IIssue>('Issue', IssueSchema);
