import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

interface ImportFileOptions {
  filename: string;
  constructorOptions: unknown[];
}

export async function importFileFromFilename<ConstructorType>({
  filename,
  constructorOptions,
}: ImportFileOptions): Promise<ConstructorType> {
  const filePath = pathToFileURL(resolve(process.cwd(), filename)).toString();
  const File = await (await import(filePath)).default;
  const constructor = new File(...constructorOptions);
  return constructor;
}
