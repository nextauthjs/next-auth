import styled from 'styled-components'

export const Circle = styled.div`
  position: absolute;
  object-position: center center;
  will-change: transform, opacity;
  width: ${props => props.scale * 150}px;
  height: ${props => props.scale * 150}px;
  top: -50%;
  left: -50%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`

export const Logo = styled.img`
  display: block;
  width: 65%;
  height: 65%;
  filter: grayscale(100%);
  opacity: 0.4;
`

export const FullWidth = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: 2rem;
  margin-top: 4rem;
`

export const Height = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.height ? props.height + 'px' : 'auto')};
`

export const Company = styled.div`
  position: relative;
  width: ${props => props.scale * 75}px;
  height: ${props => props.scale * 75}px;
`
