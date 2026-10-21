# Example questions

What you can ask once Workday MCP is installed and you have signed in. All names, numbers and answers below are **fictional sample data** ("Northwind Demo Co.") that show the shape of the answers. Claude words its replies itself, so the real wording and formatting will differ. Workday decides what you are allowed to see, so some questions return less (or nothing) for people without the matching permissions.

**"Who reports to me?"**
> You have 4 direct reports: Maya Chen (Senior Analyst), Luis Ortega (Analyst), Priya Nair (Analyst), and Tom Becker (Associate Analyst).

**"Which team is Priya Nair in, and who runs it?"**
> Priya is in the Finance Analytics supervisory organization. It is managed by Alex Rivera and has 9 members.

**"How much vacation do I have left this year?"**
> Annual Leave: 11.5 days available. Your next scheduled entry is 3 days in December.

**"What is waiting in my Workday inbox?"**
> 3 items: an expense report approval from Maya Chen, a time off request from Tom Becker, and a goals review due Friday.

**"Show my last few job changes."**
> Business title changed to Finance Manager on 1 March 2024. Before that: Senior Analyst, from 1 June 2021.

**"Find everyone named Smith in the company, I need the first five."**
> Returns the first five matches with name, business title and location, and tells you more exist.

**More areas (version 0.2.0 and later; each needs its scope on your API Client, see the installation guide).**

**"Which absence types can I request, and when is my next leave?"**
> You can request Annual Leave, Sick Leave and Floating Holiday. No leave of absence is scheduled.

**"What goals do I have open this year?"**
> 3 goals: Launch the quarterly forecast model (in progress), Document the month-end close (not started), Mentor one analyst (in progress).

**"Show me open job postings in Finance."**
> 2 postings: Senior Financial Analyst (Chicago) and Accounting Manager (Remote), with their posting dates.

**"Who is mentoring whom on my team?"**
> Maya Chen mentors Priya Nair (started 1 February, in progress).

**"What compensation scorecards exist?"**
> 2 scorecards: FY25 Merit and FY25 Bonus, each with its measures and weights.

Tip: ask in the **Chat** tab of Claude Desktop, and if Claude says it is not signed in, ask it to call `workday_login`.
