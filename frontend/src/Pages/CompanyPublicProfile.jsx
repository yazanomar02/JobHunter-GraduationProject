// Pages/CompanyPublicProfile.jsx
import React from "react";

function CompanyPublicProfile() {
  const company = {
    companyName: "Tech Solutions Inc.",
    companyLogo: "https://via.placeholder.com/100x100.png?text=Logo",
    socialProfiles: {
      linkedIn: "https://linkedin.com/company/techsolutions",
      twitter: "https://twitter.com/tech_solutions",
      portfolioWebsite: "https://www.techsolutions.com",
      email: "contact@techsolutions.com",
      whatsapp: "966501234567",
    },
    about:
      "Tech Solutions Inc. is a leading provider of innovative technology services in the Middle East, focusing on AI, cloud computing, and digital transformation.",
    jobListings: [
      {
        _id: "1",
        title: "Frontend Developer",
        location: "Riyadh, Saudi Arabia",
        description: "Join our UI/UX team and work with React.js & Tailwind.",
      },
      {
        _id: "2",
        title: "Backend Engineer",
        location: "Jeddah, Saudi Arabia",
        description:
          "Looking for Node.js developers with experience in cloud and microservices.",
      },
    ],
    industry: "Information Technology",
    location: "Saudi Arabia",
    specialties: ["Cloud", "AI", "DevOps", "Cybersecurity"],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-[3.5rem]">
      <div className="p-8 bg-white rounded shadow-md w-10/12 mt-7">
        {/* Logo */}
        <img
          className="w-24 h-24 mx-auto rounded-md border object-contain"
          src="https://photos.wellfound.com/startups/i/267839-22e9550a168c9834c67a3e55e2577688-medium_jpg.jpg?buster=1677467708"
          alt="Company Logo"
        />

        {/* Company Name */}
        <h2 className="mt-4 text-2xl font-semibold text-center">
          {company.companyName}
        </h2>

        {/* Industry + Location */}
        <div className="text-xs font-medium text-gray-600 flex gap-1.5 items-center justify-center">
          <span>{company.industry}</span>
          <div className="h-1 w-1 bg-gray-600 rounded-full"></div>
          <span className="capitalize">{company.location}</span>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 text-gray-800 justify-center my-2 text-lg">
          {company.socialProfiles?.linkedIn && (
            <a
              href={company.socialProfiles.linkedIn}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
          )}
          {company.socialProfiles?.twitter && (
            <a
              href={company.socialProfiles.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          )}
          {company.socialProfiles?.portfolioWebsite && (
            <a
              href={company.socialProfiles.portfolioWebsite}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-globe"></i>
            </a>
          )}
          {company.socialProfiles?.email && (
            <a
              href={`mailto:${company.socialProfiles.email}`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-envelope"></i>
            </a>
          )}
          {company.socialProfiles?.whatsapp && (
            <a
              href={`https://wa.me/${company.socialProfiles.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-whatsapp text-green-600"></i>
            </a>
          )}
        </div>

        {/* About */}
        <h3 className="text-center my-2 font-medium text-gray-600">About</h3>
        <p className="mt-2 text-center md:px-10 my-10">{company.about}</p>

        {/* Job Listings */}
        {company.jobListings.length > 0 && (
          <div className="w-full md:w-3/5 mx-auto">
            <h3 className="text-gray-500 font-medium">Job Openings</h3>
            {company.jobListings.map((job) => (
              <div
                key={job._id}
                className="shadow rounded-md p-3 my-4 border-b-2 border-gray-200 border"
              >
                <h4 className="font-medium text-lg">{job.title}</h4>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm mt-2 text-gray-800">{job.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Specialties / Tags */}
        {company.specialties.length > 0 && (
          <div className="w-full md:w-3/5 mx-auto mt-6">
            <h3 className="text-gray-500 font-medium">Specialties</h3>
            <div className="flex gap-3 flex-wrap mt-2">
              {company.specialties.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 shadow py-1 px-2 rounded text-sm font-medium text-gray-700"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyPublicProfile;
