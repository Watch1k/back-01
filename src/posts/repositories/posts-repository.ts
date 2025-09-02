import { Post } from '../domain/post';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { PostAttributes } from '../application/dtos/post-attributes';
import { OperationResult } from '../../core/types/operation-result';
import { PostQueryInput } from '../routes/input/post-query.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';

export const postsRepository = {
  getAllPosts: async (query: PostQueryInput) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postsCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments();

    return { items, totalCount };
  },

  findPost: async (id: string) =>
    await postsCollection.findOne({
      _id: new ObjectId(id),
    }),

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const res = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Driver not exist');
    }
    return res;
  },

  async findPostsByBlogId(
    query: PostQueryInput,
    blogId: string,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const filter = { blogId };
    const skip = (pageNumber - 1) * pageSize;

    await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  createPost: async (post: Post): Promise<string> => {
    const resp = await postsCollection.insertOne(post);

    return resp.insertedId.toString();
  },

  updatePost: async (data: {
    id: string;
    input: PostAttributes;
  }): Promise<void> => {
    const updateResult = await postsCollection.updateOne(
      {
        _id: new ObjectId(data.id),
      },
      {
        $set: data.input,
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  },

  deletePost: async (id: string): Promise<void> => {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  },
};
