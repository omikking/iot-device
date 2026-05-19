import { useRouter, useParams } from 'next/navigation';

export const useCompanyRouter = () => {
  const router = useRouter();
  const params = useParams();
  const companyId = params.companyId as string;

  return {
    push: (path: string) => router.push(`/${companyId}${path}`),
    replace: (path: string) => router.replace(`/${companyId}${path}`),
  };
};
