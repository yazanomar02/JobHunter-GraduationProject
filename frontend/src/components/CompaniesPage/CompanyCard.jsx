import React from "react";
import Dot from "../../components/Dot";
import { useNavigate } from "react-router-dom";

function CompanyCard({ bgColor, company }) {
  const {
    _id,
    userProfile: {
      companyName,
      companyLogo,
      jobListings = [],
      companySize,
      companySocialProfiles,
    } = {},
  } = company;

  const navigate = useNavigate();
  // توجيه لصفحة الشركة العامة
  const redirectToCompanyProfile = () => {
    // اسم الشركة في الرابط (معالجة المسافات)
    const nameSlug = companyName ? companyName.replace(/\s+/g, "-").toLowerCase() : "company";
    navigate(`/company/${_id}/${nameSlug}`);
  };

  // دالة مساعدة لتصحيح الرابط
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div className="rounded-xl border border-gray-300 p-1.5 hover:cursor-pointer" onClick={redirectToCompanyProfile}>
      <div
        className="rounded-xl border  p-2"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex gap-5 justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="h-14 w-14 border rounded-xl overflow-hidden p-px bg-white ">
              <img src={companyLogo} alt="Company Logo" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-medium text-gray-800">{companyName}</p>
              <span className="text-xs text-gray-500 flex gap-3 items-center ">
                <i className="fa-solid fa-user-group"></i>
                <p>
                  {companySize?.from && companySize?.to
                    ? `${companySize.from}-${companySize.to} EMPLOYEES`
                    : "Company size not specified"}
                </p>
              </span>

            </div>
          </div>

          <div className="flex gap-2.5 text-gray-700">
            <span onClick={e => { e.stopPropagation(); redirectToCompanyProfile(); }} title="View Company Profile">
              <i className="fa-solid fa-building hover:cursor-pointer text-lg"></i>
            </span>
            {companySocialProfiles?.linkedIn && (
              <a
                href={formatUrl(companySocialProfiles.linkedIn)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                title="LinkedIn"
              >
                <i className="fa-brands fa-linkedin hover:cursor-pointer text-lg"></i>
              </a>
            )}
            {companySocialProfiles?.twitter && (
              <a
                href={formatUrl(companySocialProfiles.twitter)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                title="X (Twitter)"
              >
                <i className="fa-brands fa-x-twitter hover:cursor-pointer text-lg"></i>
              </a>
            )}
            {companySocialProfiles?.portfolioWebsite && (
              <a
                href={formatUrl(companySocialProfiles.portfolioWebsite)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                title="Website"
              >
                <i className="fa-solid fa-globe hover:cursor-pointer text-lg"></i>
              </a>
            )}
          </div>
        </div>
        {jobListings && jobListings.length > 0 && (
          <div className="flex flex-col gap-2 my-5">
            <h3 className="text-sm font-medium border-gray-600 border w-32 flex items-center justify-center rounded-md text-gray-800 bg-green-300">
              Active Listings
            </h3>
            {jobListings
              .filter((listing) => listing && (listing.active === true || listing.active === undefined))
              .map((listing, index) => (
                <div
                  className="bg-gray-100 rounded-xl px-3 py-1.5 flex gap-3 items-center"
                  key={index}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {listing?.title}
                  </span>
                  <Dot />
                  <span className="text-xs font-medium text-gray-600">
                    {listing?.location}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyCard;
