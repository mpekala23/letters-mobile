/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import url from 'url';
import { Facility, PrisonTypes } from 'types';
import { ABBREV_TO_STATE } from '@utils';
import { API_URL, fetchAuthenticated } from './Common';

interface RawFacility {
  name: string;
  federal: number;
  address: string;
  city: string;
  state: string;
  postal: string;
  phone: string;
}

function cleanFacility(facility: RawFacility): Facility {
  return {
    name: facility.name,
    type: facility.federal ? PrisonTypes.Federal : PrisonTypes.State,
    address: facility.address,
    city: facility.city,
    state: ABBREV_TO_STATE[facility.state],
    postal: facility.postal,
    phone: facility.phone,
  };
}

export async function getFacilities(state: string): Promise<Facility[]> {
  const path = url.resolve(API_URL, `facility/query/state/${state}`);
  const body = await fetchAuthenticated(path, {
    method: 'GET',
  });
  const data = body.data as RawFacility[];
  if (body.status !== 'OK' || !data || !data) throw body;
  const facilities = data.map((facility: RawFacility) =>
    cleanFacility(facility)
  );
  return facilities;
}

export async function getFacility(id: number): Promise<Facility> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `facility/${id}`));
  if (body.status !== 'OK' || !body.data) throw body;
  return body.data as Facility;
}
