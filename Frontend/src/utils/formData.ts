export function createFormData(data: any): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Nếu là mảng file
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      value.forEach((file: File) => {
        formData.append(key, file);
      });
    }
    // Nếu là Set
    else if (value instanceof Set) {
      if (value.size > 0) {
        formData.append(key, JSON.stringify(Array.from(value)));
      }
    }
    // Nếu là array (không phải file)
    else if (Array.isArray(value)) {
      const filteredArray = value.filter((item) => item !== undefined && item !== null && item !== "");
      if (filteredArray.length > 0) {
        formData.append(key, JSON.stringify(filteredArray));
      }
    }
    // Nếu là object (không phải file, không phải array)
    else if (typeof value === "object" && !(value instanceof File)) {
      const filteredObj = Object.entries(value).reduce((acc, [k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          acc[k] = v;
        }
        return acc;
      }, {} as Record<string, any>);
      if (Object.keys(filteredObj).length > 0) {
        formData.append(key, JSON.stringify(filteredObj));
      }
    }
    // Nếu là file đơn
    else if (value instanceof File) {
      formData.append(key, value);
    }
    // Kiểu dữ liệu primitive
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
}