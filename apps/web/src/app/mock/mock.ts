import type { DropdownItem } from '@gsp/ui';

export interface SiteResultSchema {
  id: string;
  name: string;
  adress: string;
  totalSiteLocations: number;
  passCriteria?: string;
  notification?: string;
  fooBar?: string;
}

export const siteResultsMock: SiteResultSchema[] = [
  {
    id: '1',
    name: 'Garpenberg',
    adress: 'Kaspersbo 20, 77849, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'D47 MDX, D34 MD',
    notification: '20% per submission',
    fooBar: '38744',
  },
  {
    id: '2',
    name: 'Garpenberg',
    adress: 'Gaspersbo 20, 55849, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'D47 MDX, D34 MD',
    notification: '20% per submission',
    fooBar: '2438744',
  },
  {
    id: '3',
    name: 'Berggarpen',
    adress: 'Aaspersbo 20, 77049, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'N/A',
    notification: '10% per submission',
    fooBar: '456',
  },
  {
    id: '4',
    name: 'Berggarpen',
    adress: 'Baspersbogatan 20, 12345, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'D47 MDX',
    notification: '20% per submission',
    fooBar: '23424',
  },
  {
    id: '5',
    name: 'Garpenberg',
    adress: 'Kaspersbo 20, 77849, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'D34 MD',
    notification: '30% per submission',
    fooBar: '456',
  },
  {
    id: '6',
    name: 'Garpenberg',
    adress: 'Kaspersbo 20, 77849, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'D34 MD',
    notification: '30% per submission',
    fooBar: '23',
  },
  {
    id: '7',
    name: 'Garpenberg',
    adress: 'Kaspersbo 20, 77849, Sverige',
    totalSiteLocations: 44,
    passCriteria: 'D34 MD',
    notification: '30% per submission',
    fooBar: '4645645',
  },
];

export const optionsDesignSystemMock = [
  {
    id: '1',
    name: 'Elliot Alderson',
  },
  {
    id: '2',
    name: 'Darlene Alderson',
  },
  {
    id: '3',
    name: 'Tyrell Wellick',
  },
  {
    id: '4',
    name: 'Joanna Wellick',
  },
];

export const appPlansMock = [
  {
    name: 'Pull-test',
    activePlan: 'Gold',
    id: '1',
  },
  {
    name: 'xCyclops',
    activePlan: undefined,
    id: '2',
  },
  {
    name: 'Ultrabots',
    activePlan: 'Bronze',
    id: '3',
  },
];

export const adminsMock = [
  {
    id: '1',
    name: 'Elliot Alderson',
  },
  {
    id: '2',
    name: 'Darlene Alderson',
  },
  {
    id: '3',
    name: 'Tyrell Wellick',
  },
  {
    id: '4',
    name: 'Joanna Wellick',
  },
  {
    id: '5',
    name: 'Angela Moss',
  },
  {
    id: '6',
    name: 'Whiterose',
  },
  {
    id: '7',
    name: 'Felix Östergren',
  },
  {
    id: '8',
    name: 'Jimmy Nwadinkpa',
  },
];

export const companiesMock = [
  {
    name: 'E-Corp',
    id: '1',
  },
  {
    name: 'Vandelay Industries',
    id: '2',
  },
  {
    name: 'Valve Software',
    id: '3',
  },
  {
    name: 'Subset Games',
    id: '4',
  },
  {
    name: 'Bohemia Interactive',
    id: '5',
  },
  {
    name: 'Felix Industries',
    id: '6',
  },
];

export interface UserSchema {
  id: string;
  fullName: string;
  email: string;
  appAccess: string;
  role: 'User' | 'Technician' | 'Admin';
  phoneNumber: string;
}

export const usersMock: UserSchema[] = [
  {
    id: '1',
    fullName: 'Elliot Alderson',
    email: 'alderson@sandvik.com',
    appAccess: 'Pull-test, Ultrabots, xCyclops',
    role: 'User',
    phoneNumber: '+4683729327',
  },
  {
    id: '2',
    fullName: 'Jimmy Nwadinkpa',
    email: 'jimmy@sandvik.com',
    appAccess: 'Ultrabots, xCyclops',
    role: 'Technician',
    phoneNumber: '+4683729327',
  },
  {
    id: '3',
    fullName: 'Felix Östergren',
    email: 'felix@sandvik.com',
    appAccess: 'Pull-test',
    role: 'User',
    phoneNumber: '+4683729327',
  },
  {
    id: '4',
    fullName: 'Darlene Alderson',
    email: 'darlenealderson@sandvik.com',
    appAccess: 'Pull-test, Ultrabots, xCyclops',
    role: 'Admin',
    phoneNumber: '+4683729327',
  },
];

export interface TechniciansSchema {
  id: string;
  fullName: string;
  email: string;
  company: string;
  isGlobal: boolean;
  phoneNumber: string;
}

export const techniciansMock: TechniciansSchema[] = [
  {
    id: '1',
    fullName: 'Elliot Alderson',
    email: 'elliotalderson@sandvik.com',
    company: 'Sandvik',
    isGlobal: true,
    phoneNumber: '+4683729327',
  },
  {
    id: '2',
    fullName: 'Jimmy Nwadinkpa',
    email: 'jimmy@sandvik.com',
    company: 'Sandvik',
    isGlobal: false,
    phoneNumber: '+4683729327',
  },
  {
    id: '3',
    fullName: 'Felix Östergren',
    email: 'felix@sandvik.com',
    company: 'Sandvik',
    isGlobal: false,
    phoneNumber: '+4683729327',
  },
  {
    id: '4',
    fullName: 'Whiterose',
    email: 'whiterose@sandvik.com',
    company: 'Sandvik',
    isGlobal: true,
    phoneNumber: '+4683729327',
  },
  {
    id: '5',
    fullName: 'Darlene Alderson',
    email: 'darlenealderson@sandvik.com',
    company: 'Sandvik',
    isGlobal: false,
    phoneNumber: '+4683729327',
  },
  {
    id: '6',
    fullName: 'Tyrell Wellick',
    email: 'tyrellwellick@sandvik.com',
    company: 'Sandvik',
    isGlobal: true,
    phoneNumber: '+4683729327',
  },
];

export const roles: DropdownItem[] = [
  {
    id: '1',
    name: 'User',
    background: 'neutral',
  },
  {
    id: '2',
    name: 'Technician',
  },
  {
    id: '3',
    name: 'Admin',
    background: 'primary',
  },
];

export const technicians = [
  {
    id: '1',
    name: 'Elliot Alderson',
    email: 'elliot@ecorp.com',
  },
  {
    id: '2',
    name: 'Darlene Alderson',
    email: 'dolores@haze.com',
  },
  {
    id: '3',
    name: 'Tyrell Wellick',
    email: 'tyrell@ecorp.com',
  },
  {
    id: '4',
    name: 'Joanna Wellick',
    email: 'joanna@ecorp.com',
  },
  {
    id: '5',
    name: 'Angela Moss',
    email: 'angela@ecorp.com',
  },
  {
    id: '6',
    name: 'Whiterose',
    email: 'dark@army.com',
  },
  {
    id: '7',
    name: 'Felix Östergren',
    email: 'felix@ecorp.com',
  },
  {
    id: '8',
    name: 'Jimmy Nwadinkpa',
    email: 'jimmy@ecorp.com',
  },
];
