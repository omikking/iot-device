'use client';

import {
  CompanyFormValues,
  companyFormSchema,
} from '@/components/schemas/CompanyFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type IPlan = {
  id: string;
  companyId: string;
  applicationName: string;
  // planLevel: string;
  planLevel: 'GOLD' | 'SILVER' | 'BRONZE' | undefined;
  expiringDate: string;
};

type ICompany = {
  id: string;
  name: string;
  orgNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  companyContactEmail: string;
  plans: IPlan[];
  // users: IUser[];
  // sites: ISite[];
};

type CompanyFormProps = {
  company?: ICompany;
  isAdmin: boolean;
  mode: 'new' | 'edit';
};

export function CompanyForm({ company, isAdmin, mode }: CompanyFormProps) {
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: company
      ? {
          name: 'E-corp',
          companyContactEmail: 'Phillip Price',
          orgNumber: '133742',
          country: 'Sweden',
          city: 'Gothenburg',
          address: 'Vasa Gatan 32',
          pullTestPlan: '',
          xCyclopsPlan: '',
          ultraboltsPlan: '',
          plans: [],
        }
      : {
          name: '',
          companyContactEmail: '',
          orgNumber: '',
          country: '',
          city: '',
          address: '',
          pullTestPlan: '',
          xCyclopsPlan: '',
          ultraboltsPlan: '',
          plans: [], // Initialize empty array for the plans
          // assignSandvikAdministrator: '',
        },
  });

  return (
    <Form {...companyForm}>
      <form onSubmit={companyForm.handleSubmit((data) => console.log(data))}>
        <CompanyDetailsForm companyForm={companyForm} />
        {/* ... other form sections */}
        <SubmitButton mode={mode} />
      </form>
    </Form>
  );
}
