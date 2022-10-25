import path from "path";

export interface IFile {
  filename: string;
  originalname: string;
  mimetype: string;
  path: string;
}

export enum FileType {
  IMAGE = "jpeg|jpg|png|gif",
  CSV = "csv",
}

interface IRequest {
  file: IFile;
  type: FileType;
}

export function validate({ file, type }: IRequest): boolean {
  const regExp = new RegExp(type);
  return (
    regExp.test(path.extname(file.originalname).toLocaleLowerCase()) &&
    regExp.test(file.mimetype)
  );
}
