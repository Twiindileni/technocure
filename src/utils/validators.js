export const required = { required: "This field is required" };

export const emailRules = {
  required: "Email is required",
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
};

export const phoneRules = {
  pattern: { value: /^[\+\d\s\-\(\)]{7,20}$/, message: "Enter a valid phone number" },
};

export const passwordRules = {
  required: "Password is required",
  minLength: { value: 8, message: "Password must be at least 8 characters" },
};

export function validateFileSize(file, maxMB = 10) {
  return file.size <= maxMB * 1024 * 1024 || `File must be smaller than ${maxMB}MB`;
}

export function validateFileType(file, allowed = ["image/jpeg","image/png","image/webp","application/pdf"]) {
  return allowed.includes(file.type) || "File type not allowed";
}
