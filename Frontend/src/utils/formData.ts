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
    // Nếu là mảng thông thường
    else if (Array.isArray(value)) {
      value.forEach((item: any, idx: number) => {
        formData.append(`${key}[${idx}]`, item);
      });
    }
    // Nếu là object (không phải file)
    else if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
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