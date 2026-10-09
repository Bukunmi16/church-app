import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js";
import ChurchInformation from "./church-info.model.js";

export const getChurchInfo = async () => {
    const churchInfo = await ChurchInformation.findOne().lean();

    return churchInfo;
    };

export const saveChurchInfo = async (data, file) => {
    let churchInfo = await ChurchInformation.findOne();
    
    if(!churchInfo) {
        churchInfo = new ChurchInformation();
    }

    const { name, address, phone, email, website, description, socialLinks, motto } = data;

    if (file) {
        if(churchInfo?.logo?.publicId) {
            await deleteFromCloudinary(churchInfo.logo.publicId);
        }
        const imageData = await uploadToCloudinary(file.buffer, "church-app/church-info");
        churchInfo.logo = imageData;
    }

    if(name) churchInfo.name = name;
    if(address) churchInfo.address = address;
    if(phone) churchInfo.phone = phone;
    if(email) churchInfo.email = email;
    if(website) churchInfo.website = website;
    if(motto) churchInfo.motto = motto;
    if(description) churchInfo.description = description;

    if (socialLinks) {
         churchInfo.socialLinks = {
        ...churchInfo.socialLinks,
        ...socialLinks,
    }};

    await churchInfo.save();

    return churchInfo;
}