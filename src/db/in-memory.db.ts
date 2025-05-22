import { Driver, VehicleFeature } from '../drivers/types/driver';
import { Video } from '../videos/types/video';

interface Database {
  drivers: Driver[];
  videos: Video[];
}

export const db: Database = {
  drivers: [
    {
      id: 1,
      name: 'Tom Rider',
      phoneNumber: '123-456-7890',
      email: 'tom.rider@example.com',
      vehicleMake: 'BMW',
      vehicleModel: 'Cabrio',
      vehicleYear: 2020,
      vehicleLicensePlate: 'ABC-32145',
      vehicleDescription: null,
      vehicleFeatures: [],
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Tom Rider',
      phoneNumber: '123-456-7890',
      email: 'tom.rider@example.com',
      vehicleMake: 'Ford',
      vehicleModel: 'Mustang Shelby GT',
      vehicleYear: 2019,
      vehicleLicensePlate: 'XYZ-21342',
      vehicleDescription: null,
      vehicleFeatures: [VehicleFeature.WiFi, VehicleFeature.ChildSeat],
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Tom Rider',
      phoneNumber: '123-456-7890',
      email: 'tom.rider@example.com',
      vehicleMake: 'BMW',
      vehicleModel: '18',
      vehicleYear: 2021,
      vehicleLicensePlate: 'LMN-31234',
      vehicleDescription: null,
      vehicleFeatures: [],
      createdAt: new Date(),
    },
  ],
  videos: [
    {
      id: 1,
      title: 'Getting Started with TypeScript',
      author: 'John Smith',
      canBeDownloaded: true,
      minAgeRestriction: 16,
      createdAt: '2024-03-15T10:00:00.000Z',
      publicationDate: '2024-03-16T10:00:00.000Z',
      availableResolutions: ['P144'],
    },
    {
      id: 2,
      title: 'Advanced JavaScript Patterns',
      author: 'Emma Wilson',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: '2024-03-14T15:30:00.000Z',
      publicationDate: '2024-03-15T12:00:00.000Z',
      availableResolutions: ['P240', 'P240'],
    },
    {
      id: 3,
      title: 'Web Development Best Practices',
      author: 'Michael Chen',
      canBeDownloaded: true,
      minAgeRestriction: 13,
      createdAt: '2024-03-13T09:45:00.000Z',
      publicationDate: '2024-03-14T09:45:00.000Z',
      availableResolutions: ['P144', 'P144'],
    },
  ],
};
