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
  const [hasGlobalAccess, setHasGlobalAccess] = useState(false);
  const [hasPullTestAccess, setHasPullTestAccess] = useState(false);
  const [hasXCyclopsAccess, setHasXCyclopsAccess] = useState(false);
  const [hasUltrabotsAccess, setHasUltrabotsAccess] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string | undefined>('');

  const formSchema = z.object({
    role: z.enum(['admin', 'technician', 'user']),
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),

    globalAccess: z.string().transform((val) => val === 'true'),
    pullTestApp: z.boolean(),
    xCyclops: z.boolean(),
    ultrabots: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      // role: 'user',
      fullName: '',
      email: '',
      phoneNumber: '',
      globalAccess: false,
      pullTestApp: false,
      xCyclops: false,
      ultrabots: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (dropdownValue && dropdownValue.length > 0) {
      form.setValue('role', dropdownValue as 'admin' | 'technician' | 'user');
    }
    console.log('11111');
    console.log(values);
  }

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

  const getRoleById = (id: string) => {
    // setDropdownValue(roles.find((role) => role.id === id)?.name);
    return roles.find((role) => role.id === id)?.name;
  };

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle className="mb-10">Add user</ModalTitle>
      </ModalHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <form onSubmit={form.handleSubmit((e) => handleToggleSwitch(e))}> */}
          <div className="px-10 flex gap-10">
            <div className="flex flex-row flex-wrap justify-between gap-10">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Role</FormLabel>
                      <FormControl>
                        <Dropdown
                          id="role"
                          placeholder="Select role"
                          selectedId={dropdownValue}
                          {...field}
                          options={roles}
                          className="w-[400px]"
                          onSelect={(e) => {
                            field.onChange(getRoleById(e)?.toLowerCase());
                            // logging values
                            console.log('HELLOOOO', getRoleById(e));
                            console.log('Dropdown value: ', dropdownValue);
                          }}
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
                <FormField
                  control={form.control}
                  name="globalAccess"
                  render={({ field }) => {
                    console.log('FIELD, ', field);
                    return (
                      <FormItem>
                        <FormLabel>* FOO</FormLabel>
                        <FormControl>
                          <Switch
                            checked={hasGlobalAccess}
                            onCheckedChange={field.onChange}
                            {...field}
                            value={field.value.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                        {/* <Input
                          placeholder="Full name"
                          {...field}
                          className="w-full"
                        /> */}
                      </FormItem>
                    );
                  }}
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
