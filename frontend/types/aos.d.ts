declare module 'aos' {
  interface AOSOptions {
    duration?: number;
    easing?: string;
    once?: boolean;
    offset?: number;
    delay?: number;
    mirror?: boolean;
    disable?: boolean | string | (() => boolean);
    startEvent?: string;
    initClassName?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
  }

  interface AOS {
    init(options?: AOSOptions): void;
    refresh(): void;
    refreshHard(): void;
  }

  const aos: AOS;
  export default aos;
}