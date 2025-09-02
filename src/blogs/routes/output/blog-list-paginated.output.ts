import { PaginatedOutput } from '../../../core/types/paginated.output';
import { BlogOutput } from './blog.output';

export type BlogListPaginatedOutput = PaginatedOutput & { items: BlogOutput[] };
