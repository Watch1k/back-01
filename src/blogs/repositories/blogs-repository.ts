import { db } from '../../db/in-memory.db';
import { BlogCreateInput } from '../dto/blog-create.input';
import { Blog } from '../types/blog';
import { BlogUpdateInput } from '../dto/blog-update.input';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const blogsRepository = {
  getAllBlogs: () => db.blogs,

  findBlog: (id: string) => db.blogs.find((b) => b.id === id),

  createBlog: (blog: BlogCreateInput) => {
    const newBlog: Blog = {
      id: new Date().getTime().toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    };

    db.blogs.push(newBlog);

    return newBlog;
  },

  updateBlog: (data: {
    id: string;
    input: BlogUpdateInput;
  }): OperationResult<Blog> => {
    const index = db.blogs.findIndex((b) => b.id === data.id);

    if (index === -1) {
      return {
        success: false,
        message: `Blog with id ${data.id} not found`,
      };
    }

    const blog = db.blogs[index];

    const updatedBlog = {
      id: blog.id,
      name: data.input.name,
      description: data.input.description,
      websiteUrl: data.input.websiteUrl,
    };

    db.blogs[index] = updatedBlog;

    return {
      success: true,
      message: `Blog with id ${data.id} successfully updated`,
      data: updatedBlog,
    };
  },

  deleteBlog: (id: string): OperationResult => {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return {
        success: false,
        message: `Blog with id ${id} not found`,
      };
    }

    db.blogs.splice(index, 1);
    return {
      success: true,
      message: `Blog with id ${id} successfully deleted`,
    };
  },
};
