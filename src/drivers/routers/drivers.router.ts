import { Request, Response, Router } from 'express';
import { DriverInput } from '../dto/driver.input';
import { vehicleInputDtoValidation } from '../validation/vehicleInputDtoValidation';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Driver } from '../types/driver';
import { db } from '../../db/in-memory.db';
import { mapToDriverListOutput } from './mappers/map-list-drivers-to-output';
import { mapToDriverOutput } from './mappers/map-driver-to-output';
import { DriverUpdateInput } from '../dto/driver-update.input';
import { DriverListOutput } from '../dto/driver-list.output';
import { DriverCreateInput } from '../dto/driver-create.input';

export const driversRouter = Router({});

driversRouter
  .get('', (req: Request, res: Response<DriverListOutput>) => {
    const drivers = mapToDriverListOutput(db.drivers);
    res.status(200).send(drivers);
  })

  .get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );
      return;
    }
    res.status(200).send(mapToDriverOutput(driver));
  })

  .post('', (req: Request<{}, {}, DriverCreateInput>, res: Response) => {
    const errors = vehicleInputDtoValidation(req.body.data);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const newDriver: Driver = {
      id: new Date().getTime(),
      name: req.body.data.attributes.name,
      phoneNumber: req.body.data.attributes.phoneNumber,
      email: req.body.data.attributes.email,
      vehicleMake: req.body.data.attributes.vehicleMake,
      vehicleModel: req.body.data.attributes.vehicleModel,
      vehicleYear: req.body.data.attributes.vehicleYear,
      vehicleLicensePlate: req.body.data.attributes.vehicleLicensePlate,
      vehicleDescription: req.body.data.attributes.vehicleDescription,
      vehicleFeatures: req.body.data.attributes.vehicleFeatures,
      createdAt: new Date(),
    };
    db.drivers.push(newDriver);
    const mappedDriver = mapToDriverOutput(newDriver);
    res.status(HttpStatus.Created).send(mappedDriver);
  })

  .put(
    '/:id',
    (req: Request<{ id: string }, {}, DriverUpdateInput>, res: Response) => {
      console.log('in put: ', req.body.data);
      const id = parseInt(req.params.id);
      const index = db.drivers.findIndex((v) => v.id === id);

      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: 'id', message: 'Vehicle not found' },
            ]),
          );
        return;
      }

      const errors = vehicleInputDtoValidation(req.body.data);

      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      const driver = db.drivers[index];

      driver.name = req.body.data.attributes.name;
      driver.phoneNumber = req.body.data.attributes.phoneNumber;
      driver.email = req.body.data.attributes.email;
      driver.vehicleMake = req.body.data.attributes.vehicleMake;
      driver.vehicleModel = req.body.data.attributes.vehicleModel;
      driver.vehicleYear = req.body.data.attributes.vehicleYear;
      driver.vehicleLicensePlate = req.body.data.attributes.vehicleLicensePlate;
      driver.vehicleDescription = req.body.data.attributes.vehicleDescription;
      driver.vehicleFeatures = req.body.data.attributes.vehicleFeatures;

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    //ищет первый элемент, у которого функция внутри возвращает true и возвращает индекс этого элемента в массиве, если id ни у кого не совпал, то findIndex вернёт -1.
    const index = db.drivers.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );
      return;
    }

    db.drivers.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
