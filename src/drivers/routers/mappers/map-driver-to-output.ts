import { Driver } from '../../types/driver';
import { DriverOutput } from '../../dto/driver.output';
import { ResourceType } from '../../../core/types/resource-type';

export const mapToDriverOutput = (driver: Driver): DriverOutput => {
  return {
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
  };
};
