// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <graphServiceSnippet1>
import moment, { Moment } from 'moment';
import { Event, TodoTaskList, TodoTask } from 'microsoft-graph';
import { GraphRequestOptions, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: any) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client
    .api('/me')
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
}
// </graphServiceSnippet1>

// <getUserWeekCalendarSnippet>
export async function getUserTodosYesterday(accessToken: string): Promise<TodoTask[]> {
  const client = getAuthenticatedClient(accessToken);
  let lists = await getLists(client);
  let defaultList = lists.filter(l => l.wellknownListName === 'defaultList')[0];
  let tasks = await getItemsFromList(client, defaultList.id as string);
  return tasks;
}

export async function getItemsFromList(client:any, listId:string): Promise<TodoTask[]> {

  // GET /me/calendarview?startDateTime=''&endDateTime=''
  // &$select=subject,organizer,start,end
  // &$orderby=start/dateTime
  // &$top=50
  var response: PageCollection = await client
    .api(`/me/todo/lists/${listId}/tasks`)
    .orderby('lastModifiedDateTime desc')
    .top(100)
    .get();

  if (response["@odata.nextLink"]) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    var events: TodoTask[] = [];

    // Must include the time zone header in page
    // requests too
    var options: GraphRequestOptions = {
    };

    var pageIterator = new PageIterator(client, response, (event) => {
      events.push(event);
      return true;
    }, options);

    await pageIterator.iterate();

    return events;
  } else {

    return response.value;
  }
}

export async function getLists(client:any): Promise<TodoTaskList[]> {

  var endDateTime = moment().subtract(1, 'day').format();

  // GET /me/calendarview?startDateTime=''&endDateTime=''
  // &$select=subject,organizer,start,end
  // &$orderby=start/dateTime
  // &$top=50
  var response: PageCollection = await client
    .api('/me/todo/lists')
    .get();

  if (response["@odata.nextLink"]) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    var lists: TodoTaskList[] = [];

    // Must include the time zone header in page
    // requests too
    var options: GraphRequestOptions = {
    };

    var pageIterator = new PageIterator(client, response, (event) => {
      lists.push(event);
      return true;
    }, options);

    await pageIterator.iterate();

    return lists;
  } else {

    return response.value;
  }
}




// </getUserWeekCalendarSnippet>

// <createEventSnippet>
export async function createEvent(accessToken: string, newEvent: Event): Promise<Event> {
  const client = getAuthenticatedClient(accessToken);

  // POST /me/events
  // JSON representation of the new event is sent in the
  // request body
  return await client
    .api('/me/events')
    .post(newEvent);
}
// </createEventSnippet>
