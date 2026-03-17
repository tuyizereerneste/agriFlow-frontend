import React, { useState } from "react";
import { Plus, Minus, MapPin } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { format } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Child {
  name: string;
  dob: string;
  gender: "Male" | "Female";
}

interface LandLocation {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  latitude: number;
  longitude: number;
}

interface Land {
  upi: string;
  size: number;
  ownership: "Owned" | "Rented" | "Borrowed" | "Other";
  crops: string[];
  nearby: string[];
  location: LandLocation;
  image?: string;
}

interface FarmerFormData {
  farmer: {
    names: string;
    phones: string[];
    dob: string;
    gender: "Male" | "Female";
  };
  location: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
  partner?: {
    name: string;
    phones: string[];
    dob: string;
    gender: "Male" | "Female";
  };
  children: Child[];
  lands: Land[];
}

const initialFormData: FarmerFormData = {
  farmer: {
    names: "",
    phones: [""],
    dob: "",
    gender: "Male",
  },
  location: {
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  },
  children: [],
  lands: [],
};

const AddFarmerForm: React.FC = () => {
  const [formData, setFormData] = useState<FarmerFormData>(initialFormData);
  const [hasPartner, setHasPartner] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFarmerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      farmer: {
        ...prev.farmer,
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handlePartnerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      partner: {
        ...prev.partner!,
        [name]: value,
      },
    }));
  };

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, { name: "", dob: "", gender: "Male" }],
    }));
  };

  const removeChild = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const handleChildChange = (
    index: number,
    field: keyof Child,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child,
      ),
    }));
  };

  const addLand = () => {
    setFormData((prev) => ({
      ...prev,
      lands: [
        ...prev.lands,
        {
          upi: "",
          size: 0,
          ownership: "Owned",
          crops: [],
          nearby: [],
          location: {
            province: "",
            district: "",
            sector: "",
            cell: "",
            village: "",
            latitude: 0,
            longitude: 0,
          },
        },
      ],
    }));
  };

  const removeLand = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lands: prev.lands.filter((_, i) => i !== index),
    }));
  };

  const handleLandChange = (index: number, field: keyof Land, value: any) => {
    setFormData((prev) => ({
      ...prev,
      lands: prev.lands.map((land, i) =>
        i === index ? { ...land, [field]: value } : land,
      ),
    }));
  };

  const handleLandLocationChange = (
    index: number,
    field: keyof LandLocation,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      lands: prev.lands.map((land, i) =>
        i === index
          ? { ...land, location: { ...land.location, [field]: value } }
          : land,
      ),
    }));
  };

  const getLocation = async (landIndex: number) => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          },
        );

        handleLandLocationChange(
          landIndex,
          "latitude",
          position.coords.latitude,
        );
        handleLandLocationChange(
          landIndex,
          "longitude",
          position.coords.longitude,
        );
      } catch (error) {
        alert("Error getting location. Please try again.");
      }
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const validateForm = () => {
  // Check farmer names
  if (!formData.farmer.names.trim()) {
    alert("Farmer names are required.");
    return false;
  }

  // Check farmer phone numbers
  if (!formData.farmer.phones.every(phone => /^\+250\d{9}$/.test(phone))) {
    alert("Invalid phone number format. Use +250 followed by 9 digits (e.g., +250781234567).");
    return false;
  }

  // Check farmer date of birth
  if (!formData.farmer.dob) {
    alert("Farmer date of birth is required.");
    return false;
  }

  // Check location fields (at least one is required)
  if (!formData.location.province || !formData.location.district || !formData.location.sector || !formData.location.cell || !formData.location.village) {
    alert("All location fields (province, district, sector, cell, village) are required.");
    return false;
  }

  // Check partner if hasPartner is true
  if (hasPartner && formData.partner) {
    if (!formData.partner.name.trim()) {
      alert("Partner name is required.");
      return false;
    }
    if (!formData.partner.phones.every(phone => /^\+250\d{9}$/.test(phone))) {
      alert("Invalid partner phone number format. Use +250 followed by 9 digits.");
      return false;
    }
    if (!formData.partner.dob) {
      alert("Partner date of birth is required.");
      return false;
    }
  }

  // Check children (if any)
  for (const child of formData.children) {
    if (!child.name.trim() || !child.dob || !child.gender) {
      alert("All child fields (name, date of birth, gender) are required.");
      return false;
    }
  }

  // Check lands (if any)
  for (const land of formData.lands) {
    if (!land.size || land.size <= 0) {
      alert("Land size must be a positive number.");
      return false;
    }
    if (!["Owned", "Rented", "Borrowed", "Other"].includes(land.ownership)) {
      alert("Land ownership must be Owned, Rented, Borrowed, or Other.");
      return false;
    }
    if (!land.location.province || !land.location.district || !land.location.sector || !land.location.cell || !land.location.village) {
      alert("All land location fields are required.");
      return false;
    }
    if (land.crops.length === 0) {
      alert("At least one crop is required for each land.");
      return false;
    }
    if (land.nearby.length === 0) {
      alert("At least one nearby feature is required for each land.");
      return false;
    }
  }

  return true;
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to register a farmer");
    return;
  }

  // Prepare the payload: omit empty arrays and undefined fields
  const submitData = {
    farmer: formData.farmer,
    location: formData.location,
    ...(hasPartner ? { partner: formData.partner } : {}),
    ...(formData.children.length > 0 ? { children: formData.children } : {}),
    ...(formData.lands.length > 0 ? { lands: formData.lands } : {}),
  };

  console.log("Submitting data:", submitData);

  try {
    setLoading(true);
    const response = await axios.post(
      "https://agriflow-backend-cw6m.onrender.com/api/farmer/create-farmer",
      submitData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    setFormData(initialFormData);
    setHasPartner(false);
    navigate(-1);
  } catch (error) {
    console.error("Error details:", error);
    alert("Error registering farmer. Please check the console for details.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Farmer Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Farmer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Names"
            name="names"
            value={formData.farmer.names}
            onChange={handleFarmerChange}
            required
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            max={format(new Date(), "yyyy-MM-dd")}
            value={formData.farmer.dob}
            onChange={handleFarmerChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.farmer.gender}
              onChange={handleFarmerChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex items-center mb-4">
            <span className="inline-block px-2 py-1 bg-gray-200 rounded-l-md text-gray-700">
              +250
            </span>
            <input
              type="tel"
              value={formData.farmer.phones[0].replace(/^\+250/, "")}
              onChange={(e) => {
                const rest = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  farmer: {
                    ...prev.farmer,
                    phones: [`+250${rest}`],
                  },
                }));
              }}
              className="flex-1 border rounded-r-md px-2 py-1"
              placeholder="78XXXXXXX"
              maxLength={9}
              required
            />
          </div>
          <Input
            label="Province"
            name="province"
            value={formData.location.province}
            onChange={handleLocationChange}
            required
          />
          <Input
            label="District"
            name="district"
            value={formData.location.district}
            onChange={handleLocationChange}
            required
          />
          <Input
            label="Sector"
            name="sector"
            value={formData.location.sector}
            onChange={handleLocationChange}
            required
          />
          <Input
            label="Cell"
            name="cell"
            value={formData.location.cell}
            onChange={handleLocationChange}
            required
          />
          <Input
            label="Village"
            name="village"
            value={formData.location.village}
            onChange={handleLocationChange}
            required
          />
        </div>
      </div>

      {/* Partner Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Partner Details</h2>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasPartner}
              onChange={(e) => {
                setHasPartner(e.target.checked);
                if (!e.target.checked) {
                  setFormData((prev) => ({ ...prev, partner: undefined }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    partner: {
                      name: "",
                      phones: [""],
                      dob: "",
                      gender: "Female",
                    },
                  }));
                }
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Has partner</span>
          </label>
        </div>

        {hasPartner && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Partner's Name"
              name="name"
              value={formData.partner?.name || ""}
              onChange={handlePartnerChange}
              required
            />
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              max={format(new Date(), "yyyy-MM-dd")}
              value={formData.partner?.dob || ""}
              onChange={handlePartnerChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.partner?.gender || "Female"}
                onChange={handlePartnerChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex items-center mb-4">
              <span className="inline-block px-2 py-1 bg-gray-200 rounded-l-md text-gray-700">
                +250
              </span>
              <input
                type="tel"
                value={formData.partner?.phones[0]?.replace(/^\+250/, "") || ""} // remove prefix for typing
                onChange={(e) => {
                  const rest = e.target.value.replace(/\D/g, ""); // only digits
                  setFormData((prev) => ({
                    ...prev,
                    partner: {
                      ...prev.partner!,
                      phones: [`+250${rest}`], // prepend +250
                    },
                  }));
                }}
                className="flex-1 border rounded-r-md px-2 py-1"
                placeholder="78XXXXXXX"
                maxLength={9}
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Children</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addChild}
            leftIcon={<Plus size={16} />}
          >
            Add Child
          </Button>
        </div>

        {formData.children.map((child, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Child {index + 1}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeChild(index)}
                leftIcon={<Minus size={16} />}
              >
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                value={child.name}
                onChange={(e) =>
                  handleChildChange(index, "name", e.target.value)
                }
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                max={format(new Date(), "yyyy-MM-dd")}
                value={child.dob}
                onChange={(e) =>
                  handleChildChange(index, "dob", e.target.value)
                }
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={child.gender}
                  onChange={(e) =>
                    handleChildChange(
                      index,
                      "gender",
                      e.target.value as "Male" | "Female",
                    )
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lands */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Lands</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLand}
            leftIcon={<Plus size={16} />}
          >
            Add Land
          </Button>
        </div>

        {formData.lands.map((land, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Land {index + 1}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeLand(index)}
                leftIcon={<Minus size={16} />}
              >
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="UPI"
                type="text"
                value={land.upi}
                onChange={(e) => handleLandChange(index, "upi", e.target.value)}
                required
              />
              <Input
                label="Size (in square meters)"
                type="number"
                value={land.size === 0 ? "" : land.size}
                onChange={(e) => {
                  const val = e.target.value;
                  handleLandChange(index, "size", val === "" ? 0 : Number(val));
                }}
                placeholder="Enter size"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ownership
                </label>
                <select
                  value={land.ownership}
                  onChange={(e) => handleLandChange(index, "ownership", e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Other">Other</option>
                </select>

              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Province"
                  type="text"
                  value={land.location.province}
                  onChange={(e) =>
                    handleLandLocationChange(index, "province", e.target.value)
                  }
                  required
                />
                <Input
                  label="District"
                  type="text"
                  value={land.location.district}
                  onChange={(e) =>
                    handleLandLocationChange(index, "district", e.target.value)
                  }
                  required
                />
                <Input
                  label="Sector"
                  type="text"
                  value={land.location.sector}
                  onChange={(e) =>
                    handleLandLocationChange(index, "sector", e.target.value)
                  }
                  required
                />
                <Input
                  label="Cell"
                  type="text"
                  value={land.location.cell}
                  onChange={(e) =>
                    handleLandLocationChange(index, "cell", e.target.value)
                  }
                  required
                />
                <Input
                  label="Village"
                  type="text"
                  value={land.location.village}
                  onChange={(e) =>
                    handleLandLocationChange(index, "village", e.target.value)
                  }
                  required
                />
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  value={land.location.latitude}
                  onChange={(e) =>
                    handleLandLocationChange(
                      index,
                      "latitude",
                      Number(e.target.value),
                    )
                  }
                  required
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  value={land.location.longitude}
                  onChange={(e) =>
                    handleLandLocationChange(
                      index,
                      "longitude",
                      Number(e.target.value),
                    )
                  }
                  required
                />
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => getLocation(index)}
                    leftIcon={<MapPin size={16} />}
                    className="w-full"
                  >
                    Get Current Location
                  </Button>
                </div>
              </div>
              <Input
                label="Crops (comma-separated)"
                value={land.crops.join(", ")}
                onChange={(e) =>
                  handleLandChange(
                    index,
                    "crops",
                    e.target.value.split(",").map((crop) => crop.trim()),
                  )
                }
                placeholder="e.g., Maize, Beans, Rice"
                required
              />
              <Input
                label="Nearby Features (comma-separated)"
                value={land.nearby.join(", ")}
                onChange={(e) =>
                  handleLandChange(
                    index,
                    "nearby",
                    e.target.value.split(",").map((feature) => feature.trim()),
                  )
                }
                placeholder="e.g., Lake, River, Road"
                required
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className={`w-full md:w-auto ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Registering..." : "Register Farmer"}
        </Button>
      </div>
    </form>
  );
};

export default AddFarmerForm;
