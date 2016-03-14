import React from 'react';
import Relay from 'react-relay';
import { PanelH } from './Panel';
import { Link, browserHistory } from 'react-router';

class Mutations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: 'christian'
    };
  }
  infogespraechDokumentieren(infogespraech) {
    var onSuccess = () => {
      console.log('InfogespraechDokumentierenMutation successful!');
    };
    var onFailure = (transaction) => {
      var error = transaction.getError() || new Error('InfogespraechDokumentierenMutation failed.');
      console.error(error);
    };

    infogespraech.infogespraechId =' foobar-id',
    infogespraech.titel = 'foobar titel',
    infogespraech.beschreibung = 'foobar beschreibung',
    infogespraech.start = new Date(),
    infogespraech.ende = new Date(),
    infogespraech.betreuerIds = ['A-betreuerId','B-betreuerId','C-betreuerId'],
    infogespraech.teilnehmerId = 'foobar-teilnehmerId',
    infogespraech.leistungen = [{
      id: 'A-Leistung-Id',
      leistungId: 'A-Leistung-Id',
      art: 1,
      start: new Date(),
      ende: new Date(),
      erfasstZuBetreuerId: 'A-erfasstZuBetreuerId'
    }],
    infogespraech.dokumentiertVonBetreuerId = 'B-dokumentiertVonBetreuerId',
    infogespraech.dokumentiertAm = new Date(),

    Relay.Store.commitUpdate(new InfogespraechDokumentierenMutation({infogespraech:infogespraech}), {onFailure, onSuccess});
  };
  setLoginName(e) {
    this.props.relay.setVariables({
      loginName: e.target.value,
    });
  };
  render() {
    return (
      <main className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <h1>Mutations Tests</h1>
            <ul>
              <li><button className="btn btn-link" onClick={this.infogespraechDokumentieren.bind(this, {})}>Infogespraech dokumentieren</button></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h1>Form Tests</h1>
            <input type="text" value={this.state.loginName} onChange={this.setLoginName.bind(this)} />
          </div>
        </div>
      </main>
    );
  }
}

class InfogespraechDokumentierenMutation extends Relay.Mutation {
  getVariables() {
    return {
      infogespraechId: this.props.infogespraech.infogespraechId,
      titel: this.props.infogespraech.titel,
      beschreibung: this.props.infogespraech.beschreibung,
      start: this.props.infogespraech.start,
      ende: this.props.infogespraech.ende,
      betreuerIds: this.props.infogespraech.betreuerIds,
      teilnehmerId: this.props.infogespraech.teilnehmerId,
      leistungen: this.props.infogespraech.leistungen,
      dokumentiertVonBetreuerId: this.props.infogespraech.dokumentiertVonBetreuerId,
      dokumentiertAm: this.props.infogespraech.dokumentiertAm,
    };
  }
  getConfigs() {
    return [];
  }
  getFatQuery() {
    return Relay.QL`
      fragment on InfogespraechDokumentierenPayload{done}
    `;
  }
  getMutation() {
    return Relay.QL`mutation InfogespraechDokumentieren{infogespraechDokumentieren}`;
  }
}

export default Relay.createContainer(Mutations, {
  prepareVariables(params){
    return {
      loginName: params.loginName || 'christian'
    };
  },
  fragments: {
    AHG: () => Relay.QL`
      fragment on AHG {
        loggedInBetreuer(login: $loginName) {
          vorname,
          nachname,
          kuerzel,
          bild,
          betreuerId,
          klienten {
            id,
            klientId,
            nummer,
            aufnahmeArt,
            nachname,
            vorname,
            geburtstag,
            bild,
            aufnahmeDatum,
            summeDerLeistungenInMinuten,
            belege {
              klientId,
              klientenVorname,
              klientenNachname,
              klientNummer,
              klientOffeneLeistungenInMinuten,
              klientAufnhameDatum,
              betreuerVorname,
              betreuerNachname,
              belegNummer,
              belegId,
              belegStart,
              belegEnde,
              belegSummeLeistungenInMinuten,
              belegIsOffen,
              einrichtungId,
              einrichtungName
            }
          }
        }
      }
    `
  }
});
