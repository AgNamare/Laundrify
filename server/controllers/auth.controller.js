import { createUserService } from "../services/auth.service.js";
export const createUserHandler = async (req, res, next) => {
  console.log(req.body)
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
