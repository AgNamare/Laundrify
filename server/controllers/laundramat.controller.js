import {
  getLaundromatService,
  getAllServicesForLaundromatService,
  getServiceByCategory,
  addServiceToLaundromatService,
  updateServiceByCategory,
  getLaundromatsService,
  searchLaundromatService
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

export const getLaundromatsHandler = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const laundromats = await getLaundromatsService(limit); // Assuming you have this service function
    res.status(200).json(laundromats);
  } catch (error) {
    next(error);
    console.error(error);
  }
};

export const searchLaundromatHandler = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const laundromats = await searchLaundromatService(query); // Assuming this service exists

    res.status(200).json(laundromats);
  } catch (error) {
    next(error);
    console.error(error);
  }
};


