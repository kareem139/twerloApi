import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { ADMIN_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
  Incident_ID,
  Incident_Title,
  Incident_ID_2,
  mockIncidentCreate,
  mockFindIncidentAllDataById,
  mockIncidentUpdate,
  mockIncidentFindByTitle
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('Writer incident create routes', () => {
  beforeEach(() => {
    mockIncidentCreate.mockClear();

  });

  const request = supertest(app);
  const endpoint = '/v1/writer/incident';

  it('Should send error if the user do have writer role', async () => {
    const response = await addAuthHeaders(request.post(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/permission denied/i);
    expect(mockIncidentCreate).not.toBeCalled();
  });

  it('Should send error if incident title not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        description: 'description',
        text: 'text'
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/title/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockIncidentCreate).not.toBeCalled();
  });

  it('Should send error if incident description not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/description/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockIncidentCreate).not.toBeCalled();
  });

  it('Should send error if incident asignTo not sent', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        title: 'title',
        description: 'description'
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/asignTo/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockIncidentCreate).not.toBeCalled();
  });

});

describe('Writer incident delete routes', () => {
  beforeEach(() => {
    mockFindIncidentAllDataById.mockClear();
    mockIncidentUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/editor/incident';

  it('Should send error if deleting incident id is not valid', async () => {
    const response = await addAuthHeaders(request.delete(endpoint).query({id:new Types.ObjectId().toHexString()}), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/incident does not exist/i);

  });

  it('Should send error if deleting incident do not exist for id', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint).query({id:new Types.ObjectId().toString()}),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exists/i);
    expect(mockFindIncidentAllDataById).toBeCalledTimes(1);
    expect(mockIncidentUpdate).not.toBeCalled();
  });

  it('Should send success if deleting incident for id exists', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint).query({id:Incident_ID.toString()}),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted success/i);
    expect(mockFindIncidentAllDataById).toBeCalledTimes(1);
    expect(mockIncidentUpdate).toBeCalledTimes(1);
  });
});


