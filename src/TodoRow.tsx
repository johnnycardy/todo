// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <CalendarDayRowSnippet>
import React from 'react';
import moment, { Moment } from 'moment';
import { TodoTask } from 'microsoft-graph';

interface CalendarDayRowProps {
  todos: TodoTask[];
}

interface FormatMap {
  [key: string] : string;
}

// moment.js format strings are slightly
// different than the ones returned by Graph
const formatMap: FormatMap = {
  "h:mm tt": "h:mm A",
  "hh:mm tt": "hh:mm A"
};

// Helper function to format Graph date/time in the user's
// preferred format
function formatDateTime(dateTime: string | undefined, format: string) {
  if (dateTime !== undefined) {
    return moment(dateTime).format(formatMap[format] || format);
  }
}

export default class CalendarDayRow extends React.Component<CalendarDayRowProps> {
  render() {

    if (this.props.todos.length <= 0)
    {
      // Render an empty row for the day
      return (
        <></>
      );
    }

    return (
      <React.Fragment>
        {this.props.todos.map(
          function(task: TodoTask, index: Number) {
            return (
              <tr key={task.id}>
                <td>{task.title}</td>
              </tr>
            )
          }
        )}
      </React.Fragment>
    )
  }
}
// </CalendarDayRowSnippet>
