import styled from 'styled-components'

const Form = styled.form`
  margin: 80px auto 0;
  width: 75%;
  max-width: 30em;
  .formgroup {
    position: relative;
    display: block;
    margin: 10px auto 0;
    label {
      font-size: 14px;
    }
    input,
    textarea {
      border-radius: 5px;
      border: 1px solid #eee;
      padding: 5px 0;
      width: 100%;
    }
    .input-success {
      font-size: 24px;
      color: green;
      position: absolute;
      top: 17px;
      right: -2px;
    }
    .input-fail {
      color: red;
      font-size: 13px;
    }
  }
  .selection {
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    p,
    label {
      font-size: 13px;
      margin: 0 3px;
    }
  }
`
export default Form
