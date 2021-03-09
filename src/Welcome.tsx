// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <WelcomeSnippet>
import React from 'react';
import {
  Button,
  Jumbotron
} from 'reactstrap';

interface WelcomeProps {
  authButtonMethod: any;
}

interface WelcomeState {
  isOpen: boolean;
}

function WelcomeContent(props: WelcomeProps) {
  // Not authenticated, present a sign in button
  return <Button color="primary" onClick={props.authButtonMethod}>Click here to sign in</Button>;
}

export default class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  render() {
    return (
      <Jumbotron>
        <h1>What did I do yesterday?</h1>
        <p className="lead">
          This app shows you all the Microsoft ToDo tasks you completed yesterday.
        </p>
        <WelcomeContent
          authButtonMethod={this.props.authButtonMethod} />
      </Jumbotron>
    );
  }
}
// </WelcomeSnippet>
