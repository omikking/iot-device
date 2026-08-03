import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertTitle, AlertDescription } from './alert';

const showAlertToast = ({
  title,
  description,
  variant = 'success',
}: {
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'error' | 'warning';
}) => {
  toast.custom((t) => (
    <Alert variant={variant} className="ds-w-full">
      <div className="ds-flex ds-w-[430px]">
        <div className="ds-flex ds-flex-col ds-flex-grow">
          <AlertTitle color={variant} variant={variant}>
            {title}
          </AlertTitle>
          <AlertDescription
            color={variant}
            variant={variant}
            className="ds-mt-1"
          >
            {description}
          </AlertDescription>
        </div>
        <Button
          type="reset"
          onClick={() => toast.dismiss(t)}
          className="ds-bg-white ds-h-fit ds-rounded-[12px] ds-p-[2px] ds-cursor-pointer"
          variant={null}
          size={null}
        >
          <X size={16} />
        </Button>
      </div>
    </Alert>
  ));
};

export { showAlertToast };
