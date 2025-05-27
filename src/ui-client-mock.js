// Mock file for @payloadcms/ui/dist/exports/client/index.js

/**
 * This file is used to replace the problematic client/index.js in @payloadcms/ui
 * which has issues with __dirname not being defined in client side
 */

// ส่งออก interface เหมือนกับไฟล์ต้นฉบับ
export const resolvePathFromSourceToImport = (modulePath) => {
  return '/resolved-path';
};

export const requireModule = (modulePath) => {
  return { default: {} };
};

// Mock สำหรับข้อมูลผู้ใช้
export const getViewerData = () => ({
  _id: 'mock-id',
  email: 'admin@example.com',
  collection: 'users',
});

// Mock สำหรับฟังก์ชันอื่นๆ ที่ใช้ใน admin UI
export const getFieldsOfTypes = () => [];

export const useForm = () => ({
  getState: () => ({}),
  subscribe: () => () => {},
  submit: () => {},
  reset: () => {},
});

export const useConfig = () => ({
  serverURL: 'http://localhost:3000',
  routes: { api: '/api' },
  admin: {
    user: 'users',
    meta: { titleSuffix: '', favicon: '', ogImage: '' },
  },
  collections: [],
  globals: [],
});

export const useAuth = () => ({
  user: null,
  logOut: () => {},
  refreshCookie: () => {},
});

// ส่งออกเป็นค่า default เพื่อความเข้ากันได้
export default {
  resolvePathFromSourceToImport,
  requireModule,
  getViewerData,
  getFieldsOfTypes,
  useForm,
  useConfig,
  useAuth,
}; 