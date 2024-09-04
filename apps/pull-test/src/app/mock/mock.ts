export interface BoltResultSchema {
  id: string;
  boltNumber: string;
  boltType: string;
  peakLoad: string;
  peakDisplacement: string;
  bitSize: string;
  rotations: string;
  displacementPerTonnage: string;
  level: string;
  drive: string;
  position: string;
  ring: string;
  comment: string;
  result: 'Pass' | 'Fail' | 'Abort';
}

export const boltResultsMock: BoltResultSchema[] = [
  {
    id: '1',
    boltNumber: '1',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4002',
    drive: '2001',
    position: '20, 42',
    ring: 'RH-BACK',
    comment: 'N/A', // fix logic later
    result: 'Pass',
  },
  {
    id: '2',
    boltNumber: '2',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4003',
    drive: '2008',
    position: '2222, 433',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Fail',
  },
  {
    id: '3',
    boltNumber: '3',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4004',
    drive: '5007',
    position: '251, 5225',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '4',
    boltNumber: '4',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4002',
    drive: '2001',
    position: '22, 49',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '5',
    boltNumber: '5',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4002',
    drive: '2002',
    position: '1, 2',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Abort',
  },
  {
    id: '6',
    boltNumber: '6',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4002',
    drive: '2003',
    position: '2, 43',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '7',
    boltNumber: '7',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4004',
    drive: '5007',
    position: '2222, 433',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '8',
    boltNumber: '8',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4002',
    drive: '2003',
    position: '2, 43',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '9',
    boltNumber: '9',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4002',
    drive: '2003',
    position: '2, 43',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '10',
    boltNumber: '10',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '4003',
    drive: '2008',
    position: '251, 5225',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '11',
    boltNumber: '11',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '12',
    boltNumber: '12',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '13',
    boltNumber: '13',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '14',
    boltNumber: '14',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '15',
    boltNumber: '15',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '12, 33',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Pass',
  },
  {
    id: '16',
    boltNumber: '16',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '44, 34',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Fail',
  },
  {
    id: '17',
    boltNumber: '17',
    boltType: 'D47 MDX',
    peakLoad: '15',
    peakDisplacement: 'KSFG-5555',
    bitSize: 'VOG-252',
    rotations: '504',
    displacementPerTonnage: '48',
    level: '1055',
    drive: '5555',
    position: '44, 34',
    ring: 'RH-BACK',
    comment: 'N/A',
    result: 'Abort',
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
