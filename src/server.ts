import express from 'express';
import { createCourse } from './routes';

const port = 3333;
const app = express();

app.get('/', createCourse);

app.listen(port);

