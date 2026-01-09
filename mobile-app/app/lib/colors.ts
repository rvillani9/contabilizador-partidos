export const getColors = (isDarkMode: boolean = true) => ({
  // Fondos
  bgPrimary: isDarkMode ? '#2a2a2a' : '#fff',
  bgSecondary: isDarkMode ? '#3a3a3a' : '#f5f5f5',
  bgTertiary: isDarkMode ? '#1a1a1a' : '#fff',

  // Headers y acentos
  headerBg: isDarkMode ? '#7c3aed' : '#FF8C00',
  headerBgLight: isDarkMode ? '#9d4edd' : '#FFB84D',
  accentLight: isDarkMode ? '#5c3aad' : '#FFE4CC',

  // Textos
  textPrimary: isDarkMode ? '#fff' : '#000',
  textSecondary: isDarkMode ? '#aaa' : '#666',
  textTertiary: isDarkMode ? '#666' : '#999',

  // Bordes
  borderPrimary: isDarkMode ? '#7c3aed' : '#FF8C00',
  borderSecondary: isDarkMode ? '#444' : '#ddd',
  borderTertiary: isDarkMode ? '#5c3aad' : '#eee',

  // Botones
  buttonBg: isDarkMode ? '#7c3aed' : '#FF8C00',
  buttonBgSecondary: isDarkMode ? '#5c3aad' : '#333',
  buttonBorder: isDarkMode ? '#fff' : '#000',

  // Inputs
  inputBg: isDarkMode ? '#3a3a3a' : '#fff',
  inputBorder: isDarkMode ? '#7c3aed' : '#FF8C00',
  inputPlaceholder: isDarkMode ? '#666' : '#999',
});

export type Colors = ReturnType<typeof getColors>;

