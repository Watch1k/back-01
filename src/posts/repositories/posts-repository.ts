import { db } from '../../db/in-memory.db';
import { PostCreateInput } from '../dto/post-create.input';
import { Post } from '../types/post';
import { PostUpdateInput } from '../dto/post-update.input';
import { blogsRepository } from '../../blogs/repositories/blogs-repository';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const postsRepository = {
  getAllPosts: () => db.posts,

  findPost: (id: string) => db.posts.find((p) => p.id === id),

  createPost: (post: PostCreateInput) => {
    const blog = blogsRepository.findBlog(post.blogId);

    if (!blog) {
      throw new Error(`Blog with id ${post.blogId} not found`);
    }

    const newPost: Post = {
      id: new Date().getTime().toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    db.posts.push(newPost);

    return newPost;
  },

  updatePost: (data: {
    id: string;
    input: PostUpdateInput;
  }): OperationResult<Post> => {
    const index = db.posts.findIndex((p) => p.id === data.id);

    if (index === -1) {
      return {
        success: false,
        message: `Post with id ${data.id} not found`,
      };
    }

    const blog = blogsRepository.findBlog(data.input.blogId);

    if (!blog) {
      return {
        success: false,
        message: `Blog with id ${data.input.blogId} not found`,
      };
    }

    const post = db.posts[index];

    const updatedPost = {
      id: post.id,
      title: data.input.title,
      shortDescription: data.input.shortDescription,
      content: data.input.content,
      blogId: data.input.blogId,
      blogName: blog.name,
      createdAt: post.createdAt,
    };

    db.posts[index] = updatedPost;

    return {
      success: true,
      message: `Post with id ${data.id} successfully updated`,
      data: updatedPost,
    };
  },

  deletePost: (id: string): OperationResult => {
    const index = db.posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return {
        success: false,
        message: `Post with id ${id} not found`,
      };
    }

    db.posts.splice(index, 1);
    return {
      success: true,
      message: `Post with id ${id} successfully deleted`,
    };
  },
};
