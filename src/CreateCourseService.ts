interface Course {
  name: string;
  duration: number;
  educator: string;
}

class CreateCourseService {
  constructor(
    public name: string,
    public duration: number,
    public educator: string
  ) {}
}

export default CreateCourseService;
