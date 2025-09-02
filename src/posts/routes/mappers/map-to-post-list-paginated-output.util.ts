import { WithId } from 'mongodb';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { Post } from '../../domain/post';
import { mapToPostOutput } from './map-to-post-output.util';

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: posts.map(mapToPostOutput),
  };
}
