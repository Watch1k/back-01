import { ResourceType } from '../../core/types/resource-type';
import { VehicleFeature } from '../types/driver';

export type DriverOutput = {
  type: ResourceType.Drivers;
  id: string;
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
