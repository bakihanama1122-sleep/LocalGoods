"use client";

import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const tabs = ["Categories", "Logo", "Banner"];

const Customization = () => {
  const [activeTab, setActiveTab] = useState("Categories");
  const [categories, setcategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, string[]>>(
    {}
  );
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const res = await axiosInstance.get(
          "/admin/api/get-all-customizations"
        );
        const data = res.data;

        setcategories(data.categories || []);
        setSubCategories(data.subCategories || {});
        setLogo(data.logo || null);
        setBanner(data.banner || null);
      } catch (error) {
        console.error("failed to fetch customization data", error);
      }
    };
    fetchCustomization();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axiosInstance.post("/admin/api/add-category", {
        category: newCategory,
      });
      setcategories((prev) => [...prev, newCategory]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category", error);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim() || !selectedCategory) return;
    try {
      await axiosInstance.post("/admin/api/add-subcategory", {
        category: selectedCategory,
        subCategory: newSubCategory,
      });
      setSubCategories((prev) => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), newSubCategory],
      }));
      setNewSubCategory("");
    } catch (error) {
      console.error("error adding subcategory", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-8">
      <h2 className="text-2xl text-white font-semibold mb-2">Customization</h2>
      <div className="mb-4">
        <div className="flex items-center text-white">
          <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">
            Dashboard
          </Link>
          <ChevronRight size={20} className="opacity-[.8]" />
          <span>Notifications</span>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
          className="text-white"
          onClick={()=>setActiveTab(tab)}
          >{tab}</button>
        ))}
      </div>

      <div className="mt-8 text-white">
        {activeTab === "Categories" && (
          <div className="space-y-4">
            {categories.length == 0 ? (
              <p className="text-gray-400">No categories found.</p>
            ) : (
              categories.map((cat, idx) => (
                <div key={idx}>
                  <p className="font-semibold mb-1">{cat}</p>
                  {subCategories?.[cat]?.length > 0 ? (
                    <ul className="ml-4 tex-sm text-gray-400 list-disc">
                      {subCategories[cat].map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4 text-xs text-gray-500 italic">
                      No subcategories
                    </p>
                  )}
                </div>
              ))
            )}

            <div className="pt-4 space-x-2">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-1 rounded-md outlin-none text-sm bg-gray-800"
              />
              <button
                onClick={handleAddCategory}
                className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
              >
                Add Category
              </button>
            </div>

            <div className="pt-4 flex items-center gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 outline-none text-white border border-gray-600"
              >
                <option value="">Select category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="New subCategory"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                className="px-3 py-1 rounded-md outline-none text-sm bg-gray-800 text-white"
              />
              <button
                onClick={handleAddSubCategory}
                className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
              >
                Add Subcategory
              </button>
            </div>
          </div>
        )}

        {activeTab === "Logo" && (
          <div className="space-y-4">
            {logo ? (
              <img
                src={logo}
                alt="Platform Logo"
                className="w-[120px] h-auto border border-gray-600 p-2 bg-white"
              />
            ) : (
              <p className="text-gray-400">No logo uploaded.</p>
            )}

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const res = await axiosInstance.post(
                      "/admin/api/upload-logo",
                      formData
                    );
                    setLogo(res.data.logo);
                  } catch (error) {
                    console.error("Logo upload failed", error);
                  }
                }}
                className="text-sm text-white"
              />
            </div>
          </div>
        )}

        {activeTab === "Banner" && (
          <div className="space-y-4">
            {banner ? (
              <img
                src={banner}
                alt="Platform Banner"
                className="w-full max-w-[600px] h-auto border border-gray-600 rounded-md"
              />
            ) : (
              <p className="text-gray-400">No banner uploaded.</p>
            )}

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const res = await axiosInstance.post(
                      "/admin/api/upload-banner",
                      formData
                    );
                    setLogo(res.data.logo);
                  } catch (error) {
                    console.error("Banner upload failed", error);
                  }
                }}
                className="text-sm text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customization;