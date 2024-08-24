'use client';
import {
  Button,
  Headline,
  Text,
  Anchor,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Modal,
  ModalTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ContentHolder,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Dropdown,
  FormControl,
  FormMessage,
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  LucideCheckCircle,
  LucideFileDown,
  LucideGrid3X3,
  LucideLineChart,
  LucideMoveLeft,
  LucideSlidersHorizontal,
} from 'lucide-react';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Page(): JSX.Element {
  const formSchema = z.object({
    site: z.string(),
    level: z.string(),
    drive: z.string(),
    position: z.string(),
  });

  // to validate the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site: '',
      level: '',
      drive: '',
      position: '',
    },
  });

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  const sites = [
    {
      id: '1',
      name: '20001',
    },
    {
      id: '2',
      name: '20023',
    },
  ];

  const boltResultsMock = [
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
      level: '4002',
      drive: '2001',
      position: '20, 42',
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
      level: '4002',
      drive: '2001',
      position: '20, 42',
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
      position: '20, 42',
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
      drive: '2001',
      position: '20, 42',
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
      drive: '2001',
      position: '20, 42',
      ring: 'RH-BACK',
      comment: 'N/A',
      result: 'Pass',
    },
  ];

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10"
      >
        <Link href="#" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft />
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

      <div className="flex flex-col gap-5">
        <Tabs defaultValue="table">
          <div className="w-full flex flex-row justify-between items-center pb-3">
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
              {/* <Modal here /> */}
            </Modal>
          </div>

          <ContentHolder variant="general">
            <Form {...form}>
              <form
                onSubmit={() => console.log('submit form')}
                className="w-full flex flex-row items-center flex-wrap gap-8"
              >
                <Button variant="primary" size="large" className="mt-8">
                  <LucideSlidersHorizontal />
                  Filter
                </Button>
                <FormField
                  control={form.control}
                  name="site"
                  render={() => {
                    return (
                      <FormItem className="mt-0.5">
                        <FormLabel>Site</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="person"
                            placeholder="Select site"
                            selectedId={dropdownValue}
                            options={sites}
                            onSelect={(e) => setDropdownValue(e)}
                            className="w-[320px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="person"
                            placeholder="Select level"
                            selectedId={dropdownValue}
                            options={sites}
                            onSelect={(e) => setDropdownValue(e)}
                            className="w-[320px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="drive"
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel>Drive</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="person"
                            placeholder="Select drive"
                            selectedId={dropdownValue}
                            options={sites}
                            onSelect={(e) => setDropdownValue(e)}
                            className="w-[320px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="person"
                            placeholder="Select position"
                            selectedId={dropdownValue}
                            options={sites}
                            onSelect={(e) => setDropdownValue(e)}
                            className="w-[320px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          </ContentHolder>

          <TabsContent value="table">
            <Table className="ui-min-w-[1620px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Bolt</TableHead>
                  <TableHead>Bolt type</TableHead>
                  <TableHead>Peak load</TableHead>
                  <TableHead className="w-[140px]">Peak displacement</TableHead>
                  <TableHead>Bit size</TableHead>
                  <TableHead>Rotations</TableHead>
                  <TableHead className="w-[120px]">
                    Displacement per tonnage
                  </TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Drive</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Ring</TableHead>
                  <TableHead>Comment</TableHead>
                  {/* text-right doesnt seem to work here widthout ! but works on the other tables? so confused */}
                  <TableHead className="!text-right w-[130px]">
                    Result
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boltResultsMock.map((boltResult) => (
                  <TableRow key={boltResult.id}>
                    <TableCell>{boltResult.boltNumber}</TableCell>
                    <TableCell>{boltResult.boltType}</TableCell>
                    <TableCell>{boltResult.peakLoad}</TableCell>
                    <TableCell>{boltResult.peakDisplacement}</TableCell>
                    <TableCell>{boltResult.bitSize}</TableCell>
                    <TableCell>{boltResult.rotations}</TableCell>
                    <TableCell>{boltResult.displacementPerTonnage}</TableCell>
                    <TableCell>{boltResult.level}</TableCell>
                    <TableCell>{boltResult.drive}</TableCell>
                    <TableCell>{boltResult.position}</TableCell>
                    <TableCell>{boltResult.ring}</TableCell>
                    <TableCell>{boltResult.comment}</TableCell>
                    <TableCell className="flex justify-end">
                      <Badge variant="success">
                        <LucideCheckCircle />
                        {boltResult.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Badge variant="neutral" className="self-start mt-5">
              {boltResultsMock.length} total
            </Badge>
          </TabsContent>

          <TabsContent value="graphs">
            <Table className="ui-min-w-[1620px]" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
