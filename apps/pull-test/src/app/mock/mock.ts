export interface BoltResultSchema {
  id: string;
  boltNumber: string;
  boltType: string;
  peakLoad: string[];
  peakDisplacement: string[];
  bitSize: string;
  rotations: string;
  displacementPerTonnage: string;
  level: { levelName: string };
  drive: { driveName: string };
  location: { locationName: string };
  ring: string;
  comment?: string;
  result: 'PASS' | 'FAIL' | 'ABORT';
  image?: string;
  isHazard?: boolean;
  createdDate: Date;
  author?: string;
}

export type MultiBoltReadingSchema = {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
};

export const mockBoltResult = [
  {
    abortReason: 'NOT_TESTED_VOID_CAVITY',
    boltNumber: 3,
    boltType: 'MD47',
    comment: 'comment test here',
    createdAt: 1741005675314,
    driveId: 'Drive 1',
    hazardCompletedDate: [],
    id: 'Test 1',
    image: 'test image base64',
    isHazard: true,
    levelId: 'level 1',
    locationId: 'Location 1',
    peakDisplacement: [10],
    peakLoad: [15],
    positionInRing: 'RH_BACKS',
    result: 'PASS',
    siteId: 'Bat Cave',
    updatedAt: 1741005675314,
    userId: '6411e9b8-7925-4c80-b76b-8f5d47d19aec',
  },
];

export const hazardCardMock = [
  {
    dateTitle: '2021-05-23',
    isHazard: true,
    boltSpecifications: [
      {
        title: 'Bolt type',
        text: 'MD47',
      },
      {
        title: 'Peak load',
        text: '15',
      },
      {
        title: 'Displacement',
        text: '19mm',
      },
    ],
    boltDescription: 'Bolt could not be tested...',
  },
];

export const boltSpecifications = [
  {
    title: 'Site',
    text: 'Garpenberg',
  },
  {
    title: 'Bolt',
    text: '242',
  },
  {
    title: 'Bolt type',
    text: 'MD47',
  },
  {
    title: 'Level',
    text: 'DOV 33 W',
  },
  {
    title: 'Drive',
    text: 'COS 1842',
  },
  {
    title: 'Location',
    text: '22, 49',
  },
  {
    title: 'Position in ring',
    text: 'L/H Shoulder',
  },
  // @TODO: make these dynamic?
  {
    title: 'Result',
    text: 'Pass',
  },
  {
    title: 'Abort Reason',
    text: 'N/A',
  },
];

export const hazardCardsMock = [
  {
    dateTitle: '2021-05-23',
    isHazard: true,
    boltSpecifications,
    boltDescription: 'Bolt could not be tested...',
  },
  {
    dateTitle: '2021-08-24',
    isHazard: true,
    boltSpecifications,
    boltDescription:
      'The equipment showed signs of wear, indicating it may need replacement soon.',
  },
  {
    dateTitle: '2021-03-15',
    isHazard: false,
    boltSpecifications,
    boltDescription:
      'A routine inspection revealed significant issues, and the system is not functioning as expected.',
  },
  {
    dateTitle: '2021-10-05',
    isHazard: true,
    boltSpecifications,
    boltDescription:
      'Major scratches were found on the surface that affected the performance.',
  },
  {
    dateTitle: '2021-01-10',
    isHazard: true,
    boltSpecifications,
    boltDescription: 'There was a delay in response time, exchange ASAP.',
  },
  {
    dateTitle: '2021-11-10',
    isHazard: false,
    boltSpecifications,
    boltDescription:
      'All tests were successfully completed, and the component is in optimal condition.',
  },
  {
    dateTitle: '2021-11-20',
    isHazard: false,
    boltSpecifications,
    boltDescription:
      '"Inspection results show no defects; the equipment meets all operational standards.',
  },
  {
    dateTitle: '2021-03-01',
    isHazard: true,
    boltSpecifications,
    boltDescription:
      '"The device has passed all required benchmarks and is ready for use.',
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

// TODO Fix mock data
export const pdfComponentMockData = {
  pdfPageTitle: 'Pull Test Report',
  Layout: {
    contactHtml: '<strong>John Doe</strong> - Site Manager',
  },
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
  mockBoltResult: [
    {
      id: '11720819-92e6-4bdf-bda5-f4e19b0d902f',
      createdAt: 1749057227805,
      updatedAt: 1749057382730,
      boltNumber: 4,
      boltType: 'MDX47',
      peakLoad: [15],
      peakDisplacement: [5, 0],
      positionInRing: 'RH_BACKS',
      result: 'PASS',
      isHazard: true,
      hazardCompletedDate: [],
      abortReason: 'NOT_TESTED_VOID_CAVITY',
      comment: 'comment test here',
      image: 'test image base64',
      siteId: 'a2d270da-9f91-4be5-a1b4-b9b57867ea62',
      levelId: '7307dcee-2b58-4dcf-a909-d23d0e89ca87',
      driveId: 'aff892c3-2a1a-4eae-adb1-ffd7b186c7cf',
      locationId: '55753eb0-a49f-4924-a24b-583f857e4234',
      userId: '9efb629a-d3d0-4daf-a9da-fc03d09b701f',
      levelName: 'levelName1',
      driveName: 'driveName1',
    },
    {
      id: '286f175b-2314-4e1e-849f-bad0833d2192',
      createdAt: 1748944859686,
      updatedAt: 1749057382730,
      boltNumber: 2,
      boltType: 'MD47',
      peakLoad: [15],
      peakDisplacement: [10, 30],
      positionInRing: 'RH_BACKS',
      result: 'PASS',
      isHazard: true,
      hazardCompletedDate: [],
      abortReason: 'NOT_TESTED_VOID_CAVITY',
      comment: 'comment test here',
      image: 'test image base64',
      siteId: '3654b63c-c7cd-4968-9589-0ad9b4b7e765',
      levelId: '67d6ebad-41eb-4666-bd2a-0386cae65803',
      driveId: 'aff892c3-2a1a-4eae-adb1-ffd7b186c7cf',
      locationId: '2eea342b-20d1-45fe-b323-07474f97a3db',
      userId: '9efb629a-d3d0-4daf-a9da-fc03d09b701f',
      levelName: 'levelName2',
      driveName: 'driveName2',
    },
    {
      id: 'c52d09ef-f5db-408e-ac65-50026499c06b',
      createdAt: 1749057197564,
      updatedAt: 1749057382730,
      boltNumber: 3,
      boltType: 'MDX47',
      peakLoad: [15],
      peakDisplacement: [10, 20],
      positionInRing: 'RH_BACKS',
      result: 'PASS',
      isHazard: true,
      hazardCompletedDate: [],
      abortReason: 'NOT_TESTED_VOID_CAVITY',
      comment: 'comment test here',
      image: 'test image base64',
      siteId: 'a2d270da-9f91-4be5-a1b4-b9b57867ea62',
      levelId: '7307dcee-2b58-4dcf-a909-d23d0e89ca87',
      driveId: 'e4bb6250-9b31-44e5-a815-2ed56789a721',
      locationId: '55753eb0-a49f-4924-a24b-583f857e4234',
      userId: '9efb629a-d3d0-4daf-a9da-fc03d09b701f',
      levelName: 'levelName3',
      driveName: 'driveName3',
    },
  ],
};
