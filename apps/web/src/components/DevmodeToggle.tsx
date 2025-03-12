'use client';
import { Text, Button, Headline } from '@gsp/ui';

type DevmodeToggleProps = {
  user: 'Superadmin' | 'Client';
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
};

export const DevmodeToggle = ({
  user,
  isAdmin,
  setIsAdmin,
}: DevmodeToggleProps) => {
  return (
    <div className="fixed opacity-10 hover:opacity-80 duration-100 ease-linear right-24 top-24 bg-slate-200 p-4 w-56">
      <Headline as="h2" variant="medium" color="foreground">
        Dev mode
      </Headline>
      <Text variant="medium" color="foreground">
        Toggle user type
      </Text>
      <Text variant="medium" color="foreground">
        Current user: {user}
      </Text>
      <Button
        variant="secondary"
        size="small"
        onClick={() => setIsAdmin(!isAdmin)}
        isWide
      >
        Set to {isAdmin ? 'Client' : 'Superadmin'}
      </Button>
    </div>
  );
};
