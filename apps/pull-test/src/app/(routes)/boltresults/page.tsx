'use client';
import { BoltResultSchema, boltResultsMock } from '@/app/mock/mock';
import { BoltResultsTable } from '@/components/BoltResultsTable';
import { BoltSelection } from '@/components/BoltSelection';
import {
  Button,
  Headline,
  Text,
  Anchor,
  Table,
  Badge,
  Modal,
  ModalTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@gsp/ui';

import {
  LucideFileDown,
  LucideGrid3X3,
  LucideLineChart,
  LucideMoveLeft,
} from 'lucide-react';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page(): JSX.Element {
  const [site, setSite] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [drive, setDrive] = useState<string | undefined>(undefined);
  const [position, setPosition] = useState<string | undefined>(undefined);

  const [boltResults, setBoltResults] = useState<
    BoltResultSchema[] | undefined
  >([]);

  const filterBoltResults = (
    level?: string,
    drive?: string,
    position?: string,
  ): BoltResultSchema[] | undefined => {
    return boltResults?.filter((bolt) => {
      const matchLevel = level ? bolt.level === level : true;
      const matchDrive = drive ? bolt.drive === drive : true;
      const matchPosition = position ? bolt.position === position : true;

      return matchPosition && matchDrive && matchLevel;
    });
  };

  const filteredResults = filterBoltResults(level, drive, position);

  useEffect(() => {
    // Each time site gets updated, make a request to the BE to fetch and set them as below
    site && setBoltResults(boltResultsMock);
  }, [site]);

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10 group"
      >
        <Link href="#" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
            Go back
          </Anchor>
        </Link>
      </Text>

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

        <BoltSelection
          site={site}
          level={level}
          drive={drive}
          position={position}
          onSetSite={setSite}
          onSetLevel={setLevel}
          onSetDrive={setDrive}
          onSetPosition={setPosition}
        />

        <TabsContent value="table">
          <BoltResultsTable site={site} boltResults={filteredResults} />
        </TabsContent>

        <TabsContent value="graphs">
          <Table className="ui-min-w-[1620px]" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
