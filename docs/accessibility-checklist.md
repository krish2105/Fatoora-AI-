# Accessibility Checklist

Fatoora AI is a B2B SaaS. Accessibility is critical for legal compliance and user experience.

- [x] **Semantic HTML**: Buttons are `<button>`, links are `<a>`.
- [x] **Color Contrast**: shadcn/ui defaults meet WCAG AA standards.
- [x] **Keyboard Navigation**: All interactive elements are reachable via Tab.
- [x] **Focus States**: Visible focus rings are present on inputs and buttons.
- [x] **ARIA Labels**: Screen-reader only text is provided for icon-only buttons (e.g., Delete, Edit).
- [x] **Form Labels**: All inputs have associated labels or aria-labels.
- [x] **Reduced Motion**: Tailwind animations respect `prefers-reduced-motion`.
