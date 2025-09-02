import { blogsRepository } from '../repositories/blogs-repository';
import { Blog } from '../domain/blog';
import { BlogAttributes } from './dtos/blog-attributes';

export const blogsService = {
  getAllBlogs: blogsRepository.getAllBlogs,

  findBlog: blogsRepository.findBlog,

  findByIdOrFail: blogsRepository.findByIdOrFail,

  createBlog: async (blog: BlogAttributes) => {
    const newBlog: Blog = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };

    return await blogsRepository.createBlog(newBlog);
  },

  updateBlog: async (id: string, blog: BlogAttributes) => {
    await blogsRepository.findByIdOrFail(id);

    const updatedBlog = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    };

    await blogsRepository.updateBlog(id, updatedBlog);
    return;
  },

  deleteBlog: blogsRepository.deleteBlog,
};
