import { Blog } from '../blogs/domain/blog';
import { Post } from '../posts/domain/post';

interface Database {
  blogs: Blog[];
  posts: Post[];
}

export const db: Database = {
  blogs: [],
  posts: [],
};
