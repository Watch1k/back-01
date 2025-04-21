import { Driver } from '../../types/driver';
import { ResourceType } from '../../../core/types/resource-type';
import { DriverListOutput } from '../../dto/driver-list.output';

export const mapToDriverListOutput = (drivers: Driver[]): DriverListOutput => {
  return {
    meta: {},
    data: drivers.map((driver: Driver) => ({
      type: ResourceType.Drivers,
      id: driver.id.toString(),
      attributes: {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        email: driver.email,

        vehicleMake: driver.vehicleMake,
        vehicleModel: driver.vehicleModel,
        vehicleYear: driver.vehicleYear,
        vehicleLicensePlate: driver.vehicleLicensePlate,
        vehicleDescription: driver.vehicleDescription
          ? driver.vehicleDescription
          : null,
        vehicleFeatures: driver.vehicleFeatures,
      },
    })),
  };
};
