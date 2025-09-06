import { User } from "../models/user.model";

export const findByIdUserService = async (userId: string) => {
  const user = await User.findById(userId);
  return user?.omitPassword();
};
