import dotenv from 'dotenv';
dotenv.config(); // Make sure this is called at the top
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import router from "./controllers/routers.js";
import { Project } from "./models/usermodel.js";
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.json());

app.use(cors());  // This will allow requests from any origin

app.use(express.json({ limit: "40kb" }))
app.use(express.urlencoded({ limit: "40kb", extended: true }))
app.get("/home", (req, res) => {
  res.send("done")
})

app.post('/carding', async (req, res) => {
  const { id, title, description } = req.body;

  try {

    const newCard = new Project({ id, title, description });

    // Save the card to the database
    await newCard.save();

    // Send a success response with the saved card
    res.status(201).json(newCard);
  } catch (error) {
    // Handle any errors that occur during saving
    res.status(500).json({ message: 'Error creating card', error });
  }
});
app.get('/projects', async (req, res) => {
  try {
    // Fetch all cards from the database
    const cards = await Project.find({});

    // Send the cards as a JSON response
    res.json(cards);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: 'Error retrieving cards', error });
  }
});
app.put('/carding/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Find the card by its ID

    const card = await Project.findById(id);

    // Check if the card exists
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Update the card fields with new data from the request body

    card.title = title;
    card.description = description;

    // Save the updated card
    await card.save();

    // Send a success response with the updated card

    res.status(200).json({ message: "Card updated successfully", card });
  } catch (error) {
    // Handle any errors during the update process
    res.status(500).json({ message: `Error updating card: ${error}` });
  }
});

app.get('/cards/:title', async (req, res) => {
  const { title } = req.params;

  try {
    // Find the card by title
    const card = await Project.findOne({ title });

    if (card) {
      // If the card is found, return it
      res.json(card);
    } else {
      // If no card is found, return a 404 status with a message
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the query
    res.status(500).json({ message: 'Error retrieving card', error });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const event = await Project.findById(id);
    console.log(event)
    if (!event) {
      return res.status(404).json({ message: "Event not found" });

    }

    await Project.findByIdAndDelete(id); // find by id and delete 

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong: ${e}` });
  }
})
app.use("/api/v1/projects", router)


console.log('Mongo URI:', process.env.MONGO_URI);
const start = async () => {
  try {
    const connectdb = await mongoose.connect(process.env.MONGO_URI
    );
    console.log(`Connected to MongoDB host: ${connectdb.connection.host}`);
     app.listen(8000,()=>{
      console.log("listing")
  })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
}

start();