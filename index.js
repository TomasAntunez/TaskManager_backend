import express from "express";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js'

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function( origin, callback ) {
        if( allowedDomains.indexOf(origin) !== -1 ) {
            callback( null, true );
        } else {
            callback( new Error('Not allowed by CORS') );
        }
    }
};

app.use(cors( corsOptions ));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

app.listen( PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});