import React from 'react'
import Marquee, { Motion, randomIntFromInterval } from 'react-marquee-slider'
import * as S from './ProviderMarqueeStyle'
import times from 'lodash.times'

const icons = [
  '/img/providers/apple-black.svg',
  '/img/providers/auth0.svg',
  '/img/providers/aws-cognito.svg',
  '/img/providers/box.svg',
  '/img/providers/facebook-2.svg',
  '/img/providers/github-1.svg',
  '/img/providers/gitlab.svg',
  '/img/providers/google-icon.svg',
  '/img/providers/okta-3.svg'
]

const ProviderMarquee = React.memo(({ size }) => {
  let scale = 0.5

  if (typeof window !== 'undefined') {
    const width = window.outerWidth
    if (width > 800) {
      scale = 0.65
    }

    if (width > 1100) {
      scale = 0.7
    }

    if (width > 1400) {
      scale = 0.9
    }
  }

  return (
    <S.FullWidth>
      <S.Height height={300}>
        <Marquee
          key='1'
          velocity={17}
          scatterRandomly
          minScale={0.5}
          resetAfterTries={200}
        >
          {times(9, Number).map(id => (
            <Motion
              key={`marquee-example-company-${id}`}
              initDeg={randomIntFromInterval(0, 360)}
              direction={Math.random() > 0.5 ? 'clockwise' : 'counterclockwise'}
              velocity={10}
              radius={scale * 70}
            >
              <S.Company scale={scale}>
                <S.Circle scale={scale}>
                  <S.Logo src={icons[id]} alt='' />
                </S.Circle>
              </S.Company>
            </Motion>
          ))}
        </Marquee>
      </S.Height>
    </S.FullWidth>
  )
})

export default ProviderMarquee
