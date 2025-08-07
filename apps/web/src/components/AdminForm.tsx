'use client';
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
import { Role } from '@/gql/graphql';

type AdminFormProps = {
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
};

const getAdminsQuery = graphql(`
  query GetUsers($roles: [String]!) {
    users(roles: $roles) {
      id
      fullName
    }
  }
`);

export const AdminForm = ({ companyForm }: AdminFormProps) => {
  const { data: session } = useSession();

  const [{ data: adminsData }] = useQuery({
    query: getAdminsQuery,
    variables: {
      roles: [Role.SandvikAdmin],
    },
    pause: !session?.company?.id,
  });
  const admins =
    adminsData?.users?.map((user) => ({
      id: user.id,
      name: user.fullName,
    })) ?? [];

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
