export interface SiteResultSchema {
  id: string;
  name: string;
  adress: string;
  totalSiteLocations: number;
  passCriteria?: string;
  notification?: string;
  fooBar?: string;
}
type PlanType = 'Gold' | 'Silver' | 'Bronze';

interface AppPlan {
  name: string;
  activePlan?: PlanType;
  id: string;
}

export const siteResultMock: SiteResultSchema[] = [
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
    totalSiteLocations: 34,
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
    totalSiteLocations: 24,
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
    totalSiteLocations: 8,
    passCriteria: 'D34 MD',
    notification: '30% per submission',
    fooBar: '23',
  },
  {
    id: '7',
    name: 'Garpenberg',
    adress: 'Kaspersbo 20, 77849, Sverige',
    totalSiteLocations: 4,
    passCriteria: 'D34 MD',
    notification: '30% per submission',
    fooBar: '4645645',
  },
];

import type { DropdownItem } from '@gsp/ui';

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

export const appPlansMock: AppPlan[] = [
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
    name: 'Ultrabolts',
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
    appAccess: 'Pull-test, Ultrabolts, xCyclops',
    role: 'User',
    phoneNumber: '+4683729327',
  },
  {
    id: '2',
    fullName: 'Jimmy Nwadinkpa',
    email: 'jimmy@sandvik.com',
    appAccess: 'Ultrabolts, xCyclops',
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
    appAccess: 'Pull-test, Ultrabolts, xCyclops',
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

export interface AdministratorSchema {
  id: string;
  fullName: string;
  email: string;
  company: string;
  phoneNumber: string;
  role: string;
}

export const administratorsMock: AdministratorSchema[] = [
  {
    id: '1',
    fullName: 'Elliot Alderson',
    email: 'elliot@sandvik.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '2',
    fullName: 'Darlene Alderson',
    email: 'darlenealderson@sandvik.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '3',
    fullName: 'Tyrell Wellick',
    email: 'tyrellwellick@sandvik.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '4',
    fullName: 'Joanna Wellick',
    email: 'joanna@sandvik.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '5',
    fullName: 'Angela Moss',
    email: 'angela@moss.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '6',
    fullName: 'Whiterose',
    email: 'whiterose.sandvik.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '7',
    fullName: 'Felix Östergren',
    email: 'felix@hackerboy.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
  {
    id: '8',
    fullName: 'Jimmy Nwadinkpa',
    email: 'jimmy@madchadlad.com',
    company: 'Sandvik',
    phoneNumber: '+4683729327',
    role: 'Sandvik admin',
  },
];

export const sitesMock = [
  {
    id: '1',
    name: 'Garpenberg site',
    levels: [
      {
        id: '1',
        name: '4002',
        drives: [
          {
            id: '1',
            name: '2001',
            locations: [
              {
                id: '1',
                name: '20, 42',
              },
              {
                id: '2',
                name: '22, 49',
              },
              {
                id: '3',
                name: '26, 55',
              },
              {
                id: '4',
                name: '29, 50',
              },
              {
                id: '5',
                name: '33, 65',
              },
              {
                id: '6',
                name: '34, 63',
              },
            ],
          },
          {
            id: '2',
            name: '2002',
            locations: [
              {
                id: '1',
                name: '1, 2',
              },
            ],
          },
          {
            id: '3',
            name: '2003',
            locations: [
              {
                id: '1',
                name: '2, 43',
              },
              {
                id: '2',
                name: '25, 55',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: '4003',
        drives: [
          {
            id: '1',
            name: '2007',
            locations: [
              {
                id: '1',
                name: '22, 433',
              },
              {
                id: '2',
                name: '525, 545',
              },
            ],
          },
          {
            id: '2',
            name: '2008',
            locations: [
              {
                id: '1',
                name: '2222, 433',
              },
              {
                id: '2',
                name: '251, 5225',
              },
            ],
          },
        ],
      },
      {
        id: '3',
        name: '4004',
        drives: [
          {
            id: '1',
            name: '5007',
            locations: [
              {
                id: '1',
                name: '2222, 433',
              },
              {
                id: '2',
                name: '251, 5225',
              },
            ],
          },
          {
            id: '2',
            name: '5008',
            locations: [],
          },
        ],
      },
      {
        id: '4',
        name: '4005',
        drives: [
          {
            id: '1',
            name: '2010',
            locations: [
              { id: '1', name: '15, 30' },
              { id: '2', name: '32, 45' },
            ],
          },
          {
            id: '2',
            name: '2011',
            locations: [
              { id: '1', name: '40, 50' },
              { id: '2', name: '52, 61' },
            ],
          },
        ],
      },
      {
        id: '5',
        name: '4006',
        drives: [
          {
            id: '1',
            name: '2015',
            locations: [
              { id: '1', name: '22, 34' },
              { id: '2', name: '30, 45' },
              { id: '3', name: '35, 47' },
            ],
          },
        ],
      },
      {
        id: '6',
        name: '4007',
        drives: [
          {
            id: '1',
            name: '2020',
            locations: [
              { id: '1', name: '12, 22' },
              { id: '2', name: '32, 42' },
            ],
          },
          {
            id: '2',
            name: '2021',
            locations: [],
          },
        ],
      },
      {
        id: '7',
        name: '4008',
        drives: [
          {
            id: '1',
            name: '2025',
            locations: [
              { id: '1', name: '45, 55' },
              { id: '2', name: '50, 60' },
              { id: '3', name: '55, 65' },
            ],
          },
        ],
      },
      {
        id: '8',
        name: '4009',
        drives: [
          {
            id: '1',
            name: '2030',
            locations: [
              { id: '1', name: '10, 20' },
              { id: '2', name: '25, 35' },
            ],
          },
          {
            id: '2',
            name: '2031',
            locations: [{ id: '1', name: '35, 45' }],
          },
        ],
      },
      {
        id: '9',
        name: '4010',
        drives: [
          {
            id: '1',
            name: '2040',
            locations: [
              { id: '1', name: '5, 15' },
              { id: '2', name: '20, 30' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Gollum site',
    levels: [
      {
        id: '1',
        name: '1055',
        drives: [
          {
            id: '1',
            name: '5555',
            locations: [
              {
                id: '1',
                name: '12, 33',
              },
              {
                id: '2',
                name: '44, 34',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: '3006',
        drives: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Kiruna site',
    levels: [],
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
