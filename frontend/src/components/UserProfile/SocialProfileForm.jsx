import React, { useEffect, useState } from "react";
import SubmissionButton from "../Common/Buttons/SubmissionButton";
import InputField from "../Common/FormComponents/InputField";
import { userService } from "../../services/userService";

function SocialProfileForm({ userData }) {
    const [initialFormData, setInitialFormData] = useState({
        website: "",
        linkedin: "",
        twitter: "",
        github: "",
        whatsapp: "",
        email: "",
    });

    const [formData, setFormData] = useState(initialFormData);
    const [isChanged, setIsChanged] = useState(false);
    const [updating, setUpdating] = useState(null);
    
    useEffect(() => {
        if (userData) {
            const newFormData = {
                website: userData?.userProfile?.socialProfiles?.portfolioWebsite || "",
                linkedin: userData?.userProfile?.socialProfiles?.linkedin || "",
                twitter: userData?.userProfile?.socialProfiles?.twitter || "",
                github: userData?.userProfile?.socialProfiles?.github || "",
                whatsapp: userData?.userProfile?.socialProfiles?.whatsapp || "",
                email: userData?.userProfile?.socialProfiles?.email || "",
            };
            setFormData(newFormData);
            setInitialFormData(newFormData);
        }
    }, [userData]);

    useEffect(() => {
        setIsChanged(
            JSON.stringify(formData) !== JSON.stringify(initialFormData)
        );
    }, [formData, initialFormData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            socialProfiles: {
                portfolioWebsite: formData.website,
                linkedin: formData.linkedin,
                twitter: formData.twitter,
                github: formData.github,
                whatsapp: formData.whatsapp,
                email: formData.email,
            },
        };
        try {
            setUpdating(true);
            const res = await userService.updateUserProfile(data);
            if (res.status === 200) {
                setIsChanged(false);
                alert('Social profiles updated successfully!');
            }
        } catch (error) {
            console.log(error);
            alert('Failed to update social profiles. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setIsChanged(false);
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    isRequired={true}
                    icon={<i className="fa-solid fa-envelope"></i>}
                    placeholder="you@example.com"
                />

                <InputField
                    label="WhatsApp"
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp || ""}
                    onChange={handleInputChange}
                    isRequired={false}
                    icon={
                        <i className="fa-brands fa-whatsapp text-green-500"></i>
                    }
                    placeholder="+963*********"
                />

                <InputField
                    label="Website / Portfolio"
                    id="website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleInputChange}
                    isRequired={false}
                    icon={<i className="fa-solid fa-globe"></i>}
                    placeholder={"https://"}
                />
                <InputField
                    label="Linkedin"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin || ""}
                    onChange={handleInputChange}
                    isRequired={false}
                    icon={<i className="fa-brands fa-linkedin-in"></i>}
                    placeholder={"https://www.linkedin.com/in/username"}
                />
                <InputField
                    label="Twitter"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter || ""}
                    onChange={handleInputChange}
                    isRequired={false}
                    icon={<i className="fa-brands fa-twitter"></i>}
                    placeholder={"https://twitter.com/username"}
                />
                <InputField
                    label="GitHub"
                    id="github"
                    name="github"
                    value={formData.github || ""}
                    onChange={handleInputChange}
                    isRequired={false}
                    placeholder={"https://github.com/username"}
                    icon={<i className="fa-brands fa-github"></i>}
                />
                <div className="flex gap-6 my-4 justify-end">
                    {isChanged && (
                        <SubmissionButton
                            type="button"
                            onClick={handleCancel}
                            color="white"
                            label="Cancel"
                        />
                    )}
                    <SubmissionButton
                        type="submit"
                        onClick={handleSubmit}
                        color="black"
                        label={updating ? "Saving..." : "Save"}
                    />
                </div>
            </form>
        </div>
    );
}

export default SocialProfileForm;
