// eslint-disable-next-line no-use-before-define
import * as React from "react"
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider"
import styles from "./ProviderMarqueeStyle.module.css"

const icons = [
  "/img/providers/apple.svg",
  "/img/providers/auth0.svg",
  "/img/providers/cognito.svg",
  "/img/providers/descope.svg",
  "/img/providers/battlenet.svg",
  "/img/providers/box.svg",
  "/img/providers/facebook.svg",
  "/img/providers/github.svg",
  "/img/providers/gitlab.svg",
  "/img/providers/google.svg",
  "/img/providers/okta.svg",
  "/img/providers/slack.svg",
  "/img/providers/spotify.svg",
  "/img/providers/twitter.svg",
]

function changeScale() {
  if (typeof window !== "undefined") {
    const width = window.outerWidth

    if (width > 800) return 0.6
    else if (width > 1100) return 0.7
    else if (width > 1400) return 0.8
  }
}

export default React.memo(function ProviderMarquee() {
  // Get initial scale on load
  const [scale, setScale] = React.useState(changeScale)

  React.useEffect(() => {
    // Account for window size change
    function handleEvent() {
      setScale(changeScale)
    }

    window.addEventListener("resize", handleEvent)
    return () => window.removeEventListener("resize", handleEvent)
  }, [])

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
