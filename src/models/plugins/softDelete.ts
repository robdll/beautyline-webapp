import { Schema } from 'mongoose';

export function softDeletePlugin(schema: Schema) {
  schema.add({
    deletedAt: { type: Date, default: null },
  });

  schema.pre(/^find/, function (this: any) {
    const filter = this.getFilter();
    if (filter.deletedAt === undefined) {
      this.where({ deletedAt: null });
    }
  });

  schema.pre('countDocuments', function (this: any) {
    const filter = this.getFilter();
    if (filter.deletedAt === undefined) {
      this.where({ deletedAt: null });
    }
  });

  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.deletedAt = null;
    return this.save();
  };
}
