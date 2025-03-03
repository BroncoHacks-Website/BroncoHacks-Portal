export interface TeamModel {
  teamID: number;
  teamName: string;
  owner: number;
  teamMember1?: number;
  teamMember2?: number;
  teamMember3?: number;
  status?: "approved" | "unregistered" | "pending";
}
