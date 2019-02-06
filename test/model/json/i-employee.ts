export interface ISkill {
  id: number;
  skill_name: string;
}

export interface IEmployee {
  id: number;
  first_name: string;
  last_name: string;
  branch_name: string;
  age: number;
  hobby?: string;
  description: { length_of_service: number, position: string, sub_position: string };
  skill_lists: ISkill[];
}