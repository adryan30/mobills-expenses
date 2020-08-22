import styled from "styled-components";

export const Center = styled.div`
  margin-top: 10px;
  width: 100vw;
  display: grid;
  place-items: center;
`;

export const Responsive = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 700px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;
