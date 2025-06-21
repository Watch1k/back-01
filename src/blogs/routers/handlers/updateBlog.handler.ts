import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { BlogUpdateInput } from '../../dto/blog-update.input';
import { blogsRepository } from '../../repositories/blogs-repository';

export const updateBlogHandler = async (
  req: Request<{ id: string }, {}, BlogUpdateInput>,
  res: Response,
) => {
  const result = await blogsRepository.updateBlog({
    id: req.params.id,
    input: req.body,
  });

  if (!result.success) {
    res.status(HttpStatus.NotFound).send({
      message: result.message,
    });
    return;
  }

  res.status(HttpStatus.NoContent).send();
};
