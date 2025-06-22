import { WithId } from 'mongodb';
import { Blog } from '../../types/blog';
import { BlogViewModel } from '../../types/blog-view-model';

export const mapToBlogModel = (blog: WithId<Blog>): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
});
