interface level {
  levelName: string;
}

interface location {
  locationName: string;
}
interface drive {
  driveName: string;
}
export interface BoltResultSchema {
  levelName: string;
  id: string;
  boltNumber: string;
  boltType: string;
  peakLoad: string[];
  peakDisplacement: string[];
  bitSize: string;
  rotations: string;
  displacementPerTonnage: string;
  level: level;
  drive: drive;
  location: location;
  ring: string;
  comment?: string;
  result: 'PASS' | 'FAIL' | 'ABORT';
  image?: string;
  isHazard?: boolean;
  createdDate: Date;
  author?: string;
}

export interface MultiBoltReadingSchema {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
}

export const boltResultsMock: BoltResultSchema[] = [
  {
    levelName: 'Level 1',
    id: 'ID001',
    boltNumber: 'BN123',
    boltType: 'Hex',
    peakLoad: ['300', '350', '375'],
    peakDisplacement: ['0.3', '0.35', '0.38'],
    bitSize: '16',
    rotations: '10',
    displacementPerTonnage: '0.02',
    level: {
      levelName: 'High',
    },
    drive: {
      driveName: 'Hydraulic',
    },
    location: {
      locationName: 'Site A',
    },
    ring: 'Ring 1',
    comment: 'Initial testing successful.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T10:00:00'),
    author: 'John Doe',
  },
  {
    levelName: 'Level 2',
    id: 'ID002',
    boltNumber: 'BN124',
    boltType: 'Square',
    peakLoad: ['400', '425', '440'],
    peakDisplacement: ['0.4', '0.42', '0.45'],
    bitSize: '18',
    rotations: '12',
    displacementPerTonnage: '0.025',
    level: {
      levelName: 'Medium',
    },
    drive: {
      driveName: 'Electric',
    },
    location: {
      locationName: 'Site B',
    },
    ring: 'Ring 2',
    comment: 'Failed initial displacement check.',
    result: 'FAIL',
    createdDate: new Date('2025-04-09T11:00:00'),
    author: 'Jane Smith',
  },
  {
    levelName: 'Level 3',
    id: 'ID003',
    boltNumber: 'BN125',
    boltType: 'Round',
    peakLoad: ['500', '550', '580'],
    peakDisplacement: ['0.45', '0.48', '0.5'],
    bitSize: '20',
    rotations: '15',
    displacementPerTonnage: '0.03',
    level: {
      levelName: 'Low',
    },
    drive: {
      driveName: 'Manual',
    },
    location: {
      locationName: 'Site C',
    },
    ring: 'Ring 3',
    comment: 'Testing aborted due to mechanical failure.',
    result: 'ABORT',
    createdDate: new Date('2025-04-09T12:00:00'),
    author: 'David Lee',
  },
  {
    levelName: 'Level 4',
    id: 'ID004',
    boltNumber: 'BN126',
    boltType: 'Hex',
    peakLoad: ['600', '625', '650'],
    peakDisplacement: ['0.5', '0.53', '0.55'],
    bitSize: '22',
    rotations: '18',
    displacementPerTonnage: '0.035',
    level: {
      levelName: 'High',
    },
    drive: {
      driveName: 'Hydraulic',
    },
    location: {
      locationName: 'Site D',
    },
    ring: 'Ring 4',
    comment: 'Passed all tests successfully.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T13:00:00'),
    author: 'Michael Taylor',
  },
  {
    levelName: 'Level 5',
    id: 'ID005',
    boltNumber: 'BN127',
    boltType: 'Square',
    peakLoad: ['700', '725', '750'],
    peakDisplacement: ['0.55', '0.58', '0.6'],
    bitSize: '24',
    rotations: '20',
    displacementPerTonnage: '0.04',
    level: {
      levelName: 'Medium',
    },
    drive: {
      driveName: 'Electric',
    },
    location: {
      locationName: 'Site E',
    },
    ring: 'Ring 5',
    comment: 'Routine check, no issues found.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T14:00:00'),
    author: 'Emily Johnson',
  },
  {
    levelName: 'Level 6',
    id: 'ID006',
    boltNumber: 'BN128',
    boltType: 'Round',
    peakLoad: ['800', '825', '850'],
    peakDisplacement: ['0.6', '0.63', '0.65'],
    bitSize: '26',
    rotations: '25',
    displacementPerTonnage: '0.045',
    level: {
      levelName: 'Low',
    },
    drive: {
      driveName: 'Manual',
    },
    location: {
      locationName: 'Site F',
    },
    ring: 'Ring 6',
    comment: 'Aborted due to equipment malfunction.',
    result: 'ABORT',
    createdDate: new Date('2025-04-09T15:00:00'),
    author: 'Sarah Brown',
  },
  {
    levelName: 'Level 7',
    id: 'ID007',
    boltNumber: 'BN129',
    boltType: 'Hex',
    peakLoad: ['900', '925', '950'],
    peakDisplacement: ['0.65', '0.7', '0.72'],
    bitSize: '28',
    rotations: '30',
    displacementPerTonnage: '0.05',
    level: {
      levelName: 'High',
    },
    drive: {
      driveName: 'Hydraulic',
    },
    location: {
      locationName: 'Site G',
    },
    ring: 'Ring 7',
    comment: 'Test passed without any issues.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T16:00:00'),
    author: 'Jake White',
  },
  {
    levelName: 'Level 8',
    id: 'ID008',
    boltNumber: 'BN130',
    boltType: 'Square',
    peakLoad: ['1000', '1050', '1100'],
    peakDisplacement: ['0.7', '0.72', '0.75'],
    bitSize: '30',
    rotations: '35',
    displacementPerTonnage: '0.055',
    level: {
      levelName: 'Medium',
    },
    drive: {
      driveName: 'Electric',
    },
    location: {
      locationName: 'Site H',
    },
    ring: 'Ring 8',
    comment: 'Passed initial test phase.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T17:00:00'),
    author: 'Liam Harris',
  },
  {
    levelName: 'Level 9',
    id: 'ID009',
    boltNumber: 'BN131',
    boltType: 'Round',
    peakLoad: ['1100', '1150', '1200'],
    peakDisplacement: ['0.75', '0.78', '0.8'],
    bitSize: '32',
    rotations: '40',
    displacementPerTonnage: '0.06',
    level: {
      levelName: 'Low',
    },
    drive: {
      driveName: 'Manual',
    },
    location: {
      locationName: 'Site I',
    },
    ring: 'Ring 9',
    comment: 'Test failed due to displacement exceeding limit.',
    result: 'FAIL',
    createdDate: new Date('2025-04-09T18:00:00'),
    author: 'Chris King',
  },
  {
    levelName: 'Level 10',
    id: 'ID010',
    boltNumber: 'BN132',
    boltType: 'Hex',
    peakLoad: ['1200', '1250', '1300'],
    peakDisplacement: ['0.8', '0.82', '0.85'],
    bitSize: '34',
    rotations: '45',
    displacementPerTonnage: '0.065',
    level: {
      levelName: 'High',
    },
    drive: {
      driveName: 'Hydraulic',
    },
    location: {
      locationName: 'Site J',
    },
    ring: 'Ring 10',
    comment: 'Passed with no issues.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T19:00:00'),
    author: 'Olivia Lee',
  },
  {
    levelName: 'Level 11',
    id: 'ID011',
    boltNumber: 'BN133',
    boltType: 'Square',
    peakLoad: ['1300', '1350', '1400'],
    peakDisplacement: ['0.85', '0.87', '0.9'],
    bitSize: '36',
    rotations: '50',
    displacementPerTonnage: '0.07',
    level: {
      levelName: 'Medium',
    },
    drive: {
      driveName: 'Electric',
    },
    location: {
      locationName: 'Site K',
    },
    ring: 'Ring 11',
    comment: 'Routine test with satisfactory results.',
    result: 'PASS',
    createdDate: new Date('2025-04-09T20:00:00'),
    author: 'Mason Green',
  },
  {
    levelName: 'Level 12',
    id: 'ID012',
    boltNumber: 'BN134',
    boltType: 'Round',
    peakLoad: ['1400', '1450', '1500'],
    peakDisplacement: ['0.9', '0.92', '0.95'],
    bitSize: '38',
    rotations: '60',
    displacementPerTonnage: '0.075',
    level: {
      levelName: 'Low',
    },
    drive: {
      driveName: 'Manual',
    },
    location: {
      locationName: 'Site L',
    },
    ring: 'Ring 12',
    comment: 'Aborted due to equipment issue.',
    result: 'ABORT',
    createdDate: new Date('2025-04-09T21:00:00'),
    author: 'Sophia Black',
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
