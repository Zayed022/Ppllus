export const uploadToCloudinary = async (file: any) => {
    const formData = new FormData();
  
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
      name: file.fileName || "upload.jpg",
    } as any);
  
    formData.append("upload_preset", "ppllus_chat");
  
    const cloudName = "dlgwqmlsj"; // FIXED
  
    const resourceType =
      file.mimeType?.includes("video") ? "video" : "image";
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }
  
    return data;
  };
  