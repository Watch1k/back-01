import { DriverInput } from '../dto/driver.input';
import { VehicleFeature } from '../types/driver';
import { ValidationError } from '../types/validationError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const vehicleInputDtoValidation = (
  data: DriverInput,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  console.log('validation data: ', data);
  const {
    name,
    phoneNumber,
    email,
    vehicleMake,
    vehicleFeatures,
    vehicleModel,
    vehicleYear,
    vehicleLicensePlate,
    vehicleDescription,
  } = data.attributes;
  if (
    !name ||
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    name.trim().length > 15
  ) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  if (
    !phoneNumber ||
    typeof phoneNumber !== 'string' ||
    phoneNumber.trim().length < 8 ||
    phoneNumber.trim().length > 15
  ) {
    errors.push({ field: 'phoneNumber', message: 'Invalid phoneNumber' });
  }

  if (
    !email ||
    typeof email !== 'string' ||
    email.trim().length < 5 ||
    email.trim().length > 100 ||
    !EMAIL_REGEX.test(email)
  ) {
    errors.push({ field: 'email', message: 'Invalid email' });
  }

  if (
    !vehicleMake ||
    typeof vehicleMake !== 'string' ||
    vehicleMake.trim().length < 3 ||
    vehicleMake.trim().length > 100
  ) {
    errors.push({ field: 'vehicleMake', message: 'Invalid vehicleMake' });
  }

  if (
    !vehicleModel ||
    typeof vehicleModel !== 'string' ||
    vehicleModel.trim().length < 2 ||
    vehicleModel.trim().length > 100
  ) {
    errors.push({ field: 'vehicleModel', message: 'Invalid vehicleModel' });
  }

  if (!vehicleYear || typeof vehicleYear !== 'number') {
    errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
  }

  if (
    !vehicleLicensePlate ||
    typeof vehicleLicensePlate !== 'string' ||
    vehicleLicensePlate.trim().length < 6 ||
    vehicleLicensePlate.trim().length > 10
  ) {
    errors.push({
      field: 'vehicleLicensePlate',
      message: 'Invalid vehicleLicensePlate',
    });
  }

  if (
    vehicleDescription !== null &&
    (typeof vehicleDescription !== 'string' ||
      vehicleDescription.trim().length < 10 ||
      vehicleDescription.trim().length > 200)
  ) {
    errors.push({
      field: 'vehicleDescription',
      message: 'Invalid vehicleDescription',
    });
  }

  if (!Array.isArray(vehicleFeatures)) {
    errors.push({
      field: 'vehicleFeatures',
      message: 'vehicleFeatures must be array',
    });
  } else if (vehicleFeatures.length) {
    const existingFeatures = Object.values(VehicleFeature);
    if (
      vehicleFeatures.length > existingFeatures.length ||
      vehicleFeatures.length < 1
    ) {
      errors.push({
        field: 'vehicleFeatures',
        message: 'Invalid vehicleFeatures',
      });
    }
    for (const feature of vehicleFeatures) {
      if (!existingFeatures.includes(feature)) {
        errors.push({
          field: 'features',
          message: 'Invalid vehicleFeature:' + feature,
        });
        break;
      }
    }
  }

  return errors;
};
