import Incident from '../../../../../src/database/model/Incident';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/IncidentRepo');

export const Incident_ID = new Types.ObjectId();
export const Incident_Title = 'abc';

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

export const mockFindInfoWithTextById = jest.fn(
  async (id: Types.ObjectId): Promise<Incident | null> => {
    if (Incident_ID.equals(id))
      return {
        _id: Incident_ID,
        title: Incident_Title,
      } as Incident;
    return null;
  },
);

jest.mock('../../../../../src/database/repository/IncidentRepo', () => ({
  get findInfoByTitle() {
    return mockIncidentFindByTitle;
  },
  get findInfoById() {
    return mockFindInfoWithTextById;
  },
}));
