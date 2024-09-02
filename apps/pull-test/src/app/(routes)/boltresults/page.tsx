'use client';
import { BoltResultsTable } from '@/components/BoltResultsTable';
import { BoltSelection } from '@/components/BoltSelection';
import {
  Button,
  Headline,
  Table,
  Badge,
  Modal,
  ModalTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  GoBack,
} from '@gsp/ui';

import { LucideFileDown, LucideGrid3X3, LucideLineChart } from 'lucide-react';

export default function Page(): JSX.Element {
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-neutral-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        Garpenberg
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Bolt results
      </Headline>

      <Tabs defaultValue="table">
        <div className="w-full flex flex-row justify-between items-center pb-2">
          <TabsList>
            <TabsTrigger value="table">
              <LucideGrid3X3 size="18" className="mr-1.5" />
              Table
            </TabsTrigger>
            <TabsTrigger value="graphs">
              <LucideLineChart size="18" className="mr-1.5" />
              Graphs
            </TabsTrigger>
          </TabsList>

          <Modal>
            <ModalTrigger asChild>
              <Button variant="primary" size="large">
                <LucideFileDown />
                Export PDF
              </Button>
            </ModalTrigger>
            {/* <ModalContent goes here /> */}
          </Modal>
        </div>

        <BoltSelection />

        <TabsContent value="table">
          <BoltResultsTable />
        </TabsContent>

        <TabsContent value="graphs">
          <Table className="ui-min-w-[1620px]" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
