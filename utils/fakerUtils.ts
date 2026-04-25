/**
 * Purpose: Generates dynamic, realistic data for tests.
 * Why used: Dynamic data avoids duplicate-value failures and keeps tests closer to real user behavior.
 */
import { faker } from '@faker-js/faker';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface RandomUser extends CheckoutCustomer {
  email: string;
  password: string;
}

export function createCheckoutCustomer(): CheckoutCustomer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode()
  };
}

export function createRandomUser(): RandomUser {
  return {
    ...createCheckoutCustomer(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 12 })
  };
}
