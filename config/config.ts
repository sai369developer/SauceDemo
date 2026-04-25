/**
 * Purpose: Loads the selected environment file and exposes safe, typed config values to the framework.
 * Why used: Tests should switch environments without hardcoding URLs or credentials in spec files.
 */
import path from 'path';
import dotenv from 'dotenv';

const supportedEnvironments = ['dev', 'qa', 'prod'] as const;

export type EnvironmentName = (typeof supportedEnvironments)[number];

function resolveEnvironment(): EnvironmentName {
  const explicitEnvironment = process.env.TEST_ENV?.toLowerCase();
  const scriptEnvironment = process.env.npm_lifecycle_event?.match(/(?:^|:)(dev|qa|prod)$/)?.[1];
  const selectedEnvironment = explicitEnvironment ?? scriptEnvironment ?? 'qa';

  if (!supportedEnvironments.includes(selectedEnvironment as EnvironmentName)) {
    throw new Error(
      `Unsupported TEST_ENV "${selectedEnvironment}". Use one of: ${supportedEnvironments.join(', ')}.`
    );
  }

  return selectedEnvironment as EnvironmentName;
}

export const environment = resolveEnvironment();

const envFilePath = path.resolve(__dirname, 'environments', `${environment}.env`);
dotenv.config({ path: envFilePath });

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable "${name}" in ${envFilePath}.`);
  }

  return value;
}

export const config = {
  environment,
  baseUrl: requiredEnv('BASE_URL'),
  username: requiredEnv('SAUCE_USERNAME'),
  password: requiredEnv('SAUCE_PASSWORD')
};
