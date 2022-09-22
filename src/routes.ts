import { Request, Response } from 'express';
import CreateCourseService from './CreateCourseService';

export function createCourse(request: Request, response: Response) {
  const createCourse = new CreateCourseService('Nodejs', 10, 'Dani');

  return response.send();
}
