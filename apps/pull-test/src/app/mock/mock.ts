export const boltResultDesignSystemMock = [
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

// TODO Fix mock data
// export interface BoltResultSchema {
//   id: string;
//   boltNumber: string;
//   boltType: string;
//   peakLoad: string[];
//   peakDisplacement: string[];
//   bitSize: string;
//   rotations: string;
//   displacementPerTonnage: string;
//   level: { levelName: string };
//   drive: { driveName: string };
//   location: { locationName: string };
//   ring: string;
//   comment?: string;
//   result: 'PASS' | 'FAIL' | 'ABORT';
//   image?: string;
//   isHazard?: boolean;
//   createdDate: Date;
//   author?: string;
// }

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
