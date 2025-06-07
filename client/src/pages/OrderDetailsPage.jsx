import {
  ArrowLeft,
  MoreHorizontalIcon,
  ArchiveIcon,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TshirtIcon from "../assets/illustrations/Clothes.svg";
import DryingIcon from "../assets/illustrations/Drying.svg";
import { useGetOrder } from "../api/OrderApi";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";
import { useChat } from "../api/ChatsApi";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { order, isLoading, isError } = useGetOrder(orderId);
  const [directions, setDirections] = useState(null);
  const navigate = useNavigate();

  const status = order?.status?.toLowerCase();
  const isPending = status === "pending" || order?.paymentStatus === "Pending";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { data: chatData, refetch: refetchChat, isFetching: isChatFetching } = useChat({
    senderId: order?.user?._id,
    receiverId: order?.laundromat?.admin?._id,
    laundromatId: order?.laundromat?._id,
  });

  console.log(order)

  const handleChatClick = async () => {
    try {
      const { data } = await refetchChat(); // Use the refetch to trigger manually
      if (data?._id) {
        navigate(`/app/chat/${data._id}`);
      } else {
        console.error("Chat ID not found in response");
      }
    } catch (err) {
      console.error("Failed to initiate chat", err);
    }
  };

  let etaMessage = "";
  if (order?.estimatedDeliveryTime) {
    const estimatedTime = new Date(order.estimatedDeliveryTime);
    const now = new Date();
    const timeDiffMs = estimatedTime - now;

    if (timeDiffMs > 0) {
      const timeDiffHours = Math.floor(timeDiffMs / (1000 * 60 * 60));
      const timeDiffDays = Math.floor(timeDiffHours / 24);

      etaMessage = timeDiffDays >= 1
        ? `Arrives in ${timeDiffDays} day${timeDiffDays > 1 ? "s" : ""}`
        : `Arrives in ${timeDiffHours} hour${timeDiffHours > 1 ? "s" : ""}`;
    } else {
      etaMessage = "Arriving soon";
    }
  }

  let statusIcon = null;
  let statusMessage = "";
  if (status === "washing") {
    statusIcon = (
      <img src={TshirtIcon} alt="Washing" className="w-32 h-32 bg-gray-100 p-4 rounded-full" />
    );
    statusMessage = "Your clothes are still being washed. They will be finished soon.";
  } else if (status === "drying") {
    statusIcon = (
      <img src={DryingIcon} alt="Drying" className="w-36 h-36 bg-gray-100 p-4 rounded-full" />
    );
    statusMessage = "Your clothes are still in drying. Will be delivered soon.";
  } else if (status === "folding") {
    statusIcon = (
      <div className="bg-gray-100 p-8 rounded-full">
        <ArchiveIcon className="w-20 h-20 text-primary" />
      </div>
    );
    statusMessage = "Your clothes are being folded. Almost ready!";
  }

  if (isLoading) return <div className="p-4">Loading order...</div>;
  if (isError || !order) return <div className="p-4 text-red-500">Failed to load order</div>;

  const laundromatCoords = order?.laundromat?.location?.coordinates;
  const deliveryCoords = order?.delivery?.deliveryLocation?.coordinates;

  const showMap = status === "delivering" && laundromatCoords && deliveryCoords;

  const origin = laundromatCoords ? { lat: laundromatCoords[1], lng: laundromatCoords[0] } : null;
  const destination = deliveryCoords ? { lat: deliveryCoords[1], lng: deliveryCoords[0] } : null;

  const laundromatIcon = {
    url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    scaledSize: new window.google.maps.Size(40, 40),
  };

  const destinationIcon = {
    url: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    scaledSize: new window.google.maps.Size(40, 40),
  };

  const mapOptions = {
    disableDefaultUI: true,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Link to="/orders" className="text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-semibold capitalize">Order Details</h1>
        <MoreHorizontalIcon />
      </div>

      {status !== "delivering" && statusIcon && (
        <div className="h-full w-full flex flex-col items-center px-4 py-2 rounded-full">
          {statusIcon}
          <h3 className="text-center p-4 text-textPrimary text-medium">
            {statusMessage}
          </h3>
        </div>
      )}

      <OrderStatusTimeline status={order.status.toLowerCase()} />

      <div className="bg-white rounded-lg py-4 space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{order._id}</p>
          <span className={`px-3 py-1 rounded-full text-sm text-white capitalize ${isPending ? "bg-yellow-400" : "bg-green-400"}`}>
            {isPending ? "On Going" : "Completed"}
          </span>
        </div>

        <div>
          <p className="text-slate-400 opacity-95">
            {new Date(order.placedAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 flex justify-between items-center">
            Laundromat
            <span className="font-medium flex items-center gap-2">
              {order.laundromat?.name}
              <button
                onClick={handleChatClick}
                disabled={isChatFetching}
                className="text-primary hover:text-primary/80"
                title="Chat with Laundromat"
              >
                <MessageCircle size={20} />
              </button>
            </span>
          </p>

          <p className="text-sm text-gray-600 flex justify-between">
            Service Type: <span className="font-medium capitalize">{order.serviceType || "N/A"}</span>
          </p>
          <p className="text-sm text-gray-600 flex justify-between">
            Total: <span className="font-medium">Ksh {order.totalPrice}</span>
          </p>
          <p className="text-sm text-gray-600 flex justify-between">
            Delivery Address: <span className="font-medium">{order.delivery?.deliveryLocation?.address || "N/A"}</span>
          </p>
          {etaMessage && (
            <p className="text-sm text-gray-600 flex justify-between">
              Estimated Time: <span className="font-medium">{etaMessage}</span>
            </p>
          )}
        </div>

        {order.clothes?.length > 0 && (
          <div className="pt-4">
            <h3 className="font-semibold text-lg">Clothes</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {order.clothes.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.type}</span>
                  <span className="font-medium">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isLoaded && showMap && (
        <div className="mt-6">
          <GoogleMap
            mapContainerStyle={{ height: "300px", width: "100%", borderRadius: "12px" }}
            center={{ lat: laundromatCoords[1], lng: laundromatCoords[0] }}
            zoom={13}
            options={mapOptions}
          >
            <Marker position={origin} icon={laundromatIcon} />
            <Marker position={destination} icon={destinationIcon} />
            {!directions && (
              <DirectionsService
                options={{
                  origin: origin,
                  destination: destination,
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

          <div className="text-center w-full mt-8">
            <button
              onClick={() => navigate(`/app/order/track/${order._id}`)}
              className="bg-primary text-white w-full py-3 rounded-xl font-semibold shadow"
            >
              Track Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
