<p align="center">
  <img src="assets/workday-mcp-logo.svg" alt="Workday MCP logo" width="96" height="96">
</p>

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

**Workforce analytics (version 0.6.0; optional, off by default).** Switch on **Allow Workday Query Language (WQL) reports** in the extension settings to ask about the whole workforce. Answers are summaries only: no names, no individual pay, groups under three people are never shown, and pay figures need groups of five or more. This is new and still being checked against real tenants, so compare the first figures with a Workday report you trust.

**"Show the board scorecard."**
> Headcount 4,812 (up 2.7% on a year ago), 4,655 FTE. 612 hires and 487 exits in the last 12 months, turnover 10.1%. Women in leadership 38%. Standing out: Customer Support has the highest turnover, and 9% of Finance is within five years of retirement age.

**"Headcount, hires and exits by quarter for the last two years."**
> Headcount grew from 4,402 to 4,812 over eight quarters. Hiring peaked at 181 in Q2 last year, and exits held steady near 120 a quarter.

**"Turnover by function for Germany only."**
> Germany has 642 active workers. Customer Support 17.9%, Sales 12.4%, Engineering 7.2%, Finance 5.1%. Groups under three people are rolled into Other.

**"Which locations have the highest voluntary turnover?"**
> Austin 9.8%, Munich 8.6% and Chicago 7.9%. The other 11 locations are below 6%.

**"Where are people aged 55 or older concentrated?"**
> Finance (31% of the function) and Operations (24%). Together they hold 41% of everyone aged 55 or older.

**"What does each of the CEO's direct reports' organization cost, and how big is it?"**
> 7 organizations. The largest has 1,420 people and a base pay cost of $98M. Leaders appear as their organization plus a short code, never by name.

**"Give me the HR business partner view for the Munich location."**
> Munich: 318 active workers, 24% women, average tenure 5.2 years, 11 exits in the last 12 months and an average span of control of 7.4.

**"Build the workforce report as a PDF."** (also needs **Allow workforce reports (PDF)**)
> Created a 24-page workforce report in your Workday MCP Reports folder: 21 sections included, 2 left out because the data was missing, each with the reason.

**"What can you do with my Workday?"**
> Lists the tools, switches, ready-made views and privacy rules that are active in your install.

Tip: ask in the **Chat** tab of Claude Desktop, and if Claude says it is not signed in, ask it to call `workday_login`.
