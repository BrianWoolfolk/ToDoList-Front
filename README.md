# TO DO LIST APP
## Front End (React)

# Functional Requirements 
You are working with a client that needs to implement a to do list to help manage their tasks in their daily job. The client asked you to implement the following functionality:

1. Create a “to do” specifying the name, a priority, and possibly a due date 
2. Ability to edit name, priority and due date for existing “to do” tasks 
    1. They want to be able to specify a due date or clear the due date (because they are not interested in when to finish that “to do”) 
3. Be able to filter “to do’s” specifying the name (or part of the name), and the priority, and if they are done/undone. 
4. Be able to sort the “to do’s” by priority and/or due date.   
    1. For example, be able to sort items where their due date is soon and sort them also by priority to see what tasks are more urgent or less urgent 
5. Mark “to do’s” as done (clicking in a checkbox) or to undone a “to do” 
    1. The undone functionality is just there if there is a mistake :D 
6. Since it is possible that the client will have a lot of “to do’s” they need to paginate the list of “to do’s” 
7. Ability to know, in average, the time between creation and done for all “to do’s”. This should be shown in general for all done “to do’s” and also grouped by priority. 
    1. This is important for the client since this is a metric they follow to measure performance. 

# Technical Requirements 
## UI Requirements 
The UX/UI Team of the client is asking you to conform with the following markup to design the app. 

> (See image)[./instructions-img.png]

1. Search/Filtering Controls 
2. New To Do Button. This should open a modal to type the “to do” data. 
3. Priority column should show in the header the classic up and down arrows to allow the user to sort 
4. Due date column should show in the header the classic up and own arrows to allow the user to sort 
5. Action column to show actions (links/buttons) to allow the user to delete or edit a “to do” 
    1. To Edit is ok to show a modal similar to the one to create a “to do” 
6. Pagination control. Showing the pages, its number and the next and previous page is enough. 
7. Area to show the metrics 

## Nice to have for the UI 

1. Show the row with background colors depending on the due date: 
    1. No due date – No background color 
    2. One week between due date and today – Red background color 
    3. 2 weeks between due date and today – Yellow background color 
    4. More that 2 weeks between due date and today – Green background color 
2. Strikethrough fonts for those tasks marked as done 

# Engineering Requirements 

The Engineering team of the client is asking you to implement the functionality using the following recommendations: 

## Model 
A “to do” should have the following properties: 

1. Id. This could be a number or string or a combination. Must be unique. 
2. Text (required). Max length is 120 chars. 
3. A due date (optional). 
4. Done/undone flag 
5. A done date. When the “to do” is marked as done this date is set 
6. Priority (required). Options: High, Medium and Low. 
7. Creation date. 

## API 

1. A GET endpoint (/todos) to list “to do’s” 
    1. Include pagination. Pages should be of 10 elements. 
    2. Sort by priority and/or due date 
    3. Filter by done/undone 
    4. Filter by the name or part of the name 
    5. Filter by priority 
2. A POST endpoint (/todos) to create “to do’s” 
    1. Validations included 
3. A PUT endpoint (/todos/{id}) to update the “to do” name, due date and/or priority 
    1. Validations included 
4. A POST endpoint (/todos/{id}/done) to mark “to do” as done 
    1. This should update the “done date” property 
    2. If “to do” is already done nothing should happen (no error returned) 
5. A PUT endpoint (/todos/{id}/undone) to mark “to do” as undone 
    1. If “to do” is already undone nothing should happen 
    2. If “to do” is done, this should clear the done date 

# Database 
No need to use a database by now, storing data could be in memory using Java Collections (no in-memory databases like H2) and it is ok if data is lost when the application is shutdown. But they are asking you to design the persistent layer such that it will be somehow easy to switch from in-memory implementation to a database implementation (they are planning to implement the database implementation later). 

# Front-end Technology 
For the front-end project, you have to use:

- JavaScript
- ReactJS
- Up to you to use Redux or React Context

They need at least the following commands to run the project:

> - `npm run start` – To run the front-end application
> - `npm run tests` – To run all tests in the front-end application

Front end project must run in port 8080.

# Back-end Technology 
For the back-end project, you have to use: 

- Java 
- Maven  
- Spring Boot 

They need at least the following commands to run the project: 

> - `mvn spring-boot:run` – To run the back-end application 
> - `nvn test` – To run all tests in the back-end application 

Back-end project must run in port 9090.
