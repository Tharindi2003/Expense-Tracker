Software Requirements Specification (SRS)
Project Title: Expense Tracker
 Version: 1.0
 Date: 03 September 2025

1. Introduction
1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for the Expense Tracker web application. The system helps users record income and expenses, organize them into categories, track budgets, and generate summaries for financial management.
1.2 Scope
The Expense Tracker is a lightweight, browser-based system that enables users to:
Add, edit, and delete transactions (income/expenses).


Categorize transactions (with predefined and custom categories).


Set and track monthly budgets.


View summary reports (total income, expenses, balance, remaining budget).


Filter transactions by type, category, month, or keyword.


Persist data locally (via browser storage) and support import/export in JSON format.


The system is intended for individual users and does not require a server backend.
1.3 Definitions, Acronyms, Abbreviations
Transaction: A financial record of either an income or an expense.


Category: A label assigned to a transaction (e.g., Food, Rent, Salary).


Budget: A monthly financial target/limit set by the user for expenses.


Local Storage: Browser-based persistent storage.


1.4 References
IEEE Std 830-1998 (IEEE Recommended Practice for Software Requirements Specifications).


W3C HTML5 and CSS3 Specifications.


MDN Web Docs: Local Storage API, DOM API, JavaScript ES6+.



2. Overall Description
2.1 Product Perspective
The Expense Tracker is a standalone web application (HTML, CSS, JavaScript). It does not require server infrastructure. Data is stored locally in the browser. Users can export/import JSON files for portability.
2.2 Product Features
Add/Edit/Delete income and expense records.


Support custom and default categories.


View total income, expenses, balance, and remaining budget.


Filter and search transactions.


Import/Export financial data as JSON.


2.3 User Classes and Characteristics
General Users: Individuals managing personal finances. No technical expertise required.


Advanced Users: Users who may want to export/import data for backup or transfer.


2.4 Operating Environment
Platform: Web browsers (Chrome, Firefox, Safari, Edge).


Device: Desktop or mobile with modern browser support.


No internet connection required (works offline).


2.5 Constraints
Data is stored locally; deleting browser storage clears all records.


Import/Export only supports JSON format.


No multi-user or server synchronization support.


2.6 Assumptions and Dependencies
User has access to a modern browser with LocalStorage enabled.


User manually exports data for backup/sharing.



3. System Features
3.1 Transaction Management
Description: Users can add, edit, and delete transactions.
 Functional Requirements:
FR1: User shall add a transaction with type (income/expense), amount, category, date, and optional note.


FR2: User shall edit transaction details.


FR3: User shall delete a transaction.


3.2 Category Management
Description: Categories help classify transactions.
 Functional Requirements:
FR4: System shall provide default categories for income and expense.


FR5: User shall add custom categories.


FR6: System shall persist categories across sessions.


3.3 Budget Management
Description: Users can set and track a monthly budget.
 Functional Requirements:
FR7: User shall set a monthly budget.


FR8: System shall calculate remaining budget as Budget − Current Month Expenses.


3.4 Reporting and Summaries
Functional Requirements:
FR9: System shall calculate total income, expenses, and balance.


FR10: System shall show remaining monthly budget.


3.5 Filtering and Searching
Functional Requirements:
FR11: User shall filter transactions by type, category, or month.


FR12: User shall search transactions by keyword in notes.


3.6 Data Import/Export
Functional Requirements:
FR13: User shall export data as a JSON file.


FR14: User shall import data from a JSON file.



4. External Interface Requirements
4.1 User Interface
Intuitive form for adding transactions.


Table view of transactions.


Summary section with key statistics.


Buttons for Import/Export, Delete All, and Budget management.


4.2 Hardware Interfaces
None (runs on standard web browsers).


4.3 Software Interfaces
Local Storage API.


File API (for import/export).


4.4 Communications Interfaces
None (offline application).



5. Non-Functional Requirements
Performance: App should respond to user actions instantly (<1 second).


Usability: Simple, clean UI with minimal learning curve.


Portability: Should work across modern browsers and devices.


Reliability: Data should persist unless explicitly deleted by the user.


Security: Data is stored locally; no external transmission occurs.



6. Other Requirements
Future enhancements may include:


Multi-user support with cloud sync.


Charts/visual analytics.


Multi-currency support.


Recurring transactions.

