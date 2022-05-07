import React from "react"
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider"
import styles from "./ProviderMarqueeStyle.module.css"

const icons = [
  "/img/providers/apple-black.svg",
  "/img/providers/auth0.svg",
  "/img/providers/aws-cognito.svg",
  "/img/providers/battle.net.svg",
  "/img/providers/box.svg",
  "/img/providers/facebook-2.svg",
  "/img/providers/github-1.svg",
  "/img/providers/gitlab.svg",
  "/img/providers/google-icon.svg",
  "/img/providers/okta-3.svg",
  "/img/providers/openid.svg",
  "/img/providers/slack.svg",
  "/img/providers/spotify.svg",
  "/img/providers/twitter.svg",
]

const ProviderMarquee = React.memo(() => {
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
              key={`marquee-example-company-${icon}`}
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

export default ProviderMarquee
