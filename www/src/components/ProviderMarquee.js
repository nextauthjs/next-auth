import React from 'react'
import Marquee, { Motion, randomIntFromInterval } from 'react-marquee-slider'
import * as S from './ProviderMarqueeStyle'
import times from 'lodash.times'

const icons = {
	0: '../../static/img/providers/apple-black.svg',
	1:'../../static/img/providers/auth0.svg' ,
	2:'../../static/img/providers/aws-cognito.svg' ,
	3:'../../static/img/providers/box.svg' ,
	4:'../../static/img/providers/facebook-2.svg',
	5:'../../static/img/providers/github-1.svg',
	6:'../../static/img/providers/gitlab.svg',
	7:'../../static/img/providers/google-icon.svg',
	8:'../../static/img/providers/okta-3.svg',
}

const ProviderMarquee = React.memo(({ size }) => {
  const width = window.outerWidth

  let scale = 0.5

  if (width > 800) {
    scale = 0.65
  }

  if (width > 1100) {
    scale = 0.8
  }

  if (width > 1400) {
    scale = 1
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
