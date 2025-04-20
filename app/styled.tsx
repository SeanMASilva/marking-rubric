import styled from "styled-components";

const OptionMarking_ = styled.div`
  padding-left: 1em;
  display: flex;
  flex-direction: column;
  border: solid 1px #404040;
`;
const OneOfGroup_ = styled.div`
  padding-left: 1em;
`;
const ManyGroup_ = styled.div`
  padding-left: 1em;
`;

const GroupMarking_ = styled.div`
  padding-left: 1em;
  border: solid 1px #404040;
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
  padding: 8px;
`;

const Button = styled.button`
  display: block;
  padding: 8px;
  border: 1px solid #222222;
  &:hover {
    background: #444444
  }
`;


export {OptionMarking_, OneOfGroup_, ManyGroup_, RadioInput, TextInput, Button, Label, GroupMarking_, Row, TextAreaInput}