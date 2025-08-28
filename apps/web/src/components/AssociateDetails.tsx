import { Specification, Text } from '@gsp/ui';
import { User } from '@/gql/graphql';

type AssociateDetailsProps = {
  sandvikAdminUserInfo?: User;
};

export const AssociateDetails = ({
  sandvikAdminUserInfo,
}: AssociateDetailsProps) => {
  const { fullName, email, phoneNumber } = sandvikAdminUserInfo || {};
  return (
    <>
      {!sandvikAdminUserInfo && (
        <Text color="muted" variant="medium">
          No assigned Sandvik Admin yet.
        </Text>
      )}
      {sandvikAdminUserInfo && (
        <div className="flex w-full gap-12">
          {fullName && (
            <Specification title="Name" text={fullName} className="w-full" />
          )}
          {email && (
            <Specification title="Email" text={email} className="w-full" />
          )}
          {/* Do they want to expose the phone number? */}
          {phoneNumber && (
            <Specification
              title="Phone"
              text={phoneNumber}
              className="w-full"
            />
          )}
        </div>
      )}
    </>
  );
};
