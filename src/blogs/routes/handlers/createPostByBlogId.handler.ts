import type { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostOutput } from '../../../posts/routes/mappers/map-to-post-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostAttributes } from '../../../posts/application/dtos/post-attributes';
import { blogsService } from '../../application/blogs.service';

export const createPostByBlogIdHandler = async (
  req: Request<{ id: string }, {}, Omit<PostAttributes, 'blogId'>>,
  res: Response,
) => {
  try {
    const { id: blogId } = req.params;
    await blogsService.findByIdOrFail(blogId);

    const postId = await postsService.createPost({ ...req.body, blogId });
    const post = await postsService.findByIdOrFail(postId);
    const postOutput = mapToPostOutput(post);

    res.status(HttpStatus.Created).send(postOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
