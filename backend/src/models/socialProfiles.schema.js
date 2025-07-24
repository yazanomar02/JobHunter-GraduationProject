import { Schema } from "mongoose";
const socialProfilesSchema = new Schema({
    linkedIn: String,
    github: String,
    twitter: String,
    portfolioWebsite: String,
    email: String,
    whatsapp: String,
});
export { socialProfilesSchema };
