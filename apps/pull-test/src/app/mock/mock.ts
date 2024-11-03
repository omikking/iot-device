export interface BoltResultSchema {
  id: string;
  boltNumber: string;
  boltType: string;
  peakLoad: string[];
  peakDisplacement: string[];
  bitSize: string;
  rotations: string;
  displacementPerTonnage: string;
  level: string;
  drive: string;
  position: string;
  ring: string;
  comment?: string;
  result: 'Pass' | 'Fail' | 'Abort';
  image?: string;
  isHazard?: boolean;
  createdDate: Date;
}

export interface MultiBoltReadingSchema {
  reading: string;
  peakLoad: string;
  peakDisplacement: string;
}

export const boltResultsMock: BoltResultSchema[] = [
  {
    id: '1',
    boltNumber: '1',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['13'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '251, 5225',
    ring: 'RH-BACK',
    comment: 'Smooth Operator',
    result: 'Pass',
    image: '/boltTestImage.png',
    isHazard: true,
    createdDate: new Date('2024-09-01T10:30:00'),
  },
  {
    id: '2',
    boltNumber: '2',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['15'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '251, 5225',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Fail',
    image: '/boltTestImage.png',
    createdDate: new Date('2024-09-01T10:30:00'),
  },
  {
    id: '3',
    boltNumber: '3',
    boltType: 'MXD47',
    peakLoad: ['15', '16'],
    peakDisplacement: ['15', '16'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '251, 5225',
    ring: 'RH-BACK',
    result: 'Pass',
    image: '/boltTestImage.png',
    isHazard: true,
    createdDate: new Date('2024-09-01T10:30:00'),
  },
  {
    id: '4',
    boltNumber: '4',
    boltType: 'MXD47',
    peakLoad: ['15', '18'],
    peakDisplacement: ['15', '18'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '22, 49',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Pass',
    createdDate: new Date('2024-09-05T10:30:00'),
  },
  {
    id: '5',
    boltNumber: '5',
    boltType: 'MXD47',
    peakLoad: ['15', '18'],
    peakDisplacement: ['15', '40'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '1, 2',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Abort',
    image: '/boltTestImage.png',
    isHazard: true,
    createdDate: new Date('2024-09-05T10:30:00'),
  },
  {
    id: '6',
    boltNumber: '6',
    boltType: 'MXD47',
    peakLoad: ['15', '18'],
    peakDisplacement: ['15', '30'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '2, 43',
    ring: 'RH-BACK',
    result: 'Pass',
    createdDate: new Date('2024-09-05T10:30:00'),
  },
  {
    id: '7',
    boltNumber: '7',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['15'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '2222, 433',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
    image: '/boltTestImage.png',
    createdDate: new Date('2024-09-05T10:30:00'),
  },
  {
    id: '8',
    boltNumber: '8',
    boltType: 'MXD47',
    peakLoad: ['4', '15', '18'],
    peakDisplacement: ['15', '40', '60'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '2, 43',
    ring: 'RH-BACK',
    result: 'Pass',
    isHazard: true,
    createdDate: new Date('2024-09-11T10:30:00'),
  },
  {
    id: '9',
    boltNumber: '9',
    boltType: 'MXD47',
    peakLoad: ['15', '20', '30'],
    peakDisplacement: ['4', '15', '30'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '2, 43',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Pass',
    image: '/boltTestImage.png',
    createdDate: new Date('2024-09-16T10:30:00'),
  },
  {
    id: '10',
    boltNumber: '10',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['26'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '251, 5225',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Pass',
    image: '/boltTestImage.png',
    createdDate: new Date('2024-10-11T10:30:00'),
  },
  {
    id: '11',
    boltNumber: '11',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['38'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Pass',
    isHazard: true,
    createdDate: new Date('2024-10-16T10:30:00'),
  },
  {
    id: '12',
    boltNumber: '12',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['23'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '12, 33',
    ring: 'RH-BACK',
    result: 'Pass',
    isHazard: true,
    createdDate: new Date('2024-10-18T10:30:00'),
  },
  {
    id: '13',
    boltNumber: '13',
    boltType: 'MXD47',
    peakLoad: ['15', '18'],
    peakDisplacement: ['15', '30'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Pass',
    image: '/boltTestImage.png',
    createdDate: new Date('2024-10-18T10:30:00'),
  },
  {
    id: '14',
    boltNumber: '14',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['15'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
    createdDate: new Date('2024-10-18T10:30:00'),
  },
  {
    id: '15',
    boltNumber: '15',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['15'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Pass',
    createdDate: new Date('2024-10-18T10:30:00'),
  },
  {
    id: '16',
    boltNumber: '16',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['15'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '44, 34',
    ring: 'RH-BACK',
    comment: 'A truly deceptive comment',
    result: 'Fail',
    createdDate: new Date('2024-10-25T10:30:00'),
  },
  {
    id: '17',
    boltNumber: '17',
    boltType: 'MXD47',
    peakLoad: ['15'],
    peakDisplacement: ['15'],
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: 'FW W 564 SLT',
    drive: '1660 Upper',
    position: '44, 34',
    ring: 'RH-BACK',
    result: 'Abort',
    createdDate: new Date('2024-11-05T10:30:00'),
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
  {
    title: 'Level',
    text: 'DOV 33 W',
  },
  {
    title: 'Drive',
    text: 'COS 1842',
  },
  {
    title: 'Position in ring',
    text: 'L/H Shoulder',
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
            positions: [
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
            positions: [
              {
                id: '1',
                name: '1, 2',
              },
            ],
          },
          {
            id: '3',
            name: '2003',
            positions: [
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
            positions: [
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
            positions: [
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
            positions: [
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
            positions: [],
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
            positions: [
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
