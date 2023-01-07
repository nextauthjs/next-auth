// eslint-disable-next-line no-use-before-define
import * as React from "react"
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider"
import styles from "./ProviderMarqueeStyle.module.css"

const icons = [
  "/providers/apple.svg",
  "/providers/auth0.svg",
  "/providers/cognito.svg",
  "/providers/battlenet.svg",
  "/providers/box.svg",
  "/providers/facebook.svg",
  "/providers/github.svg",
  "/providers/gitlab.svg",
  "/providers/google.svg",
  "/providers/okta.svg",
  "/providers/slack.svg",
  "/providers/spotify.svg",
  "/providers/twitter.svg",
]

export default React.memo(function ProviderMarquee() {
  let scale = 0.4

  if (typeof window !== "undefined") {
    const width = window.outerWidth
    if (width > 800) {
      scale = 0.6
    }

    if (width > 1100) {
      scale = 0.7
    }

    if (width > 1400) {
      scale = 0.8
    }
  }

  return (
    <div className={styles.fullWidth}>
      <div className={styles.height}>
        <Marquee
          key="1"
          velocity={5}
          scatterRandomly
          minScale={0.5}
          resetAfterTries={200}
        >
          {icons.map((icon) => (
            <Motion
              key={`company-${icon}`}
              initDeg={randomIntFromInterval(0, 360)}
              direction={Math.random() > 0.5 ? "clockwise" : "counterclockwise"}
              velocity={10}
              radius={scale * 70}
            >
              <div
                className={styles.company}
                style={{ height: `${scale * 75}px`, width: `${scale * 75}px` }}
              >
                <div
                  className={styles.circle}
                  style={{
                    height: `${scale * 150}px`,
                    width: `${scale * 150}px`,
                  }}
                >
                  <img className={styles.logo} src={icon} alt="" />
                </div>
              </div>
            </Motion>
          ))}
        </Marquee>
      </div>
    </div>
  )
})
