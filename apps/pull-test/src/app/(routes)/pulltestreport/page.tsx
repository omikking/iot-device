'use client';
import { boltResultsMock } from '@/app/mock/mock';
import { BoltResultsTable } from '@/components/BoltResultsTable';
import { Headline, Table, Tabs, TabsContent } from '@gsp/ui';

export default function Page({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="bg-neutral-1 w-full flex flex-col m-auto items-center py-20 gap-16">
          <Headline
            className="w-full flex flex-row items-center justify-start px-10"
            as="h1"
            color={'foreground'}
            variant={'xl'}
          >
            {/* should be bold */}
            PULL TEST REPORT
          </Headline>
          <div className="gap-10 w-full py-10 bg-main-white ">
            {/* Placeholders until cards comp is in main */}
            <div className="flex justify-center items-center gap-10">
              <div className="w-40 h-40 border border-gold-2">1</div>
              <div className="w-40 h-40 border border-gold-2">1</div>
              <div className="w-40 h-40 border border-gold-2">1</div>
            </div>

            <div className="flex items-center justify-center w-full h-60 bg-main-white">
              GRAPH
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full max-w-[1600px] px-10">
            <div className="w-full flex flex-row justify-between items-center pb-2"></div>

            <TabsContent value="table" className="w-full">
              <BoltResultsTable site={'site'} boltResults={boltResultsMock} />
            </TabsContent>

            <TabsContent value="graphs">
              <Table />
            </TabsContent>
          </Tabs>
          <div className="flex flex-row items-center justify-around w-full h-60 bg-neutral-4">
            <div className="flex w-5/12 bg-blue-400 h-full">
              LEFT
              {/* TODO put MultiBoltReading here */}
            </div>
            <div className="flex w-7/12 bg-red-400 h-full">
              RIGHT
              {/* TODO put Graph here */}
            </div>
          </div>
        </main>
        {children}
      </body>
    </html>
  );
}
