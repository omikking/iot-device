import { Specification } from '@gsp/ui';
import { User } from '@/gql/graphql';

type AssociateDetailsFormProps = {
  sandvikAdminUserInfo: User;
};

export const AssociateDetailsForm = ({
  sandvikAdminUserInfo,
}: AssociateDetailsFormProps) => {
  const { fullName, email, phoneNumber } = sandvikAdminUserInfo;
  return (
    <div className="flex w-full gap-12">
      {fullName && (
        <Specification title="Name" text={fullName} className="w-full" />
      )}
      {email && <Specification title="Email" text={email} className="w-full" />}
      {/* Do they want to expose the phone number? */}
      {phoneNumber && (
        <Specification title="Phone" text={phoneNumber} className="w-full" />
      )}
    </div>
  );
};
