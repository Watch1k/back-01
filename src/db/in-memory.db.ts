import { Video } from '../videos/types/video';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';

interface Database {
  videos: Video[];
  blogs: Blog[];
  posts: Post[];
}

export const db: Database = {
  videos: [],
  blogs: [],
  posts: [],
};
