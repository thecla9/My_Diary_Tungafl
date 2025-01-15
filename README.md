Personal Diaries Web Applica Overview  
This project is a web application for creating personal diaries. Users can log in to create, retrieve, edit, and delete diary entries. Each entry includes a title and content. The application is mobile-responsive, providing a seamless user experience across various devices.

---

Technologies Used  
- Languages: HTML, CSS, JavaScript  
- Node.js: Used for installing and managing project libraries via the `node_modules` directory, including the `package.json` file.  
- Axios Library: Installed and used for API requests. A CDN version of Axios was also used in the HTML.  

---

Features  

 Core Functionality  
1. User Authentication:  
   - Users can log in using the provided login API.  
2. Diary Management:  
   - Users can create new diary entries with a title and content.  
   - Users can retrieve all their entries or specific entries by ID.  
   - Users can edit or delete existing diary entries using innerHTML for dynamic UI updates.  
3. JWT Token Handling:  
   - A custom function for cookies was created to save the JWT token for authenticated API requests.  
4. Responsive Design:  
   - Mobile responsiveness achieved using CSS properties like `view-height`, `view-width`, `margin: auto`, and `max-height`.

APIs Consumed (via Axios)  
- `POST /login`: User login  
- `POST /entries`: Create diary entries  
- `GET /entries/:id`: Retrieve specific entries by ID  
- `PUT /entries/:id`: Edit diary entries  
- `DELETE /entries/:id`: Delete diary entries  
- `POST /logout`: Logout functionality  

---

Enhancements  
This project can be further improved with the following features:  
1. Search Functionality: Allow users to search for entries by title or content.  
2. Filters: Enable fetching entries based on filters such as date, tags, or categories.

---

Notes  
- API Limitations:  
  - The register user and forgot password features were not implemented because APIs for these functionalities were not provided in the Swagger documentation.  
- External CSS: Used for consistent styling across the app.  
- InnerHTML: Dynamically updated the UI for editing and deleting diary entries within JavaScript.  

--- 

How to Run the Project  
1. Clone the repository.  
2. Run `npm install` to set up the `node_modules` directory.  
3. Open the `index.html` file in your browser to view the application.  

Enjoy managing your personal diaries!
