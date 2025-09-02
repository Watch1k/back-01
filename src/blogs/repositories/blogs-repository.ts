import { blogsCollection, postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { Blog } from '../domain/blog';
import { BlogAttributes } from '../application/dtos/blog-attributes';
import { BlogQueryInput } from '../routes/input/blog-query.input';

export const blogsRepository = {
  getAllBlogs: async (query: BlogQueryInput) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;

    const items = await blogsCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsCollection.countDocuments();

    return { items, totalCount };
  },

  findBlog: async (id: string) =>
    await blogsCollection.findOne({
      _id: new ObjectId(id),
    }),

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Driver not exist');
    }
    return res;
  },

  createBlog: async (blog: BlogAttributes): Promise<string> => {
    const newBlog: Blog = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };

    const resp = await blogsCollection.insertOne(newBlog);

    return resp.insertedId.toString();
  },

  updateBlog: async (id: string, input: BlogAttributes): Promise<void> => {
    const updateResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: input,
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return;
  },

  deleteBlog: async (id: string): Promise<void> => {
    // First, check if the blog exists
    const blog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!blog) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    // Delete all posts related to this blog
    await postsCollection.deleteMany({
      blogId: id,
    });

    // Delete the blog
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return;
  },
};
