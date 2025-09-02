import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { BlogOutput } from '../output/blog.output';

export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
  return {
    id: blog._id.toString(),
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    name: blog.name,
    description: blog.description,
    createdAt: blog.createdAt,
  };
}
