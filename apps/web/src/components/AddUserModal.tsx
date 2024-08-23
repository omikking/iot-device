import {
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Headline,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Switch,
  Text,
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddUserModal = () => {
  const formSchema = z.object({
    role: z.enum(['admin', 'technician', 'user']),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    pullTestApp: z.boolean(),
    xCyclops: z.boolean(),
    ultrabots: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'user',
      pullTestApp: false,
      xCyclops: false,
      ultrabots: false,
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit form', form.getValues());
  };

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  const [hasGlobalAccess, setHasGlobalAccess] = useState(false);
  const [hasPullTestAccess, setHasPullTestAccess] = useState(false);
  const [hasXCyclopsAccess, setHasXCyclopsAccess] = useState(false);
  const [hasUltrabotsAccess, setHasUltrabotsAccess] = useState(false);

  // Need to make the handleSwitches dynamic
  const handleCheckedChange = (state: boolean) => {
    setHasGlobalAccess(state);
    setHasPullTestAccess(state);
    setHasXCyclopsAccess(state);
    setHasUltrabotsAccess(state);
  };

  const handlePullTestCheckedChange = (state: boolean) => {
    setHasPullTestAccess(state);
  };

  const handleXCyclopsCheckedChange = (state: boolean) => {
    setHasXCyclopsAccess(state);
  };

  const handleUltrabotsCheckedChange = (state: boolean) => {
    setHasUltrabotsAccess(state);
  };

  const roles = [
    {
      id: '1',
      name: 'User',
    },
    {
      id: '2',
      name: 'Technician',
    },
    {
      id: '3',
      name: 'Admin',
    },
  ];

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle className="mb-10">Add user</ModalTitle>
      </ModalHeader>
      <Form {...form}>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="px-10 flex  gap-10">
            <div className="flex flex-row flex-wrap justify-between gap-10">
              <FormField
                control={form.control}
                name="role"
                render={() => {
                  return (
                    <FormItem>
                      <FormLabel>* Role</FormLabel>
                      <FormControl>
                        <Dropdown
                          id="person"
                          placeholder="Select role"
                          selectedId={dropdownValue}
                          options={roles}
                          onSelect={(e) => setDropdownValue(e)}
                          className="w-[400px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            {/* RIGHT */}
            <div className="flex flex-col flex-grow">
              <div className="flex items-center p-4 border bg-main-white border-neutral-3">
                <div className="flex flex-grow items-center gap-2">
                  <LucideLayoutGrid size={20} />
                  <Headline color={'foreground'} as="h3" variant={'smallBold'}>
                    All apps
                  </Headline>
                </div>
                <Switch
                  checked={hasGlobalAccess}
                  onCheckedChange={handleCheckedChange}
                />
              </div>
              {/* Need to make the following dynamic */}
              <div className="flex items-center px-4 py-4 border-x border-b border-neutral-3">
                <Text
                  variant="medium"
                  color="foreground"
                  className="flex flex-grow"
                >
                  Pull Test
                </Text>
                <Switch
                  checked={hasPullTestAccess}
                  onCheckedChange={handlePullTestCheckedChange}
                />
              </div>
              <div className="flex items-center px-4 py-2 border-x border-b border-neutral-3">
                <Text
                  variant="medium"
                  color="foreground"
                  className="flex flex-grow"
                >
                  xCyclops
                </Text>
                <Switch
                  checked={hasXCyclopsAccess}
                  onCheckedChange={handleXCyclopsCheckedChange}
                />
              </div>
              <div className="flex items-center px-4 py-2 border-x border-b border-neutral-3">
                <Text
                  variant="medium"
                  color="foreground"
                  className="flex flex-grow"
                >
                  Ultrabots
                </Text>
                <Switch
                  checked={hasUltrabotsAccess}
                  onCheckedChange={handleUltrabotsCheckedChange}
                />
              </div>
            </div>
          </div>

          <ModalFooter className="px-10 pt-8 pb-6">
            <Button type="submit" size="large" variant="primary">
              <LucidePlus />
              Add user
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </ModalContent>
  );
};
