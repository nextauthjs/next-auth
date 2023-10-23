import { motion, useAnimationControls, useInView } from "framer-motion"
import * as React from "react"
const { useEffect, useId, useRef, useState } = React

const width = 76
const height = 76
const animationDuration = 1

function easeOut(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

export function Clerk() {
  let inViewRef = useRef(null)
  let isInView = useInView(inViewRef)
  return (
    <span className="tailwind">
      <section
        ref={inViewRef}
        className="h-[430px] w-full overflow-hidden py-8 sm:h-[480px] pb-24 mb-24"
      >
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col">
          <div className="absolute -top-1 inline-flex w-fit self-center rounded-md ring-black/[0.07] px-6 pt-1 pb-1.5 text-[12px] font-medium tracking-tighter text-[#B2B2B2] shadow-[inset_0px_1px_1px_rgba(0,0,0,0.07),inset_1px_0px_1px_rgba(0,0,0,0.07),inset_-1px_0px_1px_rgba(0,0,0,0.07)] [mask:linear-gradient(180deg,black,black_54%,transparent)] dark:ring-white/[0.07] dark:text-white dark:shadow-[inset_0px_1px_1px_rgba(255,255,255,0.07),inset_1px_0px_1px_rgba(255,255,255,0.07),inset_-1px_0px_1px_rgba(255,255,255,0.07)] ">
            Sponsored by
          </div>
          <div className="flex flex-1 items-center justify-center">
            <AnimatedLogo />
          </div>
          <div className="relative isolate flex flex-1 flex-col items-center justify-between">
            <div className="absolute -top-5 z-50 h-10 w-full [mask:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] before:absolute before:inset-0 before:top-5 before:h-[1px] before:bg-gradient-to-r before:from-[#AE48FF] before:via-[#6C47FF] before:via-[25%] before:to-[#18CCFC] before:opacity-50 before:blur-[2px] after:absolute after:inset-0 after:left-1/2 after:top-5 after:h-[1px] after:w-3/4 after:-translate-x-1/2 after:bg-gradient-to-r after:from-[#AE48FF] after:via-[#6C47FF] after:via-[25%] after:to-[#18CCFC] after:[mask:linear-gradient(90deg,transparent,black,black,transparent)]">
              <motion.div
                initial={{ x: "-100%" }}
                animate={isInView ? { x: "100%" } : {}}
                transition={{
                  delay: 2.5,
                  duration: isInView ? 1 : 0,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="absolute inset-x-0 top-5 z-10 h-[1px] bg-gradient-to-l from-white/75 to-transparent to-50% dark:from-white/25"
              />
            </div>
            <div className="absolute inset-0 isolate -z-10 overflow-hidden before:absolute before:inset-0 before:bg-[url(/img/background-pattern.svg)] before:[mask:radial-gradient(ellipse_farthest-side_at_50%_-25vw,black,transparent)] dark:before:opacity-10">
              <div className="absolute left-1/2 top-0 h-12 w-1/2 -translate-x-1/2 -translate-y-3/4 rounded-[50%] bg-gradient-to-r from-[#AE48FF] via-[#6C47FF] via-[25%] to-[#18CCFC] opacity-20 blur-xl" />
            </div>

            <h2>
              <span className="sr-only">Clerk complete user management</span>
            </h2>

            <p className="text-center text-base leading-tight dark:text-white tracking-tight">
              More than authentication...
              <br />
              <span className="text-2xl font-bold text-[#6C47FF] sm:text-[28px]">
                Complete user management.
              </span>
            </p>

            <div className="relative isolate">
              <a
                href="https://clerk.com?utm_source=sponsorship&utm_medium=website&utm_campaign=authjs&utm_content=09_01_2023"
                className="relative isolate inline-flex h-8 items-center gap-1.5 rounded-[8px] px-4 text-[13px] font-semibold text-white before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:shadow-lg before:shadow-[rgb(100_48_247/0.3)] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[#6C47FF] after:shadow-[inset_0px_-8px_16px_-4px_#6430F7,inset_0px_0px_1px_1px_theme(colors.white/4%),inset_0px_1px_0px_theme(colors.white/10%),0px_0px_0px_1px_#6C47FF] dark:before:shadow-black"
              >
                <span className="z-20 flex items-center gap-1.5 bg-gradient-to-b from-white from-50% to-[#D7D4FF] bg-clip-text text-transparent drop-shadow-[0px_1px_1px_rgb(86_30_227/60%)]">
                  <span>Get started for free</span>
                  <ArrowIcon />
                </span>
              </a>

              {[0, 1, 2, 3].map((i) => (
                <Ring key={i} i={i} isInView={isInView} />
              ))}
            </div>

            <div className="absolute left-1/2 top-0 -z-10 h-[140px] w-3/4 -translate-x-1/2 -translate-y-1/3 rotate-12 transform-gpu rounded-[50%] bg-gradient-to-r from-[#6C47FF] via-[#4818BF] via-25% to-sky-500 opacity-10 blur-3xl" />
          </div>
        </div>
      </section>
    </span>
  )
}

function Ring({ i, isInView }) {
  const transition = {
    delay: i * 1,
    duration: 4,
    ease: "linear",
    repeat: Infinity,
    times: [0, 0.1, 1],
  }

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[275%] w-[135%] rounded-[22px] border border-[#6C47FF]/[.15] dark:border-[#6C47FF]/25"
      style={{ x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scaleX: 0.75, scaleY: 0.4 }}
      animate={isInView ? { opacity: [0, 1, 0], scaleX: 1, scaleY: 1 } : {}}
      transition={isInView ? transition : {}}
    />
  )
}

function ArrowIcon() {
  const id = useId()

  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.25 4.00144L5.78125 0.78125M9.25 4.00144L5.78125 7.21875M9.25 4.00144H0.765625"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={id}
          x1="4.50"
          y1="0.50"
          x2="4.50"
          y2="7.50"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.50" stopColor="white" />
          <stop offset="1" stopColor="#D7D4FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AnimatedLogo() {
  let inViewRef = useRef(null)
  let isInView = useInView(inViewRef, {
    amount: "all",
    margin: "0px 0px -200px 0px",
    once: true,
  })

  let [isAnimationFinished] = useState(false)

  let wrapperContainer = useAnimationControls()
  let iconContainer = useAnimationControls()

  let iconShapeMono = useAnimationControls()
  let iconPathMono = useAnimationControls()
  let startCapMono = useAnimationControls()
  let endCapMono = useAnimationControls()

  let iconPathSpectrumContainer = useAnimationControls()
  let iconPathSpectrum = useAnimationControls()
  let startCapSpectrum = useAnimationControls()
  let endCapSpectrum = useAnimationControls()

  let iconDot = useAnimationControls()

  let logoType = useAnimationControls()

  useEffect(() => {
    async function startAnimationSequence() {
      await Promise.all([
        iconContainer.start({
          rotate: -135,
          transition: { duration: animationDuration, ease: easeOut },
        }),
        startCapMono.start({ opacity: 1, transition: { duration: 0.1 } }),
        endCapMono.start({
          opacity: 1,
          rotate: 0,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.1 },
          },
        }),
        iconPathMono.start({
          opacity: 1,
          pathLength: 1,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.1 },
          },
        }),
      ])

      await Promise.all([
        iconShapeMono.start({ opacity: 1, transition: { duration: 0 } }),
        startCapMono.start({ opacity: 0, transition: { duration: 0 } }),
      ])

      await Promise.all([
        iconContainer.start({
          rotate: 0,
          transition: { duration: animationDuration, ease: easeOut },
          x: 0,
        }),
        endCapMono.start({
          opacity: 1,
          rotate: -180,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.1 },
          },
        }),
        iconPathMono.start({
          opacity: 1,
          pathLength: 0,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.1 },
          },
        }),
        iconPathSpectrumContainer.start({
          rotate: 0,
          transition: { duration: animationDuration, ease: easeOut },
        }),
        iconPathSpectrum.start({
          opacity: 1,
          pathLength: 1,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.1 },
          },
        }),
        endCapSpectrum.start({
          opacity: 1,
          transition: { duration: 0.1 },
        }),
        startCapSpectrum.start({
          opacity: 1,
          rotate: 0,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.1 },
          },
        }),
        iconDot.start({
          opacity: 1,
          scale: 1,
          transition: {
            duration: animationDuration,
            ease: easeOut,
            opacity: { duration: 0.2 },
          },
        }),
        logoType.start({
          WebkitMaskPosition: "100% 0%",
          opacity: 1,
          transition: {
            WebkitMaskPosition: {
              duration: animationDuration * 3,
              ease: easeOut,
            },
            duration: animationDuration,
            ease: easeOut,
          },
          x: 0,
        }),
      ])

      // setIsAnimationFinished(true)

      return
    }

    if (isInView) {
      startAnimationSequence()
    }
  }, [
    iconContainer,
    endCapMono,
    iconDot,
    iconPathMono,
    iconShapeMono,
    logoType,
    startCapMono,
    wrapperContainer,
    iconPathSpectrumContainer,
    iconPathSpectrum,
    endCapSpectrum,
    startCapSpectrum,
    isInView,
  ])

  return (
    <motion.div
      ref={inViewRef}
      animate={wrapperContainer}
      className="relative isolate flex scale-75 items-center gap-2 sm:scale-100"
    >
      {!isAnimationFinished && (
        <motion.div
          style={{ x: "138%" }}
          animate={iconContainer}
          className="relative"
        >
          <motion.svg
            initial={{ opacity: 0 }}
            animate={iconShapeMono}
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.0101 27.8385C25.4355 28.2639 25.3928 28.9682 24.8929 29.303C22.3497 31.0065 19.2909 32 16 32C12.7091 32 9.65026 31.0065 7.10707 29.303C6.60723 28.9682 6.56452 28.2639 6.98992 27.8385L10.6439 24.1845C10.9741 23.8543 11.4864 23.8021 11.9021 24.0151C13.1312 24.6447 14.5241 25 16 25C17.4759 25 18.8688 24.6447 20.0979 24.0151C20.5136 23.8021 21.0259 23.8543 21.3561 24.1845L25.0101 27.8385Z"
              className="fill-[#1C0452] dark:fill-white"
            />
            <path
              d="M24.8929 2.697C25.3928 3.0318 25.4355 3.73609 25.0101 4.16149L21.3561 7.81545C21.0259 8.14569 20.5135 8.19786 20.0979 7.98491C18.8688 7.35525 17.4759 7 16 7C11.0294 7 7 11.0294 7 16C7 17.4759 7.35525 18.8688 7.98491 20.0979C8.19786 20.5135 8.14569 21.0259 7.81545 21.3561L4.16149 25.0101C3.73609 25.4355 3.0318 25.3928 2.697 24.8929C0.993528 22.3497 0 19.2909 0 16C0 7.16344 7.16344 0 16 0C19.2909 0 22.3497 0.993528 24.8929 2.697Z"
              className="fill-[#1C0452] dark:fill-white"
            />
          </motion.svg>

          <svg
            className="absolute inset-0"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              className="stroke-[#1C0452] dark:stroke-white"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={iconPathMono}
              d="M4.7719 21.5C3.95737 19.8403 3.5 17.9736 3.5 16C3.5 9.09644 9.09644 3.5 16 3.5C17.5864 3.5 19.1037 3.79551 20.5 4.33449C25.1801 6.14103 28.5 10.6828 28.5 16C28.5 22.9036 22.9036 28.5 16 28.5C14.0264 28.5 11.875 27.9297 10.25 27.1016"
              strokeWidth="7"
              fill="none"
            />
            <motion.path
              className="fill-[#1C0452] dark:fill-white"
              initial={{ opacity: 0 }}
              animate={startCapMono}
              d="M7.8413 19.8045L1.49564 22.7635C1.84251 23.5061 2.24473 24.2177 2.697 24.8929C3.0318 25.3927 3.73609 25.4355 4.16149 25.0101L7.81545 21.3561C8.14569 21.0259 8.19786 20.5135 7.98492 20.0979C7.93533 20.0011 7.88745 19.9033 7.8413 19.8045Z"
            />
          </svg>

          {/* End cap */}
          <motion.svg
            initial={{ opacity: 0, rotate: -322 }}
            animate={endCapMono}
            className="absolute inset-0 fill-[#1C0452] dark:fill-white"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.10709 29.303C6.60725 28.9682 6.56454 28.2639 6.98994 27.8385L10.6439 24.1846C10.9741 23.8543 11.4865 23.8021 11.9021 24.0151C11.9989 24.0647 12.0967 24.1126 12.1955 24.1587L9.23649 30.5044C8.49388 30.1575 7.78231 29.7553 7.10709 29.303Z" />
          </motion.svg>

          <svg
            className="absolute inset-0 fill-[#1C0452] dark:fill-white"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              initial={{ opacity: 0, scale: 0.75 }}
              animate={iconDot}
              cx="16"
              cy="16"
              r="5"
            />
          </svg>

          <motion.svg
            initial={{ rotate: 180 }}
            animate={iconPathSpectrumContainer}
            className="absolute inset-0"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={iconPathSpectrum}
              d="M21.6661,4.85498C21.2881,4.66241 20.899,4.48851 20.5,4.33449C19.1037,3.79551 17.5864,3.5 16,3.5C9.09644,3.5 3.5,9.09644 3.5,16C3.5,17.9736 3.95737,19.8403 4.7719,21.5"
              stroke="url(#paint0_linear_45_194)"
              strokeWidth="7"
            />

            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={endCapSpectrum}
              d="M25.0101 4.16148C25.4355 3.73608 25.3927 3.03179 24.8929 2.69699C24.8134 2.64375 24.7335 2.59121 24.653 2.53938C24.0497 2.15079 23.4187 1.80165 22.7635 1.49561L19.8045 7.84128L19.8069 7.84239C19.9048 7.88819 20.0019 7.93571 20.0979 7.9849C20.5135 8.19784 21.0259 8.14568 21.3561 7.81543L25.0101 4.16148Z"
              fill="url(#paint0_linear_45_213)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_45_194"
                x1="24.5"
                y1="3.5"
                x2="3.5"
                y2="24.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#56C2FF" />
                <stop offset="0.66" stopColor="#6C47FF" />
                <stop offset="1" stopColor="#9C49FE" />
              </linearGradient>
              <linearGradient
                id="paint0_linear_45_213"
                x1="3.5"
                y1="25"
                x2="25.4653"
                y2="3.98633"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9B48FD" />
                <stop offset="0.389423" stopColor="#6C47FF" />
                <stop offset="1" stopColor="#55C1FF" />
              </linearGradient>
            </defs>
          </motion.svg>

          <motion.svg
            initial={{ opacity: 0, rotate: 322 }}
            animate={startCapSpectrum}
            className="absolute inset-0"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.55694 22.8933C1.88964 23.5891 2.27113 24.2571 2.697 24.8929C2.7783 25.0143 2.8814 25.1087 2.99701 25.176C3.29792 25.3512 3.68357 25.3427 3.99016 25.1477C4.05078 25.1091 4.10831 25.0632 4.16149 25.0101L7.81544 21.3561C7.85673 21.3148 7.89366 21.2707 7.92628 21.2243C8.15459 20.8993 8.17124 20.4616 7.98491 20.0979C7.97999 20.0883 7.97509 20.0787 7.9702 20.069C7.92584 19.9817 7.88287 19.8935 7.8413 19.8045L1.49563 22.7635C1.51588 22.8069 1.53632 22.8501 1.55694 22.8933Z"
              fill="url(#paint0_linear_45_202)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_45_202"
                x1="3.5"
                y1="25"
                x2="25.4653"
                y2="3.98633"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9B48FD" />
                <stop offset="0.33" stopColor="#6C47FF" />
                <stop offset="1" stopColor="#55C1FF" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>
      )}

      {isAnimationFinished && (
        <svg
          width={width}
          height={height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.0101 27.8385C25.4355 28.2639 25.3928 28.9682 24.8929 29.303C22.3497 31.0064 19.2909 32 16 32C12.7091 32 9.65028 31.0064 7.10708 29.303C6.60725 28.9682 6.56453 28.2639 6.98993 27.8385L10.6439 24.1845C10.9741 23.8543 11.4864 23.8021 11.9021 24.0151C13.1312 24.6447 14.5241 25 16 25C17.4759 25 18.8688 24.6447 20.0979 24.0151C20.5136 23.8021 21.0259 23.8543 21.3561 24.1845L25.0101 27.8385Z"
            className="fill-[#1C0452] dark:fill-white"
          />
          <circle
            className="fill-[#1C0452] dark:fill-white"
            cx="16"
            cy="16"
            r="5"
          />
          <path
            d="M4.7719 21.5C3.95737 19.8403 3.5 17.9736 3.5 16C3.5 9.09644 9.09644 3.5 16 3.5C17.5864 3.5 19.1037 3.79551 20.5 4.33449C20.899 4.48851 21.2881 4.66241 21.6661 4.85498"
            stroke="url(#paint0_linear_52_261)"
            strokeWidth="7"
          />
          <path
            d="M1.55691 22.8933C1.88961 23.5891 2.2711 24.2571 2.69697 24.8929C2.77828 25.0143 2.88138 25.1087 2.99698 25.176C3.29789 25.3512 3.68354 25.3427 3.99013 25.1477C4.05075 25.1091 4.10828 25.0632 4.16146 25.0101L7.81542 21.3561C7.8567 21.3148 7.89363 21.2707 7.92625 21.2243C8.15456 20.8993 8.17121 20.4616 7.98488 20.0979C7.97996 20.0883 7.97506 20.0787 7.97017 20.069C7.92581 19.9817 7.88284 19.8935 7.84127 19.8045L1.49561 22.7635C1.51585 22.8069 1.53629 22.8501 1.55691 22.8933Z"
            fill="url(#paint1_linear_52_261)"
          />
          <path
            d="M25.0101 4.16148C25.4355 3.73608 25.3928 3.03179 24.8929 2.69699C24.8135 2.64375 24.7335 2.59121 24.653 2.53938C24.0498 2.15079 23.4187 1.80165 22.7635 1.49561L19.8045 7.84128L19.8069 7.84239C19.9049 7.88819 20.0019 7.93571 20.0979 7.9849C20.5136 8.19784 21.0259 8.14568 21.3561 7.81543L25.0101 4.16148Z"
            fill="url(#paint2_linear_52_261)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_52_261"
              x1="24.5"
              y1="3.5"
              x2="3.5"
              y2="24.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#56C2FF" />
              <stop offset="0.66" stopColor="#6C47FF" />
              <stop offset="1" stopColor="#9C49FE" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_52_261"
              x1="3.49997"
              y1="25"
              x2="25.4652"
              y2="3.98633"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9B48FD" />
              <stop offset="0.389423" stopColor="#6C47FF" />
              <stop offset="1" stopColor="#55C1FF" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_52_261"
              x1="3.50003"
              y1="25"
              x2="25.4653"
              y2="3.98633"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9B48FD" />
              <stop offset="0.389423" stopColor="#6C47FF" />
              <stop offset="1" stopColor="#55C1FF" />
            </linearGradient>
          </defs>
        </svg>
      )}

      <motion.svg
        className="fill-[#1C0452] [mask-image:linear-gradient(90deg,transparent_30%,black_60%)] [mask-size:300%_100%] dark:fill-white"
        initial={{ WebkitMaskPosition: "0% 0%", opacity: 0, x: "-20%" }}
        animate={logoType}
        width={67 * 3}
        height={22 * 3}
        viewBox="0 0 67 22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.1071 0H20.7394V21.7459H17.1071V0ZM12.407 17.1147C11.887 17.6425 11.2626 18.061 10.5719 18.3447C9.88121 18.6285 9.13867 18.7713 8.3897 18.7646C7.75719 18.7834 7.12745 18.6751 6.53933 18.4465C5.9512 18.2179 5.41705 17.8738 4.96982 17.4354C4.15743 16.6055 3.68984 15.4206 3.68984 14.0081C3.68984 11.1806 5.56976 9.24662 8.3897 9.24662C9.14602 9.2362 9.89539 9.38947 10.5842 9.69537C11.2731 10.0014 11.8844 10.4525 12.3746 11.0165L14.8145 8.90395C13.2245 7.01405 10.6446 6.03728 8.19471 6.03728C3.39992 6.03728 0 9.27362 0 14.035C0 16.39 0.844958 18.373 2.2699 19.7732C3.69483 21.1735 5.72483 21.996 8.06721 21.996C11.1096 21.996 13.537 20.7867 14.8995 19.2665L12.407 17.1147ZM38.3352 13.8163C38.3285 14.2935 38.2951 14.77 38.2352 15.2436H26.7081C27.188 17.4296 28.8731 18.7638 31.208 18.7638C31.964 18.7796 32.7135 18.6246 33.3986 18.3109C34.0836 17.9971 34.6856 17.5331 35.1578 16.9547L35.2753 17.0526L37.6553 19.1163C36.3228 20.7761 34.1003 22 31.013 22C26.4131 22 22.9433 18.8274 22.9433 14.0073C22.9433 11.6425 23.7607 9.65951 25.1231 8.25928C25.8423 7.53925 26.7044 6.971 27.6563 6.58957C28.6081 6.20813 29.6297 6.02156 30.6579 6.04136C35.3202 6.04136 38.3352 9.30707 38.3352 13.8163ZM27.7356 10.5262C27.2625 11.0604 26.9303 11.7 26.7681 12.389H34.6678C34.2203 10.5164 32.9203 9.24586 30.8454 9.24586C30.2635 9.22748 29.6844 9.3324 29.1476 9.5533C28.611 9.77433 28.1292 10.1062 27.7356 10.5262ZM49.5641 5.99467V9.96047C49.1441 9.92871 48.7217 9.89682 48.4642 9.89682C45.7142 9.89682 44.1543 11.8308 44.1543 14.3694V21.7454H40.527V6.21501H44.1543V8.56754H44.1869C45.4193 6.91759 47.1867 5.99958 49.1117 5.99958L49.5641 5.99467ZM55.3999 18.0984L58.0223 15.2414H58.0898L62.2047 21.7459H66.287L60.4872 12.5143L66.187 6.26454H61.8772L55.3999 13.3393V0H51.77V21.7459H55.3999V18.0984Z"
        />
      </motion.svg>
    </motion.div>
  )
}
