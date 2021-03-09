// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment-timezone';
import { TodoTask } from 'microsoft-graph';
import { config } from './Config';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import CalendarDayRow from './CalendarDayRow';
import './Calendar.css';
import { getUserTodosYesterday } from './GraphService';

interface CalendarState {
  eventsLoaded: boolean;
  todos: TodoTask[];
}

class Calendar extends React.Component<AuthComponentProps, CalendarState> {
  constructor(props: any) {
    super(props);

    this.state = {
      eventsLoaded: false,
      todos: []
    };
  }

  async componentDidUpdate() {
    if (!this.state.eventsLoaded)
    {
      try {
        // Get the user's access token
        var accessToken = await this.props.getAccessToken(config.scopes);

        // Get the user's items
        var todos = await getUserTodosYesterday(accessToken);

        // Update the array of events in state
        this.setState({
          eventsLoaded: true,
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
    let todosByDate = this.getTodosByDate(this.state.todos);

    return (
      <div>
        <div className="calendar-week">
          <div className="table-responsive">
            <Table size="sm">
              <thead>
                <tr>
                  <th>Updated</th>
                  <th></th>
                  <th></th>
                  <th>ToDo</th>
                </tr>
              </thead>
              <tbody>
                {todosByDate.map(group => {
                  return (<CalendarDayRow
                    key={group.date.toISOString()}
                    date={group.date}
                    timeFormat='hh:mm tt'
                    todos={group.todos} />);
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
  // </renderSnippet>

  getTodosByDate(todos:TodoTask[]) : TodosForDate[] {
    let result:TodosForDate[] = [];

    todos.forEach(todo => {
      let todoMoment = moment(todo.lastModifiedDateTime);

      if(result.length && result[result.length-1].date.isSame(todoMoment, 'day')) {
        //It's the same day - push it to the list
        result[result.length-1].todos.push(todo);
      } else {
        //it's a different day, so create a new day
        result.push(new TodosForDate(todoMoment, todo));
      }
    });

    return result;
  }

}

class TodosForDate {
  todos:TodoTask[];
  date: moment.Moment;

  constructor(date:moment.Moment, todo:TodoTask){
    this.date = date;
    this.todos = [todo];
  }
}

export default withAuthProvider(Calendar);
