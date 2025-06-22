import { BlogCreateInput } from '../dto/blog-create.input';
import { Blog } from '../types/blog';
import { BlogUpdateInput } from '../dto/blog-update.input';
import { blogsCollection, postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const blogsRepository = {
  getAllBlogs: () => blogsCollection.find().toArray(),

  findBlog: async (id: string) =>
    await blogsCollection.findOne({
      _id: new ObjectId(id),
    }),

  createBlog: async (
    blog: BlogCreateInput,
  ): Promise<OperationResult<WithId<Blog>>> => {
    const newBlog: Blog = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
    };

    const resp = await blogsCollection.insertOne(newBlog);

    return {
      success: true,
      message: `Blog with id ${resp.insertedId} successfully created`,
      data: { ...newBlog, _id: resp.insertedId },
    };
  },

  updateBlog: async (data: {
    id: string;
    input: BlogUpdateInput;
  }): Promise<OperationResult<WithId<Blog>>> => {
    const updatedBlog = {
      name: data.input.name,
      description: data.input.description,
      websiteUrl: data.input.websiteUrl,
    };

    const updateResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(data.id),
      },
      {
        $set: updatedBlog,
      },
    );

    if (updateResult.matchedCount < 1) {
      return {
        success: false,
        message: `Blog with id ${data.id} not found`,
      };
    }

    const newBlog = await blogsCollection.findOne({
      _id: new ObjectId(data.id),
    });

    if (!newBlog) {
      return {
        success: false,
        message: `Blog with id ${data.id} not found`,
      };
    }

    return {
      success: true,
      message: `Blog with id ${data.id} successfully updated`,
      data: newBlog,
    };
  },

  deleteBlog: async (id: string): Promise<OperationResult> => {
    // First, check if the blog exists
    const blog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!blog) {
      return {
        success: false,
        message: `Blog with id ${id} not found`,
      };
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
      return {
        success: false,
        message: `Blog with id ${id} not found`,
      };
    }

    return {
      success: true,
      message: `Blog with id ${id} and all related posts successfully deleted`,
    };
  },
};
