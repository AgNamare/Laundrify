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
import { ArrowLeft, MoreHorizontalIcon } from "lucide-react";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { order, isLoading, isError } = useGetOrder(orderId);
  const [directions, setDirections] = useState(null);

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
                  }
                }}
              />
            )}

            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>

          <div className="absolute bottom-0 left-0 w-full z-14 bg-primary rounded-t-4xl">
            {/* Laundromat Info Box */}
            <div className="bg-primary rounded-t-2xl  p-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Laundromat:</span>{" "}
                {order.laundromat?.name}
              </p>
              <p>
                <span className="font-semibold">Delivery Address:</span>{" "}
                {order.delivery?.deliveryLocation?.address}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
            </div>

            {/* Additional Box Below (bg-primary) */}
            <div className="bg-white text-textPrimary mt-[-8] rounded-t-3xl shadow-md p-4 text-sm">
              <p className="font-semibold">Thanks for using Laundrify!</p>
              <p className="text-xs text-white/80">
                Your order is being handled with care. You’ll be notified once
                it's delivered.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
