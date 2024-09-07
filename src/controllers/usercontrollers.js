import httpStatus from "http-status"
import { Project } from "../models/usermodel.js";

const check = async (req, res) => {
    const { id, title, description } = req.body;
   


    try {
        
        const checking = new Project({
            id:id,
            title:title,
            description:description
        });

        await checking.save();

        res.status(httpStatus.CREATED).json({ message: "data entered" })

    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }

}
export {check}