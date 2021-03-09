// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'reactstrap';
import moment, { Moment } from 'moment-timezone';
import { findOneIana } from "windows-iana";
import { TodoTask } from 'microsoft-graph';
import TodoRow from './TodoRow'
import { config } from './Config';
import { getUserTodosYesterday } from './GraphService';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import './Calendar.css';

interface TodoState {
  todosLoaded: boolean;
  todos: TodoTask[];
}

class Todo extends React.Component<AuthComponentProps, TodoState> {
  constructor(props: any) {
    super(props);

    this.state = {
      todosLoaded: false,
      todos: []
    };
  }

  async componentDidUpdate() {
    if (this.props.user && !this.state.todosLoaded)
    {
      try {
        // Get the user's access token
        var accessToken = await this.props.getAccessToken(config.scopes);

        // Get the user's events
        var todos = await getUserTodosYesterday(accessToken);

        // Update the array of events in state
        this.setState({
          todosLoaded: true,
          todos: todos
        });
      }
      catch (err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
    }
  }

  // <renderSnippet>
  render() {

    return (
      <div>
        <div className="calendar-week">
          <div className="table-responsive">
            <Table size="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                <TodoRow todos={this.state.todos } />
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
  // </renderSnippet>
}

export default withAuthProvider(Todo);
