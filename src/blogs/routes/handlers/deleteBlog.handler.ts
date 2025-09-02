import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await blogsService.deleteBlog(req.params.id);

    res.status(HttpStatus.NoContent).send();
  } catch (e) {
    errorsHandler(e, res);
  }
};
