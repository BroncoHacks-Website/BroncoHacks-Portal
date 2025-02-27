export interface HackerModel {
  UUID: number;
  teamID: number | null;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  school: string;
  discord: string;
  confirmationNumber: number;
  isConfirmed: boolean;
  isAdmin: boolean;
}
