// Pages/CompanyPublicProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { companyService } from "../services/companyService";
import { useSelector } from "react-redux";
import InputField from "../components/Common/FormComponents/InputField";
import TextArea from "../components/Common/FormComponents/TextArea";

function CompanyPublicProfile() {
  const { id } = useParams();
  const { userData } = useSelector((store) => store.auth);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const isOwner = userData && userData.role === "employer" && userData._id === id;

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await companyService.getCompanyById(id);
        setCompany(res?.userProfile || {});
        setForm(res?.userProfile ? { ...res.userProfile } : null);
      } catch (err) {
        setError("Company not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      // أرسل فقط الحقول المسموحة
      const allowedFields = [
        "companyName", "companyDescription", "contactNumber", "address", "industry",
        "companySize", "companyLogo", "companyWebsite", "companySocialProfiles", "employeeBenefits", "aiUseLimit"
      ];
      const dataToSend = {};
      allowedFields.forEach(field => {
        if (form[field] !== undefined) dataToSend[field] = form[field];
      });
      // employeeBenefits معالجة كما في السابق
      if (typeof dataToSend.employeeBenefits === "string") {
        dataToSend.employeeBenefits = dataToSend.employeeBenefits
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(dataToSend.employeeBenefits)) {
        dataToSend.employeeBenefits = [];
      }
      await companyService.updateCompanyById(id, dataToSend);
      setCompany({ ...company, ...dataToSend });
      setEditMode(false);
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mt-32 text-center">Loading...</div>;
  if (error) return <div className="mt-32 text-center text-red-500">{error}</div>;
  if (!company) return null;

  // --- EDIT MODE ---
  if (editMode && isOwner && form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-24 pb-10">
        <form onSubmit={handleSave} className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col gap-6">
          <div className="flex flex-col items-center mb-4">
            <img
              className="w-28 h-28 mx-auto rounded-lg border-2 border-gray-200 object-contain shadow-sm bg-white"
              src={form.companyLogo}
              alt="Company Logo"
            />
            <InputField
              label="Company Name"
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={handleInputChange}
              className="mt-3 w-full md:w-2/3"
              isRequired
            />
          </div>
          <TextArea
            label="About the Company"
            id="companyDescription"
            name="companyDescription"
            value={form.companyDescription}
            onChange={handleInputChange}
            placeholder="Enter company description"
            className="w-full"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Industry"
              id="industry"
              name="industry"
              value={form.industry}
              onChange={handleInputChange}
              className="w-full"
            />
            <InputField
              label="Contact Number"
              id="contactNumber"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleInputChange}
              className="w-full"
            />
            <InputField
              label="City"
              id="address.city"
              name="address.city"
              value={form.address?.city || ""}
              onChange={handleInputChange}
              className="w-full"
            />
            <InputField
              label="State"
              id="address.state"
              name="address.state"
              value={form.address?.state || ""}
              onChange={handleInputChange}
              className="w-full"
            />
            <InputField
              label="Country"
              id="address.country"
              name="address.country"
              value={form.address?.country || ""}
              onChange={handleInputChange}
              className="w-full"
            />
            <InputField
              label="Company Size From"
              id="companySize.from"
              name="companySize.from"
              value={form.companySize?.from || ""}
              onChange={handleInputChange}
              className="w-full"
              type="number"
            />
            <InputField
              label="Company Size To"
              id="companySize.to"
              name="companySize.to"
              value={form.companySize?.to || ""}
              onChange={handleInputChange}
              className="w-full"
              type="number"
            />
          </div>
          <InputField
            label="Company Website"
            id="companyWebsite"
            name="companyWebsite"
            value={form.companyWebsite || ""}
            onChange={handleInputChange}
            className="w-full"
          />
          <InputField
            label="LinkedIn"
            id="companySocialProfiles.linkedIn"
            name="companySocialProfiles.linkedIn"
            value={form.companySocialProfiles?.linkedIn || ""}
            onChange={handleInputChange}
            className="w-full"
          />
          <InputField
            label="Twitter"
            id="companySocialProfiles.twitter"
            name="companySocialProfiles.twitter"
            value={form.companySocialProfiles?.twitter || ""}
            onChange={handleInputChange}
            className="w-full"
          />
          <InputField
            label="Portfolio Website"
            id="companySocialProfiles.portfolioWebsite"
            name="companySocialProfiles.portfolioWebsite"
            value={form.companySocialProfiles?.portfolioWebsite || ""}
            onChange={handleInputChange}
            className="w-full"
          />
          <InputField
            label="Employee Benefits (comma separated)"
            id="employeeBenefits"
            name="employeeBenefits"
            value={Array.isArray(form.employeeBenefits) ? form.employeeBenefits.join(", ") : ""}
            onChange={e => setForm(prev => ({ ...prev, employeeBenefits: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
            className="w-full"
          />
          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
          {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
        </form>
      </div>
    );
  }

  // --- VIEW MODE ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-0">
        {/* Header */}
        <div className="flex flex-col items-center py-10 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <img
            className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg object-cover bg-white"
            src={company.companyLogo}
            alt="Company Logo"
          />
          <h2 className="mt-5 text-4xl font-extrabold text-center text-blue-900 tracking-tight drop-shadow-lg">
            {company.companyName}
          </h2>
        </div>

        {/* About Section */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-blue-700 flex items-center gap-2"><i className="fa-solid fa-circle-info"></i> About</p>
            <p className="text-gray-400 text-sm">A brief description of your company, vision, and values.</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base min-h-[48px]">
              {company.companyDescription || <span className="text-gray-400">No description available.</span>}
            </span>
          </div>
        </div>

        {/* Industry & Size */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-purple-700 flex items-center gap-2"><i className="fa-solid fa-industry"></i> Industry</p>
            <p className="text-gray-400 text-sm">The sector your company operates in.</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">{company.industry || <span className="text-gray-400">Not specified</span>}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-purple-700 flex items-center gap-2"><i className="fa-solid fa-users"></i> Company Size</p>
            <p className="text-gray-400 text-sm">Number of employees in your company.</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">
              {company.companySize?.from && company.companySize?.to
                ? `${company.companySize.from} - ${company.companySize.to} employees`
                : <span className="text-gray-400">Not specified</span>}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-gray-700 flex items-center gap-2"><i className="fa-solid fa-location-dot"></i> Address</p>
            <p className="text-gray-400 text-sm">Where is your company located?</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">
              {company.address?.city && <span>{company.address.city}, </span>}
              {company.address?.state && <span>{company.address.state}, </span>}
              {company.address?.country || <span className="text-gray-400">Not specified</span>}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-green-700 flex items-center gap-2"><i className="fa-solid fa-address-book"></i> Contact</p>
            <p className="text-gray-400 text-sm">How can people reach your company?</p>
          </div>
          <div className="w-full md:w-[70%] flex flex-col gap-2">
            {company.companyWebsite && (
              <a href={company.companyWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                <i className="fa-solid fa-globe"></i> Website
              </a>
            )}
            {company.companySocialProfiles?.email && (
              <a href={`mailto:${company.companySocialProfiles.email}`} className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                <i className="fa-solid fa-envelope"></i> Email
              </a>
            )}
            {company.companySocialProfiles?.whatsapp && (
              <a href={`https://wa.me/${company.companySocialProfiles.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-600 hover:underline font-medium">
                <i className="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
            )}
            {company.contactNumber && (
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <i className="fa-solid fa-phone"></i> {company.contactNumber}
              </span>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-blue-700 flex items-center gap-2"><i className="fa-solid fa-share-nodes"></i> Social Media</p>
            <p className="text-gray-400 text-sm">Where can people find your company online?</p>
          </div>
          <div className="w-full md:w-[70%] flex gap-4 text-xl items-center">
            {company.companySocialProfiles?.linkedIn && (
              <a href={company.companySocialProfiles.linkedIn} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900"><i className="fa-brands fa-linkedin"></i></a>
            )}
            {company.companySocialProfiles?.twitter && (
              <a href={company.companySocialProfiles.twitter} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700"><i className="fa-brands fa-x-twitter"></i></a>
            )}
            {company.companySocialProfiles?.portfolioWebsite && (
              <a href={company.companySocialProfiles.portfolioWebsite} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-gray-900"><i className="fa-solid fa-globe"></i></a>
            )}
          </div>
        </div>

        {/* Employee Benefits */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-yellow-700 flex items-center gap-2"><i className="fa-solid fa-gift"></i> Employee Benefits</p>
            <p className="text-gray-400 text-sm">What perks do you offer to your employees?</p>
          </div>
          <div className="w-full md:w-[70%] flex flex-wrap gap-2 items-center">
            {company.employeeBenefits && company.employeeBenefits.length > 0 ? (
              company.employeeBenefits.map((benefit, idx) => (
                <span key={idx} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                  <i className="fa-solid fa-check"></i> {benefit}
                </span>
              ))
            ) : <span className="text-gray-400">No benefits specified.</span>}
          </div>
        </div>

        {/* Active Job Listings */}
        <div className="flex flex-col md:flex-row gap-16 my-8 border-b pb-10 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-green-700 flex items-center gap-2"><i className="fa-solid fa-briefcase"></i> Active Job Listings</p>
            <p className="text-gray-400 text-sm">Open positions at your company.</p>
          </div>
          <div className="w-full md:w-[70%] flex flex-col gap-3">
            {company.jobListings && company.jobListings.length > 0 ? (
              company.jobListings.map((job) => (
                <div key={job?._id} className="bg-green-50 border border-green-100 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:gap-4 shadow-sm">
                  <span className="font-medium text-green-900 text-base flex items-center gap-2"><i className="fa-solid fa-briefcase"></i> {job?.title}</span>
                  <span className="text-xs text-gray-500">{job?.location}</span>
                  <span className="text-xs text-gray-400">{job?.description}</span>
                </div>
              ))
            ) : <span className="text-gray-400">No active jobs.</span>}
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-col md:flex-row gap-16 my-8 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-gray-700 flex items-center gap-2"><i className="fa-solid fa-robot"></i> AI Usage Limit</p>
            <p className="text-gray-400 text-sm">How many times you can use AI features.</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">{company.aiUseLimit ?? <span className="text-gray-400">Not specified</span>}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 my-8 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-gray-700 flex items-center gap-2"><i className="fa-solid fa-clipboard-check"></i> Onboarding Status</p>
            <p className="text-gray-400 text-sm">Is your company profile complete?</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">{company.doneOnboarding ? "Completed" : "Not completed"}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 my-8 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-gray-700 flex items-center gap-2"><i className="fa-solid fa-id-badge"></i> Company ID</p>
            <p className="text-gray-400 text-sm">Unique identifier for your company.</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">{company._id || <span className="text-gray-400">Not available</span>}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 my-8 px-8">
          <div className="w-full md:w-[30%] flex flex-col gap-2.5">
            <p className="font-medium text-gray-700 flex items-center gap-2"><i className="fa-solid fa-envelope"></i> Email</p>
            <p className="text-gray-400 text-sm">Contact email for your company.</p>
          </div>
          <div className="w-full md:w-[70%] flex items-center">
            <span className="text-gray-700 text-base">{company.email || <span className="text-gray-400">Not available</span>}</span>
          </div>
        </div>
        {isOwner && (
          <div className="flex justify-end mb-2 px-8 pb-8">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyPublicProfile;
