# Sprint 1 Report

Video Link: https://www.youtube.com/watch?v=zYhf_t1fp4s

## Kanban Board Progress
Kanban board before Sprint 1:
![Kanban Board Before/Early in Sprint](sprintReport1Images/before.png)
Kanban board during Sprint 1:
![Kanban Board During/Mid Sprint](sprintReport1Images/middleofsprint.png)

Kanban board after Sprint 1:
![Kanban Board After Sprint](sprintReport1Images/afterSprint.png)

## What's New (User Facing)
* User is able to view the map of Pullman via the Google maps API and can see thier location and bus locations as long as location services are turned on. Additionally, users can now see bus schedules in the 'Schedules' tab.

* Completed by Darron -> (#013): Route Display: Allow users to view all bus information
* Completed by Genevieve -> (#001) Map Display: Allows user to view the main base map of Pullman and see thier location, (#022) Pullman Transit API: Read PT documentation and figure out what information is provided via the api
* Completed by Joanne -> (#020): Schedules Page: Allow users to navigate to the schedules page where bus schedules are displayed.
* Completed by Collin -> (#018): Show Bus Locations Toggle: Allow users to toggle on/off all bus locations.
* Completed by Riley -> (#014): Calculate and Display the estimated arrival time of the buses.

## Work Summary (Developer Facing)
This sprint, our team focused on establishing the foundational structure of the app while integrating key transit features. We tackled the challenge of parsing data from the Pullman Transit API, ensuring accurate retrieval and processing of bus information. Implementing the Google Maps API required overcoming issues related to displaying dynamic transit data, particularly aligning real-time updates with static schedule information. We developed a basis for the user interface of the app, incorporating a menu that provides location tracking and bus schedule access. A significant learning moment came from synchronizing estimated bus arrival times with map rendering.

## Unfinished Work
For the initial Kanban board setup, we ensured that all project issues were organized in the To Do column, allowing us to complete them in successive sprints. Our approach prioritized major tasks rather than spreading our efforts too thin across multiple smaller issues. However, we ran out of time for some tasks in the In Progress section because we initially took on more issues than we could realistically complete within this sprint. Moving forward, we will refine our planning process to better estimate workload capacity and improve task distribution across sprints.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
* [URL of issue 22](https://github.com/darronese/pt-bus-buddy/issues/22)
* [URL of issue 1](https://github.com/darronese/pt-bus-buddy/issues/1)
* [URL of issue 20](https://github.com/pt-bus-buddy/pt-bus-buddy/issues/20)
* [URL of issue 18](https://github.com/pt-bus-buddy/pt-bus-buddy/issues/18)
Desirables (Remove this section when you save the file):
* FINISHED - Each issue should be assigned to a milestone
* FINISHED - Each completed issue should be assigned to a pull request
* Each completed pull request should include a link to a "Before and After" video
* FINISHED - All team members who contributed to the issue should be assigned to it on
GitHub
* Each issue should be assigned story points using a label
* Story points contribution of each team member should be indicated in a comment
  
## Incomplete Issues/User Stories
We do not have any issues that we are working on that we didn't complete in this sprint. Any open issues were closed at the time of writing this sprint report.

## Code Files for Review
Please review the following code files, which were actively developed during this
sprint, for quality:
* [Client side link: All code files with a .js extension were actively developed](https://github.com/pt-bus-buddy/pt-bus-buddy/tree/main/client)
* [Server side link: All code files with a .js extension were actively developed](https://github.com/pt-bus-buddy/pt-bus-buddy/tree/main/server)
  
## Retrospective Summary
**Here's what went well:**

*everybody was able to get their assigned tasks done on time without meeting in person, due to spring break  
*we made lots of progress on the app

**Here's what we'd like to improve:**

*the communication, as it was hard to get everybody on the same page Since we were all away, we had to communicate through messages, which was difficult since a lot of us were traveling. Some of us weren’t even in the same time zone!  
*more time to meeting in person and discussing topics and what we are able to work on  
*manage more of the workload and be better productively

**Here are changes we plan to implement in the next sprint:**

*Error handling for user location services not being turned on  
*Schedule regular check-ins - By setting up a mandatory virtual check-in, we can all talk about the progress we have made and to make sure everybody is on the right track. This could also help us understand what our teammates are working on to ensure maximum productivity  
*Use a more scheduled communication tool - By setting up a more scheduled communication tool like Trello, we would be able to help everybody get on board and stay focused on their tasks. This would be extremely beneficial for someone who has to travel. They would still be able to communicate and work on their task!  
*Plan ahead for absences - Before busy breaks or weekends, we can plan the task distribution accordingly. We can assign responsibilities early and have them complete the task before a busy break or weekend to ensure that the work is done and there is no need for future clarification  
*Extensive meeting at the beggining of each sprint

  ## Retrospective Report
  Overall, our sprint 1 was successful. We were able to make significant progress on the app, implementing  a list of key features such as parsing the API data (Darron), Prompting for user location and displaying an accurate/scalable Map (Genevieve), adding a bus schedule page with accurate bus schedules (Joanne), adding static map markers at each of the bus stops (Collin), and using bus data to estimate arrival times of busses at each stop (Riley). Each of these are high priority features that are crucial to the core functionality of the app. Our team found it helpful to work on the high priority items, because most other features depend on certain core features of the app to work. For future sprints, we need to take the time to better understand the directions, and discuss our team’s vision for what the app/features will look like before starting the sprint. We also need better communication as to who is assigned to which task, and to hash out any potential issues where certain features rely on the completion of other features. To improve our sprint process, our team decided to have virtual meetings where each person discusses their progress on a feature or any potential problems. We can use a concrete scheduling app such as trello in order to coordinate times and ensure everyone can make them. We will also assign tasks earlier on in the sprint (or before breaks/weekends) so that everyone knows what they need to work on. Lastly, we will have a meeting at the start of each sprint to go over the directions (deliverables) of the sprint, our team’s overall vision for the app (what will the app look like by the end of the sprint), and assign tasks to each person (discuss which features rely on other features vs which features can be worked on independently). This will also help us to get a head start on the sprint, and stay on top of the time frame which we have to complete the sprint.
