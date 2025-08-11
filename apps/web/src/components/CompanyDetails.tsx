import { ContentHolder, Specification } from '@gsp/ui';
import { Company } from '@/gql/graphql';

type CompanyDetailsProps = {
  company: Company;
};

export const CompanyDetails = ({ company }: CompanyDetailsProps) => {
  const {
    name,
    companyContactEmail,
    orgNumber,
    address,
    postalCode,
    city,
    country,
  } = company || {};
  return (
    <ContentHolder variant="general" headlineText="Company details">
      <div className="flex w-full gap-12">
        <Specification title="Company name" text={name} className="w-full" />
        <Specification
          title="Email"
          text={companyContactEmail}
          className="w-full"
        />
        <Specification
          title="Organisation number"
          text={orgNumber}
          className="w-full"
        />
      </div>

      <div className="flex w-full gap-12">
        <Specification title="Country" text={country} className="w-full" />
        <Specification title="City" text={city} className="w-full" />
        <Specification title="Address" text={address} className="w-full" />
      </div>

      <div className="flex w-full gap-12">
        <Specification
          title="Postal code"
          text={postalCode}
          className="w-[calc(33%-28px)]"
        />
      </div>
    </ContentHolder>
  );
};
