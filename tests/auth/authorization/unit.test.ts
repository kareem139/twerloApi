import { addAuthHeaders } from '../authentication/mock';

// import the mock for the current test after all other mock imports
// this will prevent the different implementations by the other mock
import { mockRoleRepoFindByCode, mockUserFindById, EDITOR_ACCESS_TOKEN } from './mock';

import app from '../../../src/app';
import supertest from 'supertest';
import { RoleCode } from '../../../src/database/model/Role';
import { Types } from 'mongoose';

describe('authentication validation for editor', () => {
  const endpoint = '/v1/editor/incident/done/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCode.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 200 if user  have editor role', async () => {
    
    const response = await addAuthHeaders(request.put(endpoint).query({id:new Types.ObjectId().toHexString()}));
    expect(response.status).toBe(200);
    expect(mockRoleRepoFindByCode).toBeCalledTimes(1);
    expect(mockUserFindById).toBeCalledTimes(1);
    expect(mockRoleRepoFindByCode).toBeCalledWith(RoleCode.EDITOR);
  });
});

describe('authentication validation for writer', () => {
  const endpoint = '/v1/writer/incident/';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCode.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 401 if user have writer role', async () => {
    const response = await addAuthHeaders(request.get(endpoint), EDITOR_ACCESS_TOKEN);
    expect(response.status).toBe(401);
  });
});
