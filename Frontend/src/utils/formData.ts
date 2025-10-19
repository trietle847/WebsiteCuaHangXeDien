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

export function createProductFormData(data: any): FormData {
  const formData = new FormData();

  // 1. Thêm các trường cơ bản
  const basicFields = ["name", "price", "stock_quantity", "company_id"];

  basicFields.forEach((field) => {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      data[field] !== ""
    ) {
      formData.append(field, data[field].toString());
    }
  });

  // 2. Xử lý specs - JSON Object
  if (data.specs && Object.keys(data.specs).length > 0) {
    // Lọc bỏ các field rỗng/undefined
    const cleanSpecs = Object.entries(data.specs).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    formData.append("specs", JSON.stringify(cleanSpecs));
  }

  // 3. Xử lý colors metadata
  if (data.colors && Array.isArray(data.colors) && data.colors.length > 0) {
    const colorIds = data.colors.map((color: any) => color.color_id);
    formData.append("colors", JSON.stringify(colorIds));
  }

  // 4. Xử lý images theo màu - Dynamic keys (images_1, images_2, ...)
  Object.keys(data).forEach((key) => {
    // Check nếu key có format images_colorId
    if (key.startsWith("images_")) {
      const files = data[key];

      if (Array.isArray(files) && files.length > 0) {
        files.forEach((file: File) => {
          // Giữ nguyên key động: images_1, images_2...
          formData.append(key, file);
        });
      }
    }
  });

  return formData;
}