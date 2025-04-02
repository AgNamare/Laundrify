import { useParams, Link } from "react-router-dom";
import { useGetServices } from "../api/LaundromatApi";
import WashAndFoldImage from "../assets/illustrations/washAndFold.png"; // Import the image
import { Plus } from "lucide-react";

const ServiceManagementPage = () => {
  const { laundromatId } = useParams();
  const { services, isLoading: isLoadingServices } =
    useGetServices(laundromatId);

  if (isLoadingServices) return <p>Loading...</p>;

  return (
    <div className="">
      {services && services.length > 0 && (
        <div>
          <div className="p-2 my-2 border flex justify-between border-slate-200 rounded-md">
            <h1 className="text-lg font-medium ">Service Management</h1>
            <div className="hover:cursor-pointer">
              <Link
                to={`/laundromat/{laundromatId}/services/add`}
                className=" flex gap-1 justify-center items-center bg-primary text-white px-2 py-1 rounded-full"
              >
                <button>Add New Service</button>
                <Plus size={20} />
              </Link>
            </div>
          </div>
          <ul>
            {services.map((service) => (
              <li
                key={service.category}
                className="border rounded-lg border-slate-200 w-fit p-10"
              >
                {/* Show image if service is Wash & Fold */}
                {service.category === "Wash & Fold" && (
                  <img
                    src={WashAndFoldImage}
                    alt="Wash and Fold Service"
                    width={200}
                  />
                )}
                <Link
                  to={`/laundromat/${laundromatId}/services/${service.category}`}
                  className="text-center flex justify-center"
                >
                  <button className="text-white bg-primary rounded  text-xl px-2 py-1 mt-2 flex justify-center hover:cursor-pointer">
                    Update
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementPage;
