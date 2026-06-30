'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { Role } from '@/gql/graphql';
import {
  Headline,
  Text,
  Dropdown,
  DropdownItem,
  LoadingSpinner,
  Label,
} from '@gsp/ui';
import { LucideLineChart, LucideZap } from 'lucide-react';
import { GoBack } from '@/components/GoBack';

const getOpticboltTestResultsQuery = graphql(`
  query GetOpticboltTestResults {
    opticboltTestResults {
      id
      serialNumber
      boltType
      testedAt
    }
  }
`);

const getOpticboltSpectrumsBySerialNumberQuery = graphql(`
  query GetOpticboltSpectrumsBySerialNumber($serialNumber: String!) {
    opticboltSpectrumsBySerialNumber(serialNumber: $serialNumber) {
      id
      fbgIndex
      calibrationFactor
      strain20
      strain100
    }
  }
`);

export default function Page(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not SandvikAdmin
  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.globalRole !== Role.SandvikAdmin
    ) {
      router.push('/404');
    }
  }, [session, router]);

  // Query all available opticbolt test results to populate dropdown
  const [{ data: resultsData, fetching: fetchingResults }] = useQuery({
    query: getOpticboltTestResultsQuery,
  });

  const [selectedSerialNumber, setSelectedSerialNumber] = useState<string | undefined>();

  // Query specific spectrum records when a serial number is selected
  const [{ data: spectrumsData, fetching: fetchingSpectrums }] = useQuery({
    query: getOpticboltSpectrumsBySerialNumberQuery,
    variables: { serialNumber: selectedSerialNumber || '' },
    pause: !selectedSerialNumber,
  });

  // Extract unique serial numbers to show only distinct values in the dropdown
  const allResults = resultsData?.opticboltTestResults || [];
  const uniqueSerialNumbers = Array.from(
    new Set(allResults.map((r) => r.serialNumber))
  ).sort();

  const dropdownOptions: DropdownItem[] = uniqueSerialNumbers.map((sn) => ({
    id: sn,
    name: sn,
  }));

  const selectedResult = allResults.find((r) => r.serialNumber === selectedSerialNumber);
  const spectrums = spectrumsData?.opticboltSpectrumsBySerialNumber || [];
  const firstSpectrum = spectrums[0];

  if (
    status === 'authenticated' &&
    session?.user?.globalRole === Role.SandvikAdmin
  ) {
    return (
      <main className="min-h-[calc(100vh-64px)] max-w-[1320px] w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white relative">
        <GoBack />

        <div className="absolute top-28 right-10 text-right">
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider block font-sandvik-text">
            Must work offline
          </span>
          <span className="text-xs text-neutral-5 block font-sandvik-text">
            upon data sync
          </span>
        </div>

        <Headline as="h1" variant="xl" color="foreground" className="font-sandvik-headline">
          Opticbolt Testing
        </Headline>

        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Dropdown and Parameters Pane */}
          <div className="lg:col-span-1 bg-neutral-1 p-6 rounded border border-neutral-3 flex flex-col gap-6 shadow-custom w-full font-sandvik-text">
            <div>
              <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider mb-2 block font-sandvik-text">
                Serial number dropdown
              </Label>
              <Dropdown
                id="serialNumber"
                placeholder="Select SN"
                selectedId={selectedSerialNumber}
                options={dropdownOptions}
                onSelect={setSelectedSerialNumber}
                className="w-full font-sandvik-text"
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-3 pt-4">
              <div>
                <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider font-sandvik-text">
                  Bolt type
                </Label>
                <div className="mt-1 flex items-center h-12 w-full border border-neutral-3 bg-main-white px-4 rounded  font-sandvik-text text-main-black font-medium">
                  {fetchingResults ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin text-neutral-4" />
                  ) : (
                    selectedResult?.boltType || '-'
                  )}
                </div>
              </div>

              <div>
                <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider font-sandvik-text">
                  FBG number
                </Label>
                <div className="mt-1 flex items-center h-12 w-full border border-neutral-3 bg-main-white px-4 rounded font-sandvik-text text-main-black font-medium">
                  {fetchingSpectrums ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin text-neutral-4" />
                  ) : (
                    firstSpectrum?.fbgIndex !== undefined ? firstSpectrum.fbgIndex : '-'
                  )}
                </div>
              </div>

              <div>
                <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider font-sandvik-text">
                  Test date
                </Label>
                <div className="mt-1 flex items-center h-12 w-full border border-neutral-3 bg-main-white px-4 rounded  font-sandvik-text text-main-black font-medium">
                  {fetchingResults ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin text-neutral-4" />
                  ) : (
                    selectedResult?.testedAt ? new Date(selectedResult.testedAt).toLocaleDateString() : '-'
                  )}
                </div>
              </div>

              <div>
                <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider font-sandvik-text">
                  Calculated parameter 1
                </Label>
                <div className="mt-1 flex items-center h-12 w-full border border-neutral-3 bg-main-white px-4 rounded  font-sandvik-text text-main-black font-medium">
                  {fetchingSpectrums ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin text-neutral-4" />
                  ) : firstSpectrum?.calibrationFactor !== undefined && firstSpectrum?.calibrationFactor !== null ? (
                    `Calibration Factor: ${firstSpectrum.calibrationFactor}`
                  ) : (
                    '-'
                  )}
                </div>
              </div>

              <div>
                <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider font-sandvik-text">
                  Calculated parameter 2
                </Label>
                <div className="mt-1 flex items-center h-12 w-full border border-neutral-3 bg-main-white px-4 rounded  font-sandvik-text text-main-black font-medium">
                  {fetchingSpectrums ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin text-neutral-4" />
                  ) : firstSpectrum?.strain20 !== undefined && firstSpectrum?.strain20 !== null ? (
                    `Strain @ 20 PSI: ${firstSpectrum.strain20}`
                  ) : (
                    '-'
                  )}
                </div>
              </div>

              <div>
                <Label variant="xs" className="uppercase font-bold text-neutral-5 tracking-wider font-sandvik-text">
                  Calculated parameter 3
                </Label>
                <div className="mt-1 flex items-center h-12 w-full border border-neutral-3 bg-main-white px-4 rounded  font-sandvik-text text-main-black font-medium">
                  {fetchingSpectrums ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin text-neutral-4" />
                  ) : firstSpectrum?.strain100 !== undefined && firstSpectrum?.strain100 !== null ? (
                    `Strain @ 100 PSI: ${firstSpectrum.strain100}`
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
          </div>

            {/* Right Column: Graphs Panel */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spectrum 1 Graph Card */}
              <div className="bg-main-white p-6 rounded-lg border border-neutral-3 flex flex-col shadow-sm">
                <Headline as="h3" variant="medium" color="foreground" className="mb-4 font-bold border-b pb-2">
                  Spectrum 1
                </Headline>
                <div className="flex-1 min-h-[220px] bg-neutral-1 border border-dashed border-neutral-3 rounded flex flex-col justify-center items-center gap-2 p-6 text-neutral-5">
                  <LucideLineChart className="w-12 h-12 stroke-[1.5] text-neutral-4" />
                  <Text variant="medium" color="foreground" className="text-center font-medium">Spectrum 1 Graph Space</Text>
                  <Text variant="small" color="muted" className="text-center text-xs">Awaiting data visualization integration</Text>
                </div>
              </div>

              {/* Spectrum 2 Graph Card */}
              <div className="bg-main-white p-6 rounded-lg border border-neutral-3 flex flex-col shadow-sm">
                <Headline as="h3" variant="medium" color="foreground" className="mb-4 font-bold border-b pb-2">
                  Spectrum 2
                </Headline>
                <div className="flex-1 min-h-[220px] bg-neutral-1 border border-dashed border-neutral-3 rounded flex flex-col justify-center items-center gap-2 p-6 text-neutral-5">
                  <LucideLineChart className="w-12 h-12 stroke-[1.5] text-neutral-4" />
                  <Text variant="medium" color="foreground" className="text-center font-medium">Spectrum 2 Graph Space</Text>
                  <Text variant="small" color="muted" className="text-center text-xs">Awaiting data visualization integration</Text>
                </div>
              </div>

              {/* Time vs wavelength Graph Card */}
              <div className="bg-main-white p-6 rounded-lg border border-neutral-3 flex flex-col shadow-sm">
                <Headline as="h3" variant="medium" color="foreground" className="mb-4 font-bold border-b pb-2">
                  Time vs wavelength
                </Headline>
                <div className="flex-1 min-h-[220px] bg-neutral-1 border border-dashed border-neutral-3 rounded flex flex-col justify-center items-center gap-2 p-6 text-neutral-5">
                  <LucideLineChart className="w-12 h-12 stroke-[1.5] text-neutral-4" />
                  <Text variant="medium" color="foreground" className="text-center font-medium">Time vs Wavelength Graph Space</Text>
                  <Text variant="small" color="muted" className="text-center text-xs">Awaiting data visualization integration</Text>
                </div>
              </div>

              {/* strain vs Load Graph Card */}
              <div className="bg-main-white p-6 rounded-lg border border-neutral-3 flex flex-col shadow-sm">
                <Headline as="h3" variant="medium" color="foreground" className="mb-4 font-bold border-b pb-2">
                  strain vs Load
                </Headline>
                <div className="flex-1 min-h-[220px] bg-neutral-1 border border-dashed border-neutral-3 rounded flex flex-col justify-center items-center gap-2 p-6 text-neutral-5">
                  <LucideLineChart className="w-12 h-12 stroke-[1.5] text-neutral-4" />
                  <Text variant="medium" color="foreground" className="text-center font-medium">Strain vs Load Graph Space</Text>
                  <Text variant="small" color="muted" className="text-center text-xs">Awaiting data visualization integration</Text>
                </div>
              </div>
            </div>
          </div>
        </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex justify-center items-center bg-neutral-1">
      <LoadingSpinner className="animate-spin" />
    </main>
  );
}
 