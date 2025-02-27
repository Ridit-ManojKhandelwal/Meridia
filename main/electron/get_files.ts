import fs from "fs";
import path from "path";

export const get_files = (dir: string) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  const buildStructure = (currentPath: string): any => {
    const currentFiles = fs.readdirSync(currentPath, { withFileTypes: true });

    return currentFiles.map((file, index) => {
      const fullPath = path.join(currentPath, file.name);
      if (file.isDirectory()) {
        return {
          id: `${index + 1}`,
          name: file.name,
          isFolder: true,
          path: path.join(file.parentPath, file.name),
          items: buildStructure(fullPath),
        };
      } else {
        return {
          id: `${index + 1}`,
          name: file.name,
          path: path.join(file.parentPath, file.name),
          isFolder: false,
          items: [],
        };
      }
    });
  };

  console.log(dir);

  return buildStructure(dir);
};
