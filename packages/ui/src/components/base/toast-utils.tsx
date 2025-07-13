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
    <Alert variant={variant} className="ui-w-full">
      <div className="ui-flex ui-w-[430px]">
        <div className="ui-flex ui-flex-col ui-flex-grow">
          <AlertTitle color={variant} variant={variant}>
            {title}
          </AlertTitle>
          <AlertDescription
            color={variant}
            variant={variant}
            className="ui-mt-1"
          >
            {description}
          </AlertDescription>
        </div>
        <Button
          type="reset"
          onClick={() => toast.dismiss(t)}
          className="ui-bg-white ui-h-fit ui-rounded-[12px] ui-p-[2px] ui-cursor-pointer"
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
