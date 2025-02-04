import { graphql } from '@/gql';

// @TODO a file that holds the queries
// Trying to export a query that is not defined in the file will result in a compilation error

export const GET_COMPANY = graphql(`
  query getMeCompany($id: String!) {
    company(id: $id) {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
    }
  }
`);

export const GET_COMPANIES = graphql(`
  query getMeCompanies {
    companies {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
    }
  }
`);
