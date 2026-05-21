import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

/**
 * Base Repository Class
 */
export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  /**
   * Find a document by ID
   */
  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    return await this.model.findById(id, null, options).exec();
  }

  /**
   * Find one document by filter
   */
  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    return await this.model.findOne(filter, null, options).exec();
  }

  /**
   * Find all documents matching filter
   */
  async find(filter: FilterQuery<T> = {}, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, null, options).exec();
  }

  /**
   * Update a document by ID
   */
  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();
  }

  /**
   * Update one document by filter
   */
  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model
      .findOneAndUpdate(filter, update, { new: true, runValidators: true })
      .exec();
  }

  /**
   * Delete a document by ID
   */
  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  /**
   * Delete one document by filter
   */
  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOneAndDelete(filter).exec();
  }

  /**
   * Count documents matching filter
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter).limit(1).exec();
    return count > 0;
  }
}
