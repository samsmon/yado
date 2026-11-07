# Yado Design, Animation, and Consistency Standards

This rules document must be followed by every developer and AI agent when creating or modifying components and pages in the Yado project.

---

## 1. Page and Component Entrance Animation
- **Transition animation required:** Every new page (`page.tsx`) and major section MUST NOT appear statically or abruptly.
- **Implementation:** Use `framer-motion` with the standard configuration:
  - Container:
    ```tsx
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 },
      },
    };
    ```
  - Item:
    ```tsx
    const item = {
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      },
    };
    ```

## 2. Navigation and Smooth Scrolling
- Horizontal and vertical anchor navigation (`#services`, `#status`, etc.) **must use smooth scrolling** via the `useLenis` engine (`lenis.scrollTo(...)`). Hard jumps that cause blinking or screen jerks are strictly forbidden.
- Navigation between pages must use the `<Link>` component from `next/link`.

## 3. Language Style and Anti-AI Slop
- Do not use cliched AI marketing phrases (e.g. *powerhouse*, *seamless*, *cutting-edge*, *revolutionary*).
- Use concise, technical, objective, natural language.
- Avoid rows of decorative emoji.

## 4. System Theme
- The app theme is locked to follow the user's operating system preference (OS dark/light mode).
- All layout elements must have a smooth CSS transition (`0.4s cubic-bezier(0.16, 1, 0.3, 1)`) so background and border color changes do not happen abruptly.

## 5. Mandatory Change Documentation (Changelog)
- Every modification or new file must be documented in `CHANGELOG.md`, with the version number, the files touched, and a technical explanation of the change.
