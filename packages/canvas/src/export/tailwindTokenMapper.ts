export function mapTokensToTailwindTheme(): Record<string, string> {
  return { 'color.primary': 'theme.extend.colors.primary', 'spacing.4': 'theme.extend.spacing.4', 'radius.lg': 'theme.extend.borderRadius.lg', 'font.body': 'theme.extend.fontFamily.body', 'shadow.card': 'theme.extend.boxShadow.card' }
}
