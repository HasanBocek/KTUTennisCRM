import type { UserType } from "$lib/types/types";
import { GRADES, GENDERS } from "$lib/helpers/constants";
import departments from "$lib/assets/departments.json";
import { ROLES } from "$lib/types/role";

export const validationPatterns = {
  name: /^[a-zA-ZçğıöşüÇĞİÖŞÜ ]+$/,
  e164Phone: /^\+[1-9]\d{1,14}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  allowedSkillLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUserProfile(user: UserType): ValidationResult {
  const errors: string[] = [];
  const isStudent = user.isStudent ?? true;

  // First Name Validation
  if (!validationPatterns.name.test((user.firstName ?? "").toString().trim())) {
    errors.push("İsim sadece harfler ve boşluklar içermelidir");
  }

  // Last Name Validation
  if (!validationPatterns.name.test((user.lastName ?? "").toString().trim())) {
    errors.push("Soyisim sadece harfler ve boşluklar içermelidir");
  }

  // Gender Validation
  if (user.isMale !== "1" && user.isMale !== "0") {
    errors.push("Cinsiyet gereklidir");
  }

  // Phone Validation
  if (!validationPatterns.e164Phone.test((user.phoneNumber ?? "").toString().trim())) {
    errors.push("Telefon numarası geçerli formatta olmalıdır (E.164)");
  }

  // Skill Level Validation
  if (!validationPatterns.allowedSkillLevels.includes(Number(user.skillLevel ?? NaN))) {
    errors.push("Yetenek seviyesi 1 ile 10 arasında olmalıdır");
  }

  // Student-specific Validations
  if (isStudent) {
    // Department Validation
    if (!Object.keys(departments).includes(user.department ?? "")) {
      errors.push("Bölüm seçiniz");
    }

    // Grade Validation
    if (!GRADES.includes((user.grade ?? "").toString())) {
      errors.push("Sınıf seçiniz");
    }

    // Student Number Validation
    if (user.studentNumber && Number(user.studentNumber) <= 0) {
      errors.push("Geçerli bir öğrenci numarası girin");
    }
  }

  // Roles Validation
  if (user.roles && user.roles.length > 0) {
    const invalidRoles = user.roles.filter(
      (role) => typeof role !== "string" || role.trim().length === 0
    );
    if (invalidRoles.length > 0) {
      errors.push("Geçersiz roller mevcut");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || !validationPatterns.email.test(email.trim())) {
    errors.push("E-posta gereklidir ve geçerli olmalıdır");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
