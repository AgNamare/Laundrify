import {
  getLaundromatService,
  getAllServicesForLaundromatService,
  getServiceByCategory,
  addServiceToLaundromatService,
  updateServiceByCategory,
} from "../services/laundromat.service.js"; // Adjust path as needed

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
    console.error(error)
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

export const getServiceByCategoryHandler = async (req, res, next) => {
  try {
    const { laundromatId, category } = req.params;

    const service = await getServiceByCategory(laundromatId, category);
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
};
export const updateServiceByCategoryHandler = async (req, res, next) => {
  try {
    const { laundromatId, category } = req.params;
    const serviceData = req.body;
    console.log(laundromatId, category, serviceData);
    const service = await updateServiceByCategory(
      laundromatId,
      category,
      serviceData
    );
    res.status(200).json(service);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllServicesHandler = async (req, res, next) => {
  try {
    const { laundromatId } = req.params;

    const services = await getAllServicesForLaundromatService(laundromatId);

    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};
