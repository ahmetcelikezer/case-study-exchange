type User = {
  id: string;
  email: string;
};

export interface LoginResponseDTO {
  token: string;
  user: User;
}
