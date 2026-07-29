export interface ProceqConfig {
  clientId: string;
  clientSecret: string;
  managementDomain: string;
  regionalDomain: string;
  accessTokenUri: string;
  authorizationUri: string;
  redirectUri: string;
  scopes: string[];
}
