"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { countries } from "apps/user-ui/src/configs/countries";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ShippingAddressSection = () => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: "None",
      name: "",
      street: "",
      city: "",
      zip: "",
      country: "India",
      isDefault: "false",
    },
  });

  const {mutate:addAddress} = useMutation({
    mutationFn:async(payload:any)=>{
      const res = await axiosInstance.post("/api/add-address",payload);
      return res.data.address;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["shipping-addresses"]});
      reset();
      setShowModal(false);
    },
  });

  const {data: addresses,isLoading} = useQuery({
    queryKey:["shipping-addresses"],
    queryFn:async()=>{
      const res = await axiosInstance.get("/api/shipping-addresses");
      return res.data.addresses;
    },
  });

  const {mutate:deleteAddress} = useMutation({
    mutationFn:async(id:string)=>{
      await axiosInstance.delete(`/api/delete-address/${id}`);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["shipping-addresses"]});
    },
  });

  const onSubmit = async (data:any) => {
    addAddress({
      ...data,
      isDefault:data?.isDefault==="true",
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading addresses...</div>
          </div>
        ) : !addresses || addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No saved addresses</p>
            <p className="text-sm text-gray-500">Add your first address to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address: any) => (
              <div
                key={address.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative"
              >
                {address.isDefault && (
                  <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {address.label} - {address.name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {address.street}, {address.city}, {address.zip}, {address.country}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    onClick={() => deleteAddress(address.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Address
                </h3>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Enter your delivery address details</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Label
                </label>
                <select 
                  {...register("label")} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  placeholder="Enter full name"
                  {...register("name", { required: "Name is required." })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  placeholder="Enter street address"
                  {...register("street", { required: "Street is required." })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
                {errors.street && (
                  <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    placeholder="Enter city"
                    {...register("city", { required: "City is required." })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    placeholder="Enter ZIP code"
                    {...register("zip", { required: "ZIP code is required." })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select 
                  {...register("country")} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set as Default Address
                </label>
                <select 
                  {...register("isDefault")} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                >
                  <option value="false">No</option>
                  <option value="true">Yes, set as default</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressSection;