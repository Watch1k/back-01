import { PaginatedOutput } from '../../../core/types/paginated.output';
import { PostOutput } from './post.output';

export type PostListPaginatedOutput = PaginatedOutput & { items: PostOutput[] };
