import authorSignature from './image/signature.png';
import authorImage from './image/author.jpg';
import SandvikLogo from './image/sandvik-logo.jpg';
// @TODO Currently ENUMS from backend are not able to access in the FE. Hardcode them here for now.
export type PlanLevel = 'GOLD' | 'SILVER' | 'BRONZE' | 'INACTIVE';

export type Application =
  | 'PULL_TEST'
  | 'PULL_TEST_OPERATOR'
  | 'ULTRABOLTS'
  | 'XCYCLOPS';

export type SiteResultSchema = {
  id: string;
  name: string;
  address: string;
  totalSiteLocations: number;
  passCriteria?: string;
  notification?: string;
  fooBar?: string;
};

type AppPlan = {
  name: string;
  activePlan?: PlanLevel;
  id: string;
};

export const siteResultMock: Site[] = [
  {
    id: '1',
    siteName: 'Garpenberg',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    siteName: 'Garpenberg',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    siteName: 'Berggarpen',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    siteName: 'Berggarpen',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    siteName: 'Garpenberg',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    siteName: 'Garpenberg',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '7',
    siteName: 'Garpenberg',
    address: 'Kaspersbo 20',
    city: 'Göteborg',
    country: 'Sverige',
    postalCode: '77849',
    companyId: '111',
    createdAt: '',
    updatedAt: '',
  },
];

import { Site } from '@/gql/graphql';
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

export const optionAdministratorRoleMock = [
  {
    id: 'Sandvik admin',
    name: 'Sandvik admin',
  },
  {
    id: 'Sandvik Supah admin',
    name: 'Sandvik Supah admin',
  },
];

export const appPlansMock: AppPlan[] = [
  {
    name: 'Pull-test',
    activePlan: 'GOLD',
    id: '1',
  },
  {
    name: 'xCyclops',
    activePlan: undefined,
    id: '2',
  },
  {
    name: 'Ultrabolts',
    activePlan: 'BRONZE',
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

export type UserSchema = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  workPlace?: string;
  globalRole?: boolean;
  isGlobalVisibility?: boolean;
  userPermissions: {
    id: string;
    userId: string;
    role: 'User' | 'Technician' | 'Admin';
    appAccess: string[];
  };
};

export const usersMock: UserSchema[] = [
  {
    id: '1',
    fullName: 'Elliot Alderson',
    email: 'alderson@sandvik.com',
    workPlace: 'Garpenberg',
    globalRole: true,
    isGlobalVisibility: true,
    userPermissions: {
      id: '10',
      userId: '1',
      role: 'Admin',
      appAccess: ['PULL_TEST', 'PULL_TEST_OPERATOR', 'ULTRABOLTS', 'XCYCLOPS'],
    },
    phoneNumber: '+4683729327',
  },
  {
    id: '2',
    fullName: 'Jimmy Nwadinkpa',
    email: 'jimmy@sandvik.com',
    globalRole: false,
    isGlobalVisibility: false,
    userPermissions: {
      id: '11',
      userId: '2',
      role: 'Technician',
      appAccess: ['ULTRABOLTS', 'XCYCLOPS'],
    },
    phoneNumber: '+4683729327',
  },
  {
    id: '3',
    fullName: 'Felix Östergren',
    email: 'felix@sandvik.com',
    workPlace: 'Garpenberg',
    globalRole: true,
    isGlobalVisibility: true,
    userPermissions: {
      id: '12',
      userId: '3',
      role: 'User',
      appAccess: ['PULL_TEST', 'PULL_TEST_OPERATOR'],
    },
    phoneNumber: '+4683729327',
  },
  {
    id: '4',
    fullName: 'Darlene Alderson',
    email: 'darlenealderson@sandvik.com',
    globalRole: false,
    isGlobalVisibility: false,
    userPermissions: {
      id: '100',
      userId: '4',
      role: 'Admin',
      appAccess: ['PULL_TEST', 'ULTRABOLTS', 'XCYCLOPS'],
    },
    phoneNumber: '+4683729327',
  },
];

export type TechniciansSchema = {
  id: string;
  fullName: string;
  email: string;
  company: string;
  isGlobal: boolean;
  phoneNumber: string;
};

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

export type AdministratorSchema = {
  id: string;
  fullName: string;
  email: string;
  company: string;
  phoneNumber: string;
  role: string;
};

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
    role: 'Sandvik Supah admin',
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
    role: 'Sandvik Supah admin',
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
    role: 'Sandvik Supah admin',
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
    background: 'neutral',
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
    userId: '1',
    name: 'Elliot Alderson',
    email: 'elliot@ecorp.com',
  },
  {
    id: '2',
    userId: '2',
    name: 'Darlene Alderson',
    email: 'dolores@haze.com',
  },
  {
    id: '3',
    userId: '3',
    name: 'Tyrell Wellick',
    email: 'tyrell@ecorp.com',
  },
  {
    id: '4',
    userId: '4',
    name: 'Joanna Wellick',
    email: 'joanna@ecorp.com',
  },
  {
    id: '5',
    userId: '5',
    name: 'Angela Moss',
    email: 'angela@ecorp.com',
  },
  {
    id: '6',
    userId: '6',
    name: 'Whiterose',
    email: 'dark@army.com',
  },
  {
    id: '7',
    userId: '7',
    name: 'Felix Östergren',
    email: 'felix@ecorp.com',
  },
  {
    id: '8',
    userId: '8',
    name: 'Jimmy Nwadinkpa',
    email: 'jimmy@sandvik.com',
  },
];

export const pdfComponentMockData = {
  pdfPageTitle: 'Pull Test Report',
  Layout: {
    logo: SandvikLogo,
    authorImage: authorImage,
    authorSignature: authorSignature,
    contactHtml: '<strong>John Doe</strong> - Site Manager',
  },
  pdfTablemockData: [
    {
      'bolt number': '1',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.2,
      'Peak Displacement': 27,
      level: 'fw 188h 320',
      drive: '1663 upper',
      'position in the ring': 'r/h backs',
      results: 'pass',
    },
    {
      'bolt number': '2',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.8,
      'Peak Displacement': 29,
      level: 'fw 189h 322',
      drive: '1662 lower',
      'position in the ring': 'l/h upper',
      results: 'fail',
    },
    {
      'bolt number': '3',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.9,
      'Peak Displacement': 25,
      level: 'fw 187h 318',
      drive: '1660 upper',
      'position in the ring': 'r/h mid',
      results: 'pass',
    },
    {
      'bolt number': '4',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.3,
      'Peak Displacement': 24,
      level: 'fw 190h 325',
      drive: '1661 upper',
      'position in the ring': 'l/h backs',
      results: 'fail',
    },
    {
      'bolt number': '5',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.6,
      'Peak Displacement': 26,
      level: 'fw 187h 318',
      drive: '1660 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '6',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.1,
      'Peak Displacement': 28,
      level: 'fw 188h 320',
      drive: '1663 lower',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '7',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 12.9,
      'Peak Displacement': 22,
      level: 'fw 191h 328',
      drive: '1662 upper',
      'position in the ring': 'r/h backs',
      results: 'fail',
    },
    {
      'bolt number': '8',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.6,
      'Peak Displacement': 23,
      level: 'fw 192h 330',
      drive: '1664 lower',
      'position in the ring': 'l/h upper',
      results: 'pass',
    },
    {
      'bolt number': '9',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 17.0,
      'Peak Displacement': 27,
      level: 'fw 189h 322',
      drive: '1661 upper',
      'position in the ring': 'r/h mid',
      results: 'pass',
    },
    {
      'bolt number': '10',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.8,
      'Peak Displacement': 24,
      level: 'fw 190h 325',
      drive: '1663 upper',
      'position in the ring': 'l/h backs',
      results: 'fail',
    },
    {
      'bolt number': '11',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.2,
      'Peak Displacement': 28,
      level: 'fw 188h 320',
      drive: '1662 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '12',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.9,
      'Peak Displacement': 29,
      level: 'fw 187h 318',
      drive: '1664 lower',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '13',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.7,
      'Peak Displacement': 26,
      level: 'fw 191h 328',
      drive: '1660 upper',
      'position in the ring': 'r/h backs',
      results: 'fail',
    },
    {
      'bolt number': '14',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.3,
      'Peak Displacement': 27,
      level: 'fw 189h 322',
      drive: '1662 lower',
      'position in the ring': 'l/h backs',
      results: 'pass',
    },
    {
      'bolt number': '15',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.5,
      'Peak Displacement': 23,
      level: 'fw 187h 318',
      drive: '1661 upper',
      'position in the ring': 'r/h mid',
      results: 'pass',
    },
    {
      'bolt number': '16',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 15.8,
      'Peak Displacement': 27,
      level: 'fw 190h 325',
      drive: '1664 lower',
      'position in the ring': 'l/h upper',
      results: 'fail',
    },
    {
      'bolt number': '17',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.0,
      'Peak Displacement': 25,
      level: 'fw 191h 328',
      drive: '1660 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '18',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.2,
      'Peak Displacement': 21,
      level: 'fw 188h 320',
      drive: '1663 upper',
      'position in the ring': 'l/h mid',
      results: 'fail',
    },
    {
      'bolt number': '19',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.4,
      'Peak Displacement': 28,
      level: 'fw 187h 318',
      drive: '1661 upper',
      'position in the ring': 'r/h backs',
      results: 'pass',
    },
    {
      'bolt number': '20',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.5,
      'Peak Displacement': 23,
      level: 'fw 189h 322',
      drive: '1662 lower',
      'position in the ring': 'l/h upper',
      results: 'fail',
    },
    {
      'bolt number': '21',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 17.1,
      'Peak Displacement': 29,
      level: 'fw 190h 325',
      drive: '1664 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '22',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.8,
      'Peak Displacement': 24,
      level: 'fw 192h 330',
      drive: '1663 lower',
      'position in the ring': 'l/h backs',
      results: 'pass',
    },
    {
      'bolt number': '23',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 12.9,
      'Peak Displacement': 22,
      level: 'fw 191h 328',
      drive: '1660 upper',
      'position in the ring': 'r/h mid',
      results: 'fail',
    },
    {
      'bolt number': '24',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.6,
      'Peak Displacement': 28,
      level: 'fw 188h 320',
      drive: '1661 upper',
      'position in the ring': 'l/h upper',
      results: 'pass',
    },
    {
      'bolt number': '25',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.7,
      'Peak Displacement': 24,
      level: 'fw 190h 325',
      drive: '1664 lower',
      'position in the ring': 'r/h upper',
      results: 'fail',
    },
    {
      'bolt number': '26',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.4,
      'Peak Displacement': 25,
      level: 'fw 192h 330',
      drive: '1662 upper',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '27',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 17.0,
      'Peak Displacement': 28,
      level: 'fw 189h 322',
      drive: '1663 upper',
      'position in the ring': 'r/h mid',
      results: 'pass',
    },
    {
      'bolt number': '28',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 12.6,
      'Peak Displacement': 21,
      level: 'fw 190h 325',
      drive: '1661 lower',
      'position in the ring': 'l/h upper',
      results: 'fail',
    },
    {
      'bolt number': '29',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.1,
      'Peak Displacement': 26,
      level: 'fw 191h 328',
      drive: '1660 upper',
      'position in the ring': 'r/h backs',
      results: 'pass',
    },
    {
      'bolt number': '30',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.7,
      'Peak Displacement': 27,
      level: 'fw 188h 320',
      drive: '1664 upper',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '31',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.4,
      'Peak Displacement': 22,
      level: 'fw 187h 318',
      drive: '1663 upper',
      'position in the ring': 'r/h upper',
      results: 'fail',
    },
    {
      'bolt number': '32',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 17.3,
      'Peak Displacement': 28,
      level: 'fw 190h 325',
      drive: '1662 lower',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '33',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.8,
      'Peak Displacement': 23,
      level: 'fw 191h 328',
      drive: '1664 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '34',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.0,
      'Peak Displacement': 26,
      level: 'fw 188h 320',
      drive: '1663 upper',
      'position in the ring': 'l/h backs',
      results: 'pass',
    },
    {
      'bolt number': '35',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.2,
      'Peak Displacement': 22,
      level: 'fw 189h 322',
      drive: '1661 upper',
      'position in the ring': 'r/h mid',
      results: 'fail',
    },
    {
      'bolt number': '36',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.5,
      'Peak Displacement': 27,
      level: 'fw 190h 325',
      drive: '1660 upper',
      'position in the ring': 'l/h upper',
      results: 'pass',
    },
    {
      'bolt number': '37',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 17.2,
      'Peak Displacement': 29,
      level: 'fw 188h 320',
      drive: '1664 lower',
      'position in the ring': 'r/h backs',
      results: 'pass',
    },
    {
      'bolt number': '38',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.8,
      'Peak Displacement': 25,
      level: 'fw 187h 318',
      drive: '1663 upper',
      'position in the ring': 'l/h backs',
      results: 'fail',
    },
    {
      'bolt number': '39',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.7,
      'Peak Displacement': 24,
      level: 'fw 190h 325',
      drive: '1660 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '40',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.5,
      'Peak Displacement': 28,
      level: 'fw 192h 330',
      drive: '1664 upper',
      'position in the ring': 'l/h mid',
      results: 'fail',
    },
    {
      'bolt number': '41',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.4,
      'Peak Displacement': 22,
      level: 'fw 189h 322',
      drive: '1661 lower',
      'position in the ring': 'r/h backs',
      results: 'pass',
    },
    {
      'bolt number': '42',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 15.1,
      'Peak Displacement': 27,
      level: 'fw 191h 328',
      drive: '1663 lower',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '43',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 17.0,
      'Peak Displacement': 29,
      level: 'fw 190h 325',
      drive: '1662 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '44',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 12.8,
      'Peak Displacement': 21,
      level: 'fw 188h 320',
      drive: '1660 upper',
      'position in the ring': 'l/h mid',
      results: 'fail',
    },
    {
      'bolt number': '45',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.9,
      'Peak Displacement': 25,
      level: 'fw 187h 318',
      drive: '1661 upper',
      'position in the ring': 'r/h upper',
      results: 'pass',
    },
    {
      'bolt number': '46',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.3,
      'Peak Displacement': 27,
      level: 'fw 191h 328',
      drive: '1662 lower',
      'position in the ring': 'l/h backs',
      results: 'pass',
    },
    {
      'bolt number': '47',
      'Bolt type': 'MDX47',
      'Peak Load(tons)': 14.6,
      'Peak Displacement': 24,
      level: 'fw 192h 330',
      drive: '1663 lower',
      'position in the ring': 'r/h mid',
      results: 'fail',
    },
    {
      'bolt number': '48',
      'Bolt type': 'MDX50',
      'Peak Load(tons)': 16.8,
      'Peak Displacement': 28,
      level: 'fw 188h 320',
      drive: '1664 upper',
      'position in the ring': 'l/h mid',
      results: 'pass',
    },
    {
      'bolt number': '49',
      'Bolt type': 'MDX45',
      'Peak Load(tons)': 13.6,
      'Peak Displacement': 25,
      level: 'fw 189h 322',
      drive: '1661 upper',
      'position in the ring': 'r/h backs',
      results: 'pass',
    },
  ],
  reportDetails: {
    startDate: '15-12-2024',
    companyName: 'St Barbara',
    mine: 'Sons of Gwalia',
    contractor: 'Byrnecut',
    commodity: 'Gold',
    contactPerson: [
      { name: 'Mehul Panchal', designation: 'Software Engineer' },
      { name: 'Richard Battison', designation: 'Geotechnical Engineer' },
    ],
    author: 'Gary Ochtman',
    designation: 'PSSR-Ground-Support',
    email: 'gary.ochtman@sandvik.com',
    contactNumber: '+614379382883',
  },
};
