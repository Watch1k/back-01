import { postsRepository } from '../repositories/posts-repository';
import { Post } from '../domain/post';
import { blogsRepository } from '../../blogs/repositories/blogs-repository';
import { PostAttributes } from './dtos/post-attributes';
import { PostQueryInput } from '../routes/input/post-query.input';

export const postsService = {
  getAllPosts: postsRepository.getAllPosts,

  findPost: postsRepository.findPost,

  findByIdOrFail: postsRepository.findByIdOrFail,

  findPostByBlogId: async (query: PostQueryInput, blogId: string) => {
    await blogsRepository.findByIdOrFail(blogId);

    return await postsRepository.findPostsByBlogId(query, blogId);
  },

  createPost: async (post: PostAttributes): Promise<string> => {
    const blog = await blogsRepository.findByIdOrFail(post.blogId);

    const newPost: Post = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    return await postsRepository.createPost(newPost);
  },

  updatePost: async (id: string, post: PostAttributes) => {
    const blog = await blogsRepository.findByIdOrFail(post.blogId);

    const updatedPost = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
    };

    await postsRepository.updatePost({ id, input: updatedPost });
    return;
  },

  deletePost: postsRepository.deletePost,
};
