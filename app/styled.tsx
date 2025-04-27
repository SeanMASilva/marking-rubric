import styled from "styled-components";
import React from "react";

const OptionMarking_ = styled.div`
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  border: solid 1px #404040;
  background-color: light-dark(#${props => `${((15 - props?.depth) || 16)?.toString(16).repeat(3)}`},#${props => `${props.depth?.toString(16).repeat(3)}`});
`;

const GroupMarking_ = styled.div`
  padding: 8px 0 0 1em;
  border: solid 1px #404040;
  background-color: light-dark(#${props => `${((15 - props?.depth) || 16)?.toString(16).repeat(3)}`},#${props => `${props.depth?.toString(16).repeat(3)}`});
`;
const RadioInput = styled.input`
margin-right: 8px;
`;

const TextInput = styled.input`
  margin: 0 8px;
  border: solid 1px #404040;
  width: 100%;
`;

const TextAreaInput = styled.textarea`
  margin: 0 8px;
  border: solid 1px #404040;
  width: 100%;
`;

const Label = styled.label`
  /* margin-right: 8px; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Card_ = styled.dialog`
  &[open]{
    display: flex;
  }
  place-self: center;
  min-width: 100px;
  min-height: 100px;
`;

function Card({children, title, ref} : {children: React.ReactNode, title: string, ref:React.RefObject<HTMLDialogElement | null>}) {
  return (
    <Card_ ref={ref} onClick={e => {
      const target = e.target as HTMLElement
      if (target.isEqualNode(ref.current)) {
        ref.current?.close()
      }
    }}>
      <div style={{
        flex: '0 1 auto',
      }}>
        <Row style={{justifyContent:'space-between'}}>
          <h2 style={{margin:'8px'}}>{title}</h2>
          <Button onClick={() => ref.current?.close()}>X</Button>
        </Row>
        <Row style={{height: '2px', backgroundColor:"light-dark(#ddd, #333)"}}></Row>
        <div style={{padding:'8px'}}> {children}</div>
      </div>
    </Card_>
  )
}
const Button = styled.button`
  display: block;
  padding: 8px;
  border: 1px solid #222222;
  background-color: light-dark(#eee, #222);
  &:hover {
    filter: brightness(150%)
  }
`;


export {Card, OptionMarking_, RadioInput, TextInput, Button, Label, GroupMarking_, Row, TextAreaInput}