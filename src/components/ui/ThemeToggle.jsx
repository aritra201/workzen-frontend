import { useTheme } from '../../hooks/useTheme.js';
import Icon from './Icon.jsx';
import Button from './Button.jsx';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode (Obsidian)'}
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={20} />
    </Button>
  );
}
