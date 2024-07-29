import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';

export const CompanyDetailsForm = ({ companyForm }) => {
  return (
    <>
      <FormField
        control={companyForm.control}
        name="companyName"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter company name..."
                  {...field}
                  className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="fullContactName"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Full contact name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full contact name..."
                  {...field}
                  className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="organisationNumber"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Organisation number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter organisation number..."
                  {...field}
                  className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="country"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter country..."
                  {...field}
                  className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="city"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city..."
                  {...field}
                  className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="address"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter address..."
                  {...field}
                  className="w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};
