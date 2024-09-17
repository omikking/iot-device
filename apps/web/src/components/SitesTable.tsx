import { Badge, DataTable } from '@gsp/ui';
import type { ColumnDef } from '@gsp/ui';
import {} from //   LucideCheckCircle,
//   LucideOctagonAlert,
//   LucideSearchX,
'lucide-react';

interface SiteResultSchema {
  id: string;
  name: string;
  adress: string;
  totalSiteLocations: number;
  passCriteria?: string;
  notification?: string;
  fooBar?: string;
}

export const SiteResultsTable = () => {
  // const getResultBadge = (
  //   result: 'Pass' | 'Fail' | 'Abort',
  // ): {
  //   variant: 'success' | 'destructive' | 'warning';
  //   icon: React.ReactNode;
  // } => {
  //   switch (result) {
  //     case 'Pass':
  //       return { variant: 'success', icon: <LucideCheckCircle /> };
  //     case 'Fail':
  //       return { variant: 'destructive', icon: <LucideOctagonAlert /> };
  //     case 'Abort':
  //       return { variant: 'warning', icon: <LucideSearchX /> };
  //   }
  // };

  const siteResultMock: SiteResultSchema[] = [
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
  const columns: ColumnDef<SiteResultSchema>[] = [
    {
      accessorKey: 'boltNumber',
      header: 'Bolt number',
      meta: {
        headerClassName: 'w-36',
      },
    },
    {
      accessorKey: 'boltType',
      header: 'Bolt type',
    },
    {
      accessorKey: 'peakLoad',
      header: 'Peak load',
    },
    {
      accessorKey: 'peakDisplacement',
      header: 'Peak displacement',
      meta: {
        headerClassName: 'w-32',
      },
    },
    {
      accessorKey: 'bitSize',
      header: 'Bit size',
    },
    {
      accessorKey: 'rotations',
      header: 'Rotations',
    },
    {
      accessorKey: 'displacementPerTonnage',
      header: 'Displacement per tonnage',
      meta: {
        headerClassName: 'w-32',
      },
    },
    {
      accessorKey: 'level',
      header: 'Level',
    },
    {
      accessorKey: 'drive',
      header: 'Drive',
    },
    {
      accessorKey: 'position',
      header: 'Position',
    },
    {
      accessorKey: 'ring',
      header: 'Ring',
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
    },
    {
      accessorKey: 'result',
      header: () => <div className="text-right w-10">Result</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end w-10">
            <Badge variant={getResultBadge(row.getValue('result')).variant}>
              {getResultBadge(row.getValue('result')).icon}
              {row.getValue('result')}
            </Badge>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={boltResultsMock} />
      <Badge variant="neutral" className="self-start mt-5">
        {boltResultsMock.length} total
      </Badge>
    </>
  );
};
