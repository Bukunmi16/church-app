import { Resend } from "resend";
import User from "../user/user.model.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({to, subject, html}) => {
    const {data, error} = resend.emails.send({
        from: "Rhema Chapel <onboarding@resend.dev>",
        to,
        subject,
        html
    })

    if (error) {
        throw new Error(error.message)
    }

    return data 
}
 

export const emailAllActiveUsers = async ({subject, html}) => {
    const users = await User.find({
        isActive: true,
        email: { $exists: true, $ne: null }
    }).select("email")

    if (users.length === 0) return

    for (const user of users) {
        try {
            console.log("Sending email to:", user.email);

            await sendEmail({
                to: "bukunmiadigun14@gmail.com",
                subject,
                html
            });

            console.log("Email sent successfully to:", user.email);
        } catch (error) {
            console.error(
                `Failed to send email to ${user.email}:`,
                error.message
            );
        }
    }
}