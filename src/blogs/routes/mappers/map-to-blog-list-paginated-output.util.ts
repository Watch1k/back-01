import { WithId } from 'mongodb';
import { mapToBlogOutput } from './map-to-blog-output.util';
import { Blog } from '../../domain/blog';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): BlogListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: blogs.map(mapToBlogOutput),
  };
}
