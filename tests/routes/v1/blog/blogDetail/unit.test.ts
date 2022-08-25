import { addHeaders } from '../../../../auth/authentication/mock';

import {mockFindInfoWithTextById, mockIncidentFindByTitle, Incident_ID, Incident_Title } from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';



describe('IncidentDetails by id route', () => {
  beforeEach(() => {
    mockIncidentFindByTitle.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/incident/test';

  it('Should send error when invalid id is passed', async () => {
    const response = await addHeaders(request.get(endpoint));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id is required/);
    expect(mockFindInfoWithTextById).not.toBeCalled();
  });

  it('Should send error when incident do not exists for id', async () => {
    const response = await addHeaders(request.get(endpoint).query({id:new Types.ObjectId()}));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id must be a string/);
  });

});
