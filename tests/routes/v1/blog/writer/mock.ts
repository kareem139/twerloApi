import Incident from '../../../../../src/database/model/Incident';
import { Types } from 'mongoose';
import { USER_ID_WRITER } from '../../../../auth/authorization/mock';

jest.unmock('../../../../../src/database/repository/IncidentRepo');

export const Incident_ID = new Types.ObjectId();
export const Incident_ID_2 = new Types.ObjectId();
export const Incident_Title = 'abc';

export const mockBlogFindUrlIfExists = jest.fn(
  async (blogUrl: string): Promise<Incident | null> => {
    if (blogUrl === Incident_Title)
      return {
        _id: Incident_ID,
        title: blogUrl,
      } as Incident;
    return null;
  },
);

export const mockIncidentCreate = jest.fn(
  async (icident: Incident): Promise<Incident> => {
    icident._id = Incident_ID;
    return icident;
  },
);

export const mockIncidentUpdate = jest.fn(async (icident: Incident): Promise<Incident> => icident);
export const mockIncidentFindByTitle = jest.fn(
  async (title: string): Promise<Incident | null> => {
    if (title === Incident_Title)
      return {
        _id: Incident_ID,
        title: Incident_Title,
      } as Incident;
    return null;
  },
);
export const mockFindIncidentAllDataById = jest.fn(
  async (id: Types.ObjectId): Promise<Incident | null> => {
    if (Incident_ID.equals(id))
      return {
        _id: Incident_ID,
        author: { _id: USER_ID_WRITER },
        description:'qwe',
        isDraft: true
      } as Incident;
    if (Incident_ID_2.equals(id))
      return {
        _id: Incident_ID,
        author: { _id: new Types.ObjectId() },
        description:'qwe',
        isDraft: true
      } as Incident;
    return null;
  },
);

jest.mock('../../../../../src/database/repository/IncidentRepo', () => ({
  get create() {
    return mockIncidentCreate;
  },
  get update() {
    return mockIncidentUpdate;
  },
  get findIncidentAllDataById() {
    return mockFindIncidentAllDataById;
  },
  get findInfoByTitle() {
    return mockIncidentFindByTitle;
  },
}));
