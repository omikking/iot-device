'use client';
import { Badge, DataTable, TableHeadWithSorting } from '@gsp/ui';
import type { ColumnDef, HeaderContext } from '@gsp/ui';

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
  const siteResultsMock: SiteResultSchema[] = [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <TableHeadWithSorting column={column} header="Site name" />
      ),
    },
    {
      accessorKey: 'adress',
      header: 'Adress',
    },
    {
      accessorKey: 'totalSiteLocations',
      header: 'Total site locations',
    },
    {
      accessorKey: 'passCriteria',
      header: 'Pass criteria',
    },
    {
      accessorKey: 'notification',
      header: 'Notification',
    },
    {
      accessorKey: 'fooBar',
      header: 'Foo bar',
    },
  ];

  return (
    <>
      {/* 
            next feature link total site locations with sitelocations page and give it the props of the site
    */}
      <DataTable columns={columns} data={siteResultsMock} />
      <Badge variant="neutral" className="self-start mt-5">
        {siteResultsMock.length} total
      </Badge>
    </>
  );
};
