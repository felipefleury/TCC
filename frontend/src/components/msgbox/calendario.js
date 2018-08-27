import * as React from 'react';

export default class Calendario extends React.Component {
  componentDidMount() {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });
  }

  render() {
    return (
      <div class="input-field ">
        <input id="data" type="text" class="datepicker" />
        <label for="data">Selecione a data</label>
      </div>
    );
  }
}


