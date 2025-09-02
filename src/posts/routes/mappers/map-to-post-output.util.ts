import { WithId } from 'mongodb';
import { PostOutput } from '../output/post.output';
import { Post } from '../../domain/post';

export function mapToPostOutput(post: WithId<Post>): PostOutput {
  return {
    id: post._id.toString(),
    content: post.content,
    blogId: post.blogId,
    shortDescription: post.shortDescription,
    blogName: post.blogName,
    title: post.title,
    createdAt: post.createdAt,
  };
}
