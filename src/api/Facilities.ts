/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import url from 'url';
import { Facility, PrisonTypes } from 'types';
import { ABBREV_TO_STATE } from '@utils';
import store from '@store';
import { setFacilities, setLoaded } from '@store/Facility/FacilityActions';
import { API_URL, fetchAuthenticated } from './Common';

interface RawFacility {
  name: string;
  full_name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  phone: string;
}

function cleanFacility(facility: RawFacility): Facility {
  let type: PrisonTypes;
  try {
    type = facility.type as PrisonTypes;
  } catch (err) {
    type = PrisonTypes.Fallback;
  }
  return {
    name: facility.name,
    fullName: facility.full_name,
    type,
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
  facilities.sort((a, b) => {
    if (
      (a.fullName && b.fullName && a.fullName < b.fullName) ||
      a.name < b.name
    )
      return -1;
    if (
      (a.fullName && b.fullName && a.fullName === b.fullName) ||
      a.name === b.name
    )
      return 0;
    return 1;
  });
  store.dispatch(setFacilities(facilities));
  store.dispatch(setLoaded(true));
  return facilities;
}

export async function getFacility(id: number): Promise<Facility> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `facility/${id}`));
  if (body.status !== 'OK' || !body.data) throw body;
  return body.data as Facility;
}
