import mongoose, {Schema} from "mongoose"

const projectSchema=new Schema({
        
        title:{type:String},
        description:{type:String}

    
})

const Project=mongoose.model("Project",projectSchema);
export {Project}