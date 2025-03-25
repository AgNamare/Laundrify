import { addServiceToLaundromatService } from "../services/laundromat.service.js";
import { getLaundromatService } from "../services/laundromat.service.js"; // Adjust path as needed

export const addServiceHandler = async (req, res, next) => {
  try {
    const { laundromatId } = req.params; 
    const serviceData = {
      laundromatId,
      ...req.body, 
    };

    const updatedLaundromat = await addServiceToLaundromatService(serviceData);
    res.status(201).json(updatedLaundromat); 
  } catch (error) {
    next(error); 
  }
};

export const getLaundromatHandler = async (req, res, next) => {
  try {
    const { laundromatId } = req.params;

    const laundromat = await getLaundromatService(laundromatId);
    res.status(200).json(laundromat); // Use 200 OK for successful retrieval
  } catch (error) {
    next(error);
  }
};