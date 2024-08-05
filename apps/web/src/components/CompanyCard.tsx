import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@gsp/ui';
import { Badge } from '@gsp/ui';

type CompanyCardProps = {
  companyName: string;
  badgeText: string;
  badgeVariant:
    | 'default'
    | 'secondary'
    | 'active'
    | 'destructive'
    | 'outline'
    | null
    | undefined;
  buttonVariant:
    | 'default'
    | 'golden'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'disabled'
    | null
    | undefined;
  buttonText: string;
  iconName: string;
};

const CompanyCard = ({
  companyName,
  badgeText,
  badgeVariant = 'default',
  buttonVariant = 'default',
  buttonText,
  iconName,
}: CompanyCardProps) => {
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType>
  )[iconName];

  return (
    <div className="w-96 border-2 border-gold-primary relative">
      <div className="absolute top-0 right-0 pt-2 pr-2">
        <Badge variant={badgeVariant}>{badgeText}</Badge>
      </div>
      <div className="flex flex-col justify-center items-center gap-sm  py-md px-lg">
        <h3>{companyName}</h3>
        <IconComponent />
        <Button variant={buttonVariant} size={'lg'}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CompanyCard;
