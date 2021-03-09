// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <CalendarDayRowSnippet>
import React from 'react';
import moment, { Moment } from 'moment';
import { TodoTask } from 'microsoft-graph';

interface CalendarDayRowProps {
  date: Moment | undefined;
  timeFormat: string;
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
    var timeFormat = this.props.timeFormat;

    var dateCell = (
      <td className='calendar-view-date-cell' rowSpan={this.props.todos.length <= 0 ? 1 : this.props.todos.length}>
        <div className='calendar-view-date float-left text-right'>{this.props.date?.format('DD')}</div>
        <div className='calendar-view-day'>{this.props.date?.format('dddd')}</div>
        <div className='calendar-view-month text-muted'>{this.props.date?.format('MMMM, YYYY')}</div>
      </td>
    );


    return (
      <React.Fragment>
        {this.props.todos.map(
          function(todo: TodoTask, index: Number) {
            return (
              <tr>
                { index === 0 && dateCell }
                <td className="calendar-view-timespan">
                  <div>{formatDateTime(todo.lastModifiedDateTime, timeFormat)}</div>
                </td>
                <td></td>
                <td>
                  <div className="calendar-view-subject">{todo.title}</div>
            <div className="calendar-view-organizer">{todo.status === "completed" && <span title='complete'>👍</span>} {todo.status}</div>
                </td>
              </tr>
            )
          }
        )}
      </React.Fragment>
    )
  }
}
// </CalendarDayRowSnippet>
