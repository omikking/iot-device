'use client';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { useSession } from 'next-auth/react';
import {
  Dropdown,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';

interface AdminFormProps {
  isNewCompany: boolean;
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
}

const getAdminsQuery = graphql(`
  query GetUsers($roles: [String]!) {
    users(roles: $roles) {
      id
      fullName
    }
  }
`);

export const AdminForm = ({ isNewCompany, companyForm }: AdminFormProps) => {
  const { data: session } = useSession();

  const [{ data: adminsData }] = useQuery({
    query: getAdminsQuery,
    variables: {
      roles: ['SANDVIK_ADMIN'],
    },
    pause: !session?.company?.id,
  });
  const admins =
    adminsData?.users?.map((user) => ({
      id: user.id,
      name: user.fullName,
    })) ?? [];
  // @TODO this logic might needs some modification. Having trouble when the update mutation differs with users vs userPermissions etc.
  // Leave it for now, and will be worked on later.

  return (
    <FormField
      control={companyForm.control}
      name="sandvikAdminUserId"
      render={({ field }) => {
        return (
          <FormItem className="w-96">
            <FormLabel>Assigned Sandvik administrator</FormLabel>
            <FormControl>
              <Dropdown
                id="person"
                placeholder="Select Sandvik administrator"
                selectedId={field.value}
                options={admins}
                onSelect={(e) => field.onChange(e)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
