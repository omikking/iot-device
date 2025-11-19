import { Application } from '@/gql/graphql';

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

export const tableViewDesignSystemMock = [
  { title: 'Status', value: 'Low Plastic' },
  {
    title: 'Location',
    value: 'Garpenberg, Level 4002, Drive 2001, Location 20,42',
  },
  { title: 'Last inspection', value: '2023-10-10' },
  { title: 'Next inspection', value: '2024-04-10' },
  { title: 'Assigned to', value: ['Elliot Alderson', 'Jimmy Nwadinkpa'] },
  { title: 'Tags', value: ['Critical', 'Outdoor'] },
  {
    title: 'Comments',
    value: 'Requires special handling during winter months.',
  },
  { title: 'Created by', value: 'Admin User' },
];

export const usersDesignSystemMock: UserSchema[] = [
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
      appAccess: [
        Application.PullTest,
        Application.PullTestTechnician,
        // Application.Banshee,
      ],
    },
    phoneNumber: '+4683721111',
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
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721112',
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
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721113',
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
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721114',
  },
  {
    id: '5',
    fullName: 'Dominique DiPierro',
    email: 'dominiquedipierro@sandvik.com',
    globalRole: false,
    isGlobalVisibility: false,
    userPermissions: {
      id: '100',
      userId: '5',
      role: 'Admin',
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721115',
  },
  {
    id: '6',
    fullName: 'Leon Badmon',
    email: 'leonbadmon@sandvik.com',
    globalRole: false,
    isGlobalVisibility: false,
    userPermissions: {
      id: '100',
      userId: '6',
      role: 'Admin',
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721116',
  },
  {
    id: '7',
    fullName: 'Fernando Vera',
    email: 'fernandovera@sandvik.com',
    globalRole: false,
    isGlobalVisibility: false,
    userPermissions: {
      id: '100',
      userId: '7',
      role: 'Admin',
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721117',
  },
  {
    id: '8',
    fullName: 'Ray Heyworth',
    email: 'rayheyworth@sandvik.com',
    globalRole: false,
    isGlobalVisibility: false,
    userPermissions: {
      id: '100',
      userId: '8',
      role: 'Admin',
      appAccess: [Application.PullTest, Application.PullTestTechnician],
    },
    phoneNumber: '+4683721118',
  },
];

export const sitesDesignSystemMock = [
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
