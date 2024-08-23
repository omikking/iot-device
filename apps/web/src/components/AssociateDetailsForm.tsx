import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';

export const AssociateDetailsForm = ({ companyForm }) => {
  return (
    <>
      <FormField
        control={companyForm.control}
        name="assignSandvikAdministrator"
        render={() => {
          return (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input value="Darlene Alderson" className="w-[400px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={companyForm.control}
        name="assignSandvikAdministrator"
        render={() => {
          return (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value="darlene@gmail.com" className="w-[400px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={companyForm.control}
        name="assignSandvikAdministrator"
        render={() => {
          return (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input value="+46701740621" className="w-[400px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};
