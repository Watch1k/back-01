import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs-repository';

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await blogsRepository.deleteBlog(req.params.id);

  if (!result.success) {
    res.status(HttpStatus.NotFound).send({
      message: result.message,
    });
    return;
  }

  res.status(HttpStatus.NoContent).send();
};
