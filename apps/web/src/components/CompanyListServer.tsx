import { getCompanies } from '../libs/getCompanies';
import { CompanyList } from './CompanyList';

export async function CompanyListServer() {
  const initialCompanies = await getCompanies();

  return <CompanyList initialCompanies={initialCompanies} />;
}
