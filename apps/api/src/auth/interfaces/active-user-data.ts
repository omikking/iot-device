export interface ActiveUserData {
  id: string;
  email: string;
  fullName: string | null;
  companies:
    | {
        id: string;
        name: string;
      }[]
    | null;
}
