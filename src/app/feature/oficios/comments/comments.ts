import { User } from "../../personal/usuarios/usuario";

export interface Comments {
  id: number;
  comment: string;
  created_by: User;
  created_at: Date;
  updated_at: Date;
}
  