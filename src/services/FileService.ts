export const FileService = {
  stringToTextFile(content: BlobPart, fileName: string) {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      return new File([blob], `${fileName}.txt`, { type: 'text/plain' });
    } catch (error: any) {
      throw new Error('Failed to convert string to text file: ' + error.message);
    }
  },
  textFileToString(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type !== 'text/plain') {
        reject(new Error('File must be a text file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read text file'));
        }
      };
      reader.onerror = (error) => {
        reject(new Error('Error reading text file: ' + error));
      };
      reader.readAsText(file);
    });
  },

  imageToString(imageFile: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to string'));
        }
      };
      reader.onerror = (error) => {
        reject(new Error('Error reading image file: ' + error));
      };
      reader.readAsDataURL(imageFile);
    });
  },
  stringToImage(base64String: string, fileName = 'image') {
    try {
      const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string format');
      }
      const mimeType = matches[1];
      const base64Data = matches[2];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: mimeType });
      const extension = mimeType.split('/')[1] || 'jpg';
      return new File([blob], `${fileName}.${extension}`, { type: mimeType });
    } catch (error: any) {
      throw new Error('Failed to convert string to image: ' + error.message);
    }
  },

  fileToString(file: File): Promise<{ content: string; fileType: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            content: reader.result,
            fileType: file.type
          });
        } else {
          reject(new Error('Failed to convert file to string'));
        }
      };

      reader.onerror = (error) => {
        reject(new Error('Error reading file: ' + error));
      };

      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  },

  stringToFile(fileString: string, fileName: string, fileType: string): File {
    try {
      if (fileType === 'text/plain') {
        const blob = new Blob([fileString], { type: fileType });
        return new File([blob], fileName, { type: fileType });
      }

      if (fileString.startsWith('data:')) {
        const matches = fileString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
          throw new Error('Invalid base64 string format');
        }

        const actualFileType = matches[1];
        const base64Data = matches[2];

        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: actualFileType });
        return new File([blob], fileName, { type: actualFileType });
      }

      throw new Error('Unsupported string format');
    } catch (error: any) {
      throw new Error('Failed to convert string to file: ' + error.message);
    }
  },

  saveFileToClient(file: File): void {
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
};

export default FileService;