import { AxiosStatic } from 'axios';
import { HttpDopplerUserApiClient } from './doppler-user-api-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

const consoleError = console.error;
const jwtToken = 'jwtToken';
const accountEmail = 'email@mail.com';

function createHttpDopplerUserApiClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken,
      userData: { user: { email: accountEmail } } as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;

  const apiClient = new HttpDopplerUserApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerUserApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get contact information', async () => {
    // Arrange
    const contactInformation = {
      data: {
        email: 'test@makingsense.com',
        firstname: 'Test',
        lastname: 'Test',
        address: 'Alem 1234',
        city: 'Tandil',
        province: 'Buenos Aires',
        country: 'AR',
        zipCode: '7000',
        phoneNumber: '+5424966666',
        company: 'Making Sense',
        industry: 'IT',
        completed: true,
      },
      status: 200,
    };
    const request = jest.fn(async () => contactInformation);
    const dopplerUserApiClient = createHttpDopplerUserApiClient({ request });

    // Act
    const result = await dopplerUserApiClient.getContactInformationData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should update contact information', async () => {
    // Arrange
    const values = {
      email: 'test@makingsense.com',
      firstname: 'Test',
      lastname: 'Test',
      address: 'Alem 1234',
      city: 'Tandil',
      province: 'Buenos Aires',
      country: 'AR',
      zipCode: '7000',
      phoneNumber: '+5424966666',
      company: 'Making Sense',
      industry: 'dplr1',
    };

    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerUserApiClient = createHttpDopplerUserApiClient({ request });

    // Act
    const result = await dopplerUserApiClient.updateContactInformation(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail', async () => {
    // Arrange
    const values = {
      email: 'test@makingsense.com',
      firstname: 'Test',
      lastname: 'Test',
      address: 'Alem 1234',
      city: 'Tandil',
      province: 'Buenos Aires',
      country: 'AR',
      zipCode: '7000',
      phoneNumber: '+5424966666',
      company: 'Making Sense',
      industry: 'dplr1',
    };

    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerUserApiClient = createHttpDopplerUserApiClient({ request });

    // Act
    const result = await dopplerUserApiClient.updateContactInformation(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should get features', async () => {
    // Arrange
    const features = {
      data: { contactPolicies: true },
      status: 200,
    };
    const request = jest.fn(async () => features);
    const dopplerUserApiClient = createHttpDopplerUserApiClient({ request });

    // Act
    const result = await dopplerUserApiClient.getFeatures();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });
});
