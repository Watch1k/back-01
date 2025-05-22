import { Request, Response, Router } from 'express';
import { videoInputDtoValidation } from '../validation/videoInputDtoValidation';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { db } from '../../db/in-memory.db';
import { VideoUpdateInput } from '../dto/video-update.input';
import { VideoListOutput } from '../dto/video-list.output';
import { VideoCreateInput } from '../dto/video-create.input';
import { Video } from '../types/video';

export const videosRouter = Router({});

videosRouter
  .get('', (req: Request, res: Response<VideoListOutput>) => {
    res.status(200).send(db.videos);
  })

  .get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const video = db.videos.find((v) => v.id === id);

    if (!video) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
      return;
    }
    res.status(200).send(video);
  })

  .post('', (req: Request<{}, {}, VideoCreateInput>, res: Response) => {
    const errors = videoInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const newVideo: Video = {
      ...req.body,
      id: new Date().getTime(),
      minAgeRestriction: null,
      publicationDate: new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000,
      ).toISOString(),
      canBeDownloaded: false,
      createdAt: new Date().toISOString(),
    };
    db.videos.push(newVideo);
    res.status(HttpStatus.Created).send(newVideo);
  })

  .put(
    '/:id',
    (req: Request<{ id: string }, {}, VideoUpdateInput>, res: Response) => {
      const id = parseInt(req.params.id);
      const index = db.videos.findIndex((v) => v.id === id);

      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Video not found' }]),
          );
        return;
      }

      const errors = videoInputDtoValidation(req.body);

      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      const video = db.videos[index];

      db.videos[index] = {
        ...req.body,
        id: video.id,
        createdAt: video.createdAt,
      };

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
      return;
    }

    db.videos.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
