import { WithId } from 'mongodb';
import { Post } from '../types/post';
import { PostViewModel } from '../types/post-view-model';

export const mapToPostViewModel = (post: WithId<Post>): PostViewModel => ({
  id: post._id.toString(),
  title: post.title,
  blogId: post.blogId,
  shortDescription: post.shortDescription,
  content: post.content,
  blogName: post.blogName,
  createdAt: post.createdAt,
});
