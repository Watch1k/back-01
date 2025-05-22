import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { DriverInput } from '../../../src/drivers/dto/driver.input';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Driver, VehicleFeature } from '../../../src/drivers/types/driver';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverUpdateInput } from '../../../src/drivers/dto/driver-update.input';
import { DriverOutput } from '../../../src/drivers/dto/driver.output';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInput = {
    type: ResourceType.Drivers,
    attributes: {
      name: 'Valentin',
      phoneNumber: '123-456-7890',
      email: 'valentin@example.com',
      vehicleMake: 'BMW',
      vehicleModel: 'X5',
      vehicleYear: 2021,
      vehicleLicensePlate: 'ABC-123',
      vehicleDescription: null,
      vehicleFeatures: [],
    },
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create driver; POST /api/drivers', async () => {
    const newDriver: DriverInput = {
      ...testDriverData,
      attributes: {
        ...testDriverData.attributes,
        name: 'Fedor',
      },
    };

    await request(app)
      .post('/api/drivers')
      .send({ data: newDriver })
      .expect(HttpStatus.Created);
  });

  it('should return drivers list; GET /api/drivers', async () => {
    const newDriver: DriverInput = {
      ...testDriverData,
      attributes: {
        ...testDriverData.attributes,
        name: 'Another Driver1',
      },
    };
    const newDriver2: DriverInput = {
      ...testDriverData,
      attributes: {
        ...testDriverData.attributes,
        name: 'Another Driver2',
      },
    };
    await request(app)
      .post('/api/drivers')
      .send({ data: newDriver })
      .expect(HttpStatus.Created);

    await request(app)
      .post('/api/drivers')
      .send({ data: newDriver2 })
      .expect(HttpStatus.Created);

    const driverListResponse = await request(app)
      .get('/api/drivers')
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body.data).toBeInstanceOf(Array);
    expect(driverListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /api/drivers/:id', async () => {
    const newDriver: DriverInput = {
      ...testDriverData,
      attributes: {
        ...testDriverData.attributes,
        name: 'Another Driver3',
      },
    };
    const createResponse = await request(app)
      .post('/api/drivers')
      .send({ data: newDriver })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/drivers/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
    });
  });

  it('should update driver; PUT /api/drivers/:id', async () => {
    const newDriver: DriverInput = {
      ...testDriverData,
      attributes: {
        ...testDriverData.attributes,
        name: 'Another Driver3',
      },
    };
    const createResponse = await request(app)
      .post('/api/drivers')
      .send({ data: newDriver })
      .expect(HttpStatus.Created);
    console.log('createResponse:', createResponse.body);

    const driverUpdateData: DriverUpdateInput = {
      data: {
        id: createResponse.body.id,
        type: ResourceType.Drivers,
        attributes: {
          name: 'Updated Name',
          phoneNumber: '999-888-7777',
          email: 'updated@example.com',
          vehicleMake: 'Tesla',
          vehicleModel: 'Model S',
          vehicleYear: 2022,
          vehicleLicensePlate: 'NEW-789',
          vehicleDescription: 'Updated vehicle description',
          vehicleFeatures: [VehicleFeature.ChildSeat],
        },
      },
    };

    await request(app)
      .put(`/api/drivers/${createResponse.body.id}`)
      .send(driverUpdateData)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(
      `/api/drivers/${createResponse.body.id}`,
    );

    expect(driverResponse.body).toEqual({
      ...driverUpdateData.data,
    });
  });

  it('DELETE /api/drivers/:id and check after NOT FOUND', async () => {
    const newDriver: DriverInput = {
      ...testDriverData,
      attributes: {
        ...testDriverData.attributes,
        name: 'Another Driver4',
      },
    };
    const createResponse = await request(app)
      .post('/api/drivers')
      .send({ data: newDriver })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/api/drivers/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(
      `/api/drivers/${createResponse.body.id}`,
    );
    expect(driverResponse.status).toBe(HttpStatus.NotFound);
  });
});
