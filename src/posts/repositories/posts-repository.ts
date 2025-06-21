import { PostCreateInput } from '../dto/post-create.input';
import { Post } from '../types/post';
import { PostUpdateInput } from '../dto/post-update.input';
import { blogsRepository } from '../../blogs/repositories/blogs-repository';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const postsRepository = {
  getAllPosts: () => postsCollection.find().toArray(),

  findPost: async (id: string) =>
    await postsCollection.findOne({
      _id: new ObjectId(id),
    }),

  createPost: async (
    post: PostCreateInput,
  ): Promise<OperationResult<WithId<Post>>> => {
    const blog = await blogsRepository.findBlog(post.blogId);

    if (!blog) {
      throw new Error(`Blog with id ${post.blogId} not found`);
    }

    const newPost: Post = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
    };

    const resp = await postsCollection.insertOne(newPost);

    return {
      success: true,
      message: `Post with id ${resp.insertedId} successfully created`,
      data: { ...newPost, _id: resp.insertedId },
    };
  },

  updatePost: async (data: {
    id: string;
    input: PostUpdateInput;
  }): Promise<OperationResult<WithId<Post>>> => {
    const blog = await blogsRepository.findBlog(data.input.blogId);

    if (!blog) {
      return {
        success: false,
        message: `Blog with id ${data.input.blogId} not found`,
      };
    }

    const updatedPost = {
      title: data.input.title,
      shortDescription: data.input.shortDescription,
      content: data.input.content,
      blogId: data.input.blogId,
      blogName: blog.name,
    };

    const updateResult = await postsCollection.updateOne(
      {
        _id: new ObjectId(data.id),
      },
      {
        $set: updatedPost,
      },
    );

    if (updateResult.matchedCount < 1) {
      return {
        success: false,
        message: `Post with id ${data.id} not found`,
      };
    }

    const newPost = await postsCollection.findOne({
      _id: new ObjectId(data.id),
    });

    if (!newPost) {
      return {
        success: false,
        message: `Post with id ${data.id} not found`,
      };
    }

    return {
      success: true,
      message: `Post with id ${data.id} successfully updated`,
      data: newPost,
    };
  },

  deletePost: async (id: string): Promise<OperationResult> => {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      return {
        success: false,
        message: `Post with id ${id} not found`,
      };
    }

    return {
      success: true,
      message: `Post with id ${id} successfully deleted`,
    };
  },
};
