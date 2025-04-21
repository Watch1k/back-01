import { VehicleFeature } from '../types/driver';
import { ResourceType } from '../../core/types/resource-type';

export type DriverInput = {
  type: ResourceType.Drivers;
  attributes: {
    name: string;
    phoneNumber: string;
    email: string;

    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleLicensePlate: string;
    vehicleDescription: string | null;
    vehicleFeatures: VehicleFeature[];
  };
};
