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
    <Alert variant={variant} className="ui-banshee-w-full">
      <div className="ui-banshee-flex ui-banshee-w-[430px]">
        <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-flex-grow">
          <AlertTitle color={variant} variant={variant}>
            {title}
          </AlertTitle>
          <AlertDescription
            color={variant}
            variant={variant}
            className="ui-banshee-mt-1"
          >
            {description}
          </AlertDescription>
        </div>
        <Button
          type="reset"
          onClick={() => toast.dismiss(t)}
          className="ui-banshee-bg-white ui-banshee-h-fit ui-banshee-rounded-[12px] ui-banshee-p-[2px] ui-banshee-cursor-pointer"
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
