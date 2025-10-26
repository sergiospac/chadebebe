import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --baby-pink: #FFE4E8;
    --baby-blue: #E4F1FF;
    --baby-green: #E4FFF4;
    --baby-yellow: #FFF9E4;
    --medium-pink: #FF9FB6;
    --medium-blue: #7FB5FF;
    --medium-green: #7FFFD4;
    --medium-yellow: #FFE5B4;
    --soft-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    --medium-shadow: 0 8px 20px rgba(64, 0, 64, 0.5);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(180deg, var(--baby-pink) 0%, var(--baby-blue) 100%);
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/gap_fundo.png');
    background-position: center;
    background-size: cover;
    opacity: 0.3;
    pointer-events: none;
    z-index: -1;
  }

  button {
    width: 100%;
    padding: 14px 24px;
    background: radial-gradient(#2196F3, #00BCD4);
    color: yellow;
    border: none;
    border-radius: 12px;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    font-size: 1em;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-bottom: 10px;
    box-shadow: var(--medium-shadow);
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Quicksand', sans-serif;
    color: var(--medium-blue);
  }

  input, select {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--baby-blue);
    border-radius: 12px;
    font-family: 'Open Sans', sans-serif;
    transition: all 0.3s ease;
  }

  input:focus, select:focus {
    outline: none;
    border-color: var(--medium-blue);
    box-shadow: 0 0 0 3px rgba(127, 181, 255, 0.2);
  }

  a {
    color: var(--medium-blue);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #5a9be6;
  }
`;

export default GlobalStyles; 