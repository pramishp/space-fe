import {createGlobalStyle} from "styled-components";

export const GlobalStyles = createGlobalStyle`
  canvas {
    background: ${({theme}) => theme.colors.body};
  }
`