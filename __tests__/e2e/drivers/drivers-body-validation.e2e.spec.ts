import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { DriverInput } from '../../../src/drivers/dto/driver.input';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ResourceType } from '../../../src/core/types/resource-type';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInput = {
    type: ResourceType.Drivers,
    attributes: {
      name: 'Valentin',
      phoneNumber: '123-456-7890',
      email: 'valentin@example.com',
      vehicleMake: 'BMW',
      vehicleModel: 'X5',
      vehicleYear: 2021,
      vehicleLicensePlate: 'ABC-123',
      vehicleDescription: 'Some description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    },
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it(`should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    const invalidDataSet1 = await request(app)
      .post('/api/drivers')
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/api/drivers')
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            phoneNumber: '', // empty string
            vehicleModel: '', // empty string
            vehicleYear: 'year', // incorrect number
            vehicleLicensePlate: '', // empty string
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/api/drivers')
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            name: 'F', // to short
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const driverListResponse = await request(app).get('/api/drivers');
    expect(driverListResponse.body.data).toHaveLength(0);
  });

  it('should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await request(app)
      .post('/api/drivers')
      .send({ data: correctTestDriverData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`/api/drivers/${createdDriver.body.id}`)
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`/api/drivers/${createdDriver.body.id}`)
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            phoneNumber: '', // empty string
            vehicleModel: '', // empty string
            vehicleYear: 'year', // incorrect number
            vehicleLicensePlate: '', // empty string
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`/api/drivers/${createdDriver.body.id}`)
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            name: 'A', //too short
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await request(app).get(
      `/api/drivers/${createdDriver.body.id}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriver.body.id,
    });
  });

  it('should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .send({ data: correctTestDriverData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .send({
        data: {
          ...correctTestDriverData,
          attributes: {
            ...correctTestDriverData.attributes,
            vehicleFeatures: [
              VehicleFeature.ChildSeat,
              'invalid-feature',
              VehicleFeature.WiFi,
            ],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
    });
  });
});
