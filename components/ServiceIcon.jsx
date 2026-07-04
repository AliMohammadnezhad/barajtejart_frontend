import {
  FaBoxOpen,
  FaClock,
  FaGlobeAsia,
  FaHeadset,
  FaMapMarkedAlt,
  FaPlaneDeparture,
  FaShieldAlt,
  FaShip,
  FaTruckMoving,
  FaWeightHanging,
} from "react-icons/fa";

// نگاشت کلید آیکون در لایهٔ داده به کامپوننت react-icons
const icons = {
  globe: FaGlobeAsia,
  plane: FaPlaneDeparture,
  ship: FaShip,
  truck: FaTruckMoving,
  weight: FaWeightHanging,
  box: FaBoxOpen,
  headset: FaHeadset,
  map: FaMapMarkedAlt,
  clock: FaClock,
  shield: FaShieldAlt,
};

export default function ServiceIcon({ name, className = "" }) {
  const Icon = icons[name] ?? FaBoxOpen;
  return <Icon className={className} />;
}
