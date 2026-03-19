import { motion, AnimatePresence } from "framer-motion";

type SitePreloaderProps = {
  visible: boolean;
};

export default function SitePreloader({ visible }: SitePreloaderProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="site-preloader fixed inset-0 z-[120] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.42, ease: "easeOut" } }}
          aria-live="polite"
          aria-label="Loading website"
          role="status"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,hsl(var(--primary)/0.18),transparent_36%),radial-gradient(circle_at_84%_78%,hsl(var(--accent)/0.18),transparent_40%),linear-gradient(160deg,hsl(var(--overlay-dark)),hsl(var(--overlay-dark)/0.96))]" />

          <motion.div
            className="pointer-events-none absolute left-0 top-[32%] h-px w-full origin-left bg-overlay-text/28"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.85, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.25 } }}
          />
          <motion.div
            className="pointer-events-none absolute left-0 top-[68%] h-px w-full origin-right bg-overlay-text/28"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.85, transition: { duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.25 } }}
          />

          <motion.div
            className="relative z-10 flex w-[min(40rem,92vw)] flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <p className="mb-6 text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-overlay-text/72 md:mb-8">
              Loading Experience
            </p>

            <div className="relative flex w-full items-center justify-center overflow-hidden py-2">
              <motion.span
                className="font-display text-5xl leading-none tracking-[-0.04em] text-overlay-text md:text-7xl"
                initial={{ x: -52, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ x: -28, opacity: 0, transition: { duration: 0.25 } }}
              >
                Baba
              </motion.span>
              <motion.span
                className="mx-3 h-10 w-px bg-overlay-text/45 md:h-14"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
                exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.2 } }}
              />
              <motion.span
                className="font-display text-5xl leading-none tracking-[-0.04em] text-overlay-text md:text-7xl"
                initial={{ x: 52, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ x: 28, opacity: 0, transition: { duration: 0.25 } }}
              >
                Flats
              </motion.span>
            </div>

            <div className="mt-7 flex w-[min(24rem,80vw)] items-center gap-2 md:mt-8">
              <motion.div
                className="h-1.5 flex-1 origin-right rounded-full bg-primary/85"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, transition: { duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ scaleX: 0, transition: { duration: 0.22 } }}
              />
              <motion.div
                className="h-1.5 w-8 rounded-full bg-accent/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.25, 1, 0.25], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              />
              <motion.div
                className="h-1.5 flex-1 origin-left rounded-full bg-primary/85"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, transition: { duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ scaleX: 0, transition: { duration: 0.22 } }}
              />
            </div>

            <p className="mt-5 text-center text-xs tracking-[0.08em] text-overlay-text/72 md:text-sm">
              Preparing residences, amenities, and neighborhood details.
            </p>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-overlay-dark to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
