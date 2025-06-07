import { Link, useParams } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { useState } from "react";
import { useGetOrder } from "../api/OrderApi";
import {
  ArrowLeft,
  MoreHorizontalIcon,
  Phone,
  MessageSquare,
  MapPin,
  Clock1,
} from "lucide-react";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { order, isLoading, isError } = useGetOrder(orderId);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (isLoading) return <p className="p-4">Loading map...</p>;
  if (isError || !order)
    return <p className="p-4 text-red-500">Failed to load order</p>;

  const laundromatCoords = order?.laundromat?.location?.coordinates;
  const deliveryCoords = order?.delivery?.deliveryLocation?.coordinates;

  const showMap = laundromatCoords && deliveryCoords;

  const origin = {
    lat: laundromatCoords[1],
    lng: laundromatCoords[0],
  };

  const destination = {
    lat: deliveryCoords[0],
    lng: deliveryCoords[1],
  };

  const laundromatIcon = {
    url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    scaledSize: new window.google.maps.Size(40, 40),
  };

  const destinationIcon = {
    url: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    scaledSize: new window.google.maps.Size(40, 40),
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2 mx-4 my-8">
        <Link to="/orders" className="text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold capitalize">Track Order</h1>
        <MoreHorizontalIcon />
      </div>

      {isLoaded && showMap && (
        <div className="relative h-[80vh]">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={origin}
            zoom={13}
            options={{ disableDefaultUI: true }}
          >
            <Marker position={origin} icon={laundromatIcon} />
            <Marker position={destination} icon={destinationIcon} />

            {!directions && (
              <DirectionsService
                options={{
                  origin,
                  destination,
                  travelMode: "DRIVING",
                }}
                callback={(res) => {
                  if (res?.status === "OK") {
                    setDirections(res);
                    const leg = res.routes[0].legs[0];
                    const durationInSeconds = leg.duration.value;
                    const arrivalTime = new Date(
                      Date.now() + durationInSeconds * 1000
                    );

                    // Format the arrival time as "hh:mm AM/PM"
                    const formattedTime = arrivalTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    setTravelTime(`Arriving at ${formattedTime}`);
                  }
                }}
              />
            )}

            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>

          <div className="absolute bottom-0 left-0 w-full z-14 bg-primary rounded-t-3xl shadow-md ">
            {/* Driver Info Box */}
            <div className="rounded-t-2xl px-4 py-3 text-sm text-white flex items-center gap-4">
              {order.driver?.img ? (
                <img
                  src={order.driver.img}
                  alt={`${order.driver.fName} ${order.driver.lName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white text-primary font-bold flex items-center justify-center">
                  {order.driver?.fName?.[0]}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-base">
                  {order.driver?.fName} {order.driver?.lName}
                </p>
                <p className="text-sm opacity-75">{order.laundromat?.name}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`tel:${order.driver?.phoneNumber}`}
                  className="flex items-center justify-center bg-white rounded-full p-2"
                >
                  <Phone size={26} className="text-primary" />
                </a>
                <a
                  href={`sms:${order.driver?.phoneNumber}`}
                  className="flex items-center justify-center bg-white rounded-full p-2"
                >
                  <MessageSquare size={26} className="text-primary" />
                </a>
              </div>
            </div>

            {/* Delivery Info Box */}
            <div className="bg-white text-textPrimary mt-[-8] rounded-t-3xl shadow-md pt-4 pb-2 px-6 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h4 className="font-medium text-textSecondary">
                    Delivery Address
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin size={20} className="text-primary" />
                    <p className="text-medium font-bold text-textPrimary">
                      {order.delivery?.deliveryLocation?.address}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-medium text-textSecondary">
                    Estimated Time
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock1 size={20} className="text-primary" />
                    <p className="text-sm font-semibold text-textPrimary">
                      {travelTime ?? "Calculating..."}
                    </p>
                  </div>
                </div>
              </div>
              <Link to={`/app/order/${orderId}`}> 
                <button className="text-white text-medium w-full p-3 bg-primary mt-4 rounded-lg text-medium">
                  See Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
