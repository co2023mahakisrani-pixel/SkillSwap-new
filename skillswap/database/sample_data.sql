-- Sample Courses and Lectures for SkillSwap
-- Run this in Supabase SQL Editor

-- First, get the category IDs
DO $$
DECLARE
    prog_cat UUID;
    web_cat UUID;
    uiux_cat UUID;
    mobile_cat UUID;
    data_cat UUID;
    ai_cat UUID;
BEGIN
    SELECT id INTO prog_cat FROM categories WHERE name = 'Programming';
    SELECT id INTO web_cat FROM categories WHERE name = 'Web Development';
    SELECT id INTO uiux_cat FROM categories WHERE name = 'UI/UX';
    SELECT id INTO mobile_cat FROM categories WHERE name = 'Mobile Development';
    SELECT id INTO data_cat FROM categories WHERE name = 'Data Science';
    SELECT id INTO ai_cat FROM categories WHERE name = 'AI/ML';
    
    -- Insert Sample Courses
    INSERT INTO courses (title, description, full_description, category_id, credits, duration, rating, students_count, is_published)
    VALUES 
    (
        'Complete Python Programming Masterclass',
        'Master Python from basics to advanced concepts including OOP, data structures, and real-world projects.',
        'This comprehensive Python course takes you from zero to hero. Learn Python programming with hands-on projects, real-world examples, and expert guidance. Topics include: Python basics, data types, control flow, functions, OOP, file handling, error handling, databases, and building real applications.',
        prog_cat, 8, '12 weeks', 4.9, 1250, true
    ),
    (
        'Modern React.js Development',
        'Build production-ready React applications with hooks, state management, and modern best practices.',
        'Learn modern React.js development from scratch. This course covers: React fundamentals, JSX, components, props, state, hooks (useState, useEffect, useContext, useReducer), React Router, state management with Context API, performance optimization, testing, and building a complete production app.',
        web_cat, 6, '8 weeks', 4.8, 890, true
    ),
    (
        'UI/UX Design with Figma',
        'Design beautiful user interfaces and experiences using Figma - from wireframes to high-fidelity prototypes.',
        'Master UI/UX design with Figma. Learn design principles, user research, wireframing, prototyping, design systems, accessibility, and handoff. Build a complete design portfolio with real projects.',
        uiux_cat, 5, '6 weeks', 4.7, 650, true
    ),
    (
        'Flutter Mobile App Development',
        'Build cross-platform mobile apps for iOS and Android using Flutter and Dart.',
        'Learn Flutter from scratch and build beautiful, natively compiled mobile applications. Cover Flutter basics, widgets, state management (Provider, Bloc), REST APIs, Firebase integration, and publish your app to stores.',
        mobile_cat, 7, '10 weeks', 4.8, 420, true
    ),
    (
        'Data Science with Python and Pandas',
        'Analyze data, create visualizations, and extract insights using Python, Pandas, and NumPy.',
        'Become a data scientist with Python. Learn data analysis with Pandas, numerical computing with NumPy, data visualization with Matplotlib and Seaborn, statistical analysis, and machine learning basics with Scikit-learn.',
        data_cat, 8, '12 weeks', 4.9, 780, true
    ),
    (
        'Machine Learning Fundamentals',
        'Introduction to machine learning algorithms, neural networks, and TensorFlow.',
        'Start your ML journey with this comprehensive course. Cover supervised learning, unsupervised learning, linear regression, logistic regression, decision trees, random forests, neural networks, and deep learning with TensorFlow. Build real ML projects.',
        ai_cat, 10, '14 weeks', 4.9, 560, true
    ),
    (
        'Node.js Backend Development',
        'Build scalable backend services and APIs with Node.js, Express, and MongoDB.',
        'Master backend development with Node.js. Learn Express.js, RESTful API design, MongoDB database, authentication (JWT), deployment, and build a complete full-stack application.',
        web_cat, 6, '8 weeks', 4.6, 380, true
    ),
    (
        'JavaScript Essentials',
        'Master JavaScript from fundamentals to advanced ES6+ features.',
        'Learn JavaScript from the ground up. Cover variables, data types, functions, arrays, objects, DOM manipulation, async JavaScript (promises, async/await), and modern ES6+ features that will make you a JavaScript pro.',
        prog_cat, 4, '6 weeks', 4.7, 1100, true
    );
END $$;

-- Get course IDs and insert lectures
DO $$
DECLARE
    python_course RECORD;
    react_course RECORD;
    figma_course RECORD;
    flutter_course RECORD;
    pandas_course RECORD;
    ml_course RECORD;
    node_course RECORD;
    js_course RECORD;
BEGIN
    -- Get course IDs
    SELECT id INTO python_course FROM courses WHERE title LIKE '%Python%' LIMIT 1;
    SELECT id INTO react_course FROM courses WHERE title LIKE '%React%' LIMIT 1;
    SELECT id INTO figma_course FROM courses WHERE title LIKE '%Figma%' LIMIT 1;
    SELECT id INTO flutter_course FROM courses WHERE title LIKE '%Flutter%' LIMIT 1;
    SELECT id INTO pandas_course FROM courses WHERE title LIKE '%Pandas%' LIMIT 1;
    SELECT id INTO ml_course FROM courses WHERE title LIKE '%Machine Learning%' LIMIT 1;
    SELECT id INTO node_course FROM courses WHERE title LIKE '%Node.js%' LIMIT 1;
    SELECT id INTO js_course FROM courses WHERE title LIKE '%JavaScript%' LIMIT 1;
    
    -- Python Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (python_course.id, 'Introduction to Python', 'Learn what is Python, why learn it, and set up your development environment.', '15:30', 1),
    (python_course.id, 'Variables and Data Types', 'Understanding Python variables, integers, floats, strings, and basic data types.', '22:45', 2),
    (python_course.id, 'Operators and Expressions', 'Arithmetic, comparison, and logical operators in Python.', '18:20', 3),
    (python_course.id, 'Control Flow - If Statements', 'Conditional statements and decision making in Python.', '25:00', 4),
    (python_course.id, 'Loops - For and While', 'Iterating with for loops and while loops.', '28:15', 5),
    (python_course.id, 'Functions in Python', 'Defining and calling functions, parameters, and return values.', '35:40', 6),
    (python_course.id, 'Lists and List Operations', 'Creating, accessing, and manipulating lists.', '30:25', 7),
    (python_course.id, 'Dictionaries and Sets', 'Working with dictionaries and sets in Python.', '32:10', 8),
    (python_course.id, 'File Handling', 'Reading and writing files in Python.', '24:50', 9),
    (python_course.id, 'Object-Oriented Programming', 'Classes, objects, inheritance, and polymorphism.', '45:00', 10),
    (python_course.id, 'Error Handling', 'Try-except blocks and custom exceptions.', '20:30', 11),
    (python_course.id, 'Working with Modules', 'Importing and creating Python modules.', '18:15', 12);
    
    -- React Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (react_course.id, 'Introduction to React', 'What is React, Virtual DOM, and setting up your first React app.', '20:00', 1),
    (react_course.id, 'JSX Deep Dive', 'Understanding JSX syntax and how it compiles to JavaScript.', '25:30', 2),
    (react_course.id, 'Components and Props', 'Creating reusable components and passing data with props.', '30:15', 3),
    (react_course.id, 'State and useState Hook', 'Managing component state with the useState hook.', '35:40', 4),
    (react_course.id, 'useEffect and Side Effects', 'Handling side effects with the useEffect hook.', '32:20', 5),
    (react_course.id, 'Event Handling', 'Handling user events in React applications.', '22:45', 6),
    (react_course.id, 'Conditional Rendering', 'Rendering content conditionally based on state.', '18:30', 7),
    (react_course.id, 'Lists and Keys', 'Rendering lists and understanding the key prop.', '20:15', 8),
    (react_course.id, 'React Router', 'Navigation and routing in React with React Router v6.', '38:00', 9),
    (react_course.id, 'Context API', 'Global state management with React Context.', '42:30', 10),
    (react_course.id, 'Forms in React', 'Building and validating forms.', '28:45', 11),
    (react_course.id, 'Building a Complete App', 'Putting it all together - build a real React application.', '55:00', 12);
    
    -- Figma Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (figma_course.id, 'Getting Started with Figma', 'Introduction to Figma interface and basic tools.', '18:30', 1),
    (figma_course.id, 'Design Principles', 'Fundamental design principles every designer must know.', '25:00', 2),
    (figma_course.id, 'Creating Wireframes', 'Low-fidelity wireframing techniques.', '30:15', 3),
    (figma_course.id, 'Auto Layout', 'Mastering Auto Layout for responsive designs.', '28:45', 4),
    (figma_course.id, 'Components and Variants', 'Creating reusable components and managing variants.', '35:20', 5),
    (figma_course.id, 'Color and Typography', 'Using colors and typography effectively.', '22:30', 6),
    (figma_course.id, 'Icons and Graphics', 'Working with icons and vector graphics.', '20:45', 7),
    (figma_course.id, 'Prototyping', 'Creating interactive prototypes.', '38:00', 8),
    (figma_course.id, 'Design Systems', 'Building and maintaining design systems.', '42:15', 9),
    (figma_course.id, 'Animation in Figma', 'Adding micro-interactions and animations.', '25:30', 10),
    (figma_course.id, 'Handoff to Developers', 'Preparing designs for developer handoff.', '18:20', 11);
    
    -- Flutter Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (flutter_course.id, 'Introduction to Flutter', 'What is Flutter, Dart language basics, and setting up.', '22:00', 1),
    (flutter_course.id, 'Dart Programming Fundamentals', 'Variables, data types, functions, and OOP in Dart.', '35:30', 2),
    (flutter_course.id, 'Widgets Deep Dive', 'Understanding Flutter widgets and the widget tree.', '40:15', 3),
    (flutter_course.id, 'Building Layouts', 'Row, Column, Stack, and other layout widgets.', '32:45', 4),
    (flutter_course.id, 'State Management with Provider', 'Managing app state with Provider package.', '45:00', 5),
    (flutter_course.id, 'Navigation', 'Navigation between screens in Flutter.', '28:30', 6),
    (flutter_course.id, 'REST API Integration', 'Fetching data from APIs with http package.', '38:45', 7),
    (flutter_course.id, 'Firebase Integration', 'Adding authentication and database with Firebase.', '50:20', 8),
    (flutter_course.id, 'Local Storage', 'Storing data locally with SharedPreferences and SQLite.', '30:15', 9),
    (flutter_course.id, 'Publishing to Stores', 'Building and submitting to App Store and Play Store.', '25:00', 10);
    
    -- Pandas/Data Science Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (pandas_course.id, 'Introduction to Data Science', 'What is data science, Python for data science setup.', '20:30', 1),
    (pandas_course.id, 'NumPy Fundamentals', 'Working with numerical data using NumPy arrays.', '35:45', 2),
    (pandas_course.id, 'Pandas DataFrames', 'Creating and manipulating DataFrames.', '42:00', 3),
    (pandas_course.id, 'Data Cleaning', 'Handling missing data, duplicates, and data transformation.', '38:30', 4),
    (pandas_course.id, 'Data Aggregation', 'Grouping, pivoting, and aggregating data.', '32:15', 5),
    (pandas_course.id, 'Data Visualization with Matplotlib', 'Creating charts and plots.', '40:20', 6),
    (pandas_course.id, 'Advanced Visualizations with Seaborn', 'Statistical visualizations.', '35:00', 7),
    (pandas_course.id, 'Exploratory Data Analysis', 'EDA techniques and case study.', '48:45', 8),
    (pandas_course.id, 'Introduction to Machine Learning', 'ML basics with Scikit-learn.', '55:30', 9),
    (pandas_course.id, 'Capstone Project', 'Complete data science project from scratch.', '60:00', 10);
    
    -- ML Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (ml_course.id, 'Introduction to Machine Learning', 'What is ML, types of learning, and applications.', '25:00', 1),
    (ml_course.id, 'Linear Regression', 'Understanding and implementing linear regression.', '38:30', 2),
    (ml_course.id, 'Logistic Regression', 'Classification problems and logistic regression.', '40:15', 3),
    (ml_course.id, 'Decision Trees', 'Tree-based models and decision tree algorithms.', '42:00', 4),
    (ml_course.id, 'Random Forests', 'Ensemble learning with random forests.', '35:45', 5),
    (ml_course.id, 'Support Vector Machines', 'SVM algorithms and kernel methods.', '38:20', 6),
    (ml_course.id, 'K-Means Clustering', 'Unsupervised learning and clustering.', '32:30', 7),
    (ml_course.id, 'Neural Networks Basics', 'Introduction to neural networks and deep learning.', '45:00', 8),
    (ml_course.id, 'TensorFlow Introduction', 'Building neural networks with TensorFlow/Keras.', '52:15', 9),
    (ml_course.id, 'CNN for Image Classification', 'Convolutional neural networks for images.', '48:30', 10),
    (ml_course.id, 'NLP Basics', 'Text processing and natural language processing.', '45:00', 11),
    (ml_course.id, 'ML Project Deployment', 'Deploying ML models to production.', '40:20', 12);
    
    -- Node.js Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (node_course.id, 'Node.js Introduction', 'What is Node.js, event loop, and npm.', '22:30', 1),
    (node_course.id, 'JavaScript Refresher', 'Modern JavaScript features for Node.js.', '30:00', 2),
    (node_course.id, 'Modules and NPM', 'Creating modules and using npm packages.', '25:45', 3),
    (node_course.id, 'Express.js Framework', 'Building servers with Express.', '38:20', 4),
    (node_course.id, 'REST API Design', 'Best practices for RESTful APIs.', '32:15', 5),
    (node_course.id, 'MongoDB Integration', 'Connecting and querying MongoDB with Mongoose.', '42:30', 6),
    (node_course.id, 'Authentication with JWT', 'User authentication and authorization.', '40:00', 7),
    (node_course.id, 'Error Handling', 'Middleware and error handling strategies.', '28:45', 8),
    (node_course.id, 'File Uploads', 'Handling file uploads with Multer.', '25:30', 9),
    (node_course.id, 'Deployment', 'Deploying Node.js apps to production.', '35:15', 10);
    
    -- JavaScript Lectures
    INSERT INTO lectures (course_id, title, description, duration, order_index) VALUES
    (js_course.id, 'JavaScript Introduction', 'History of JavaScript and setting up environment.', '18:00', 1),
    (js_course.id, 'Variables and Data Types', 'var, let, const, and primitive types.', '25:30', 2),
    (js_course.id, 'Operators', 'Arithmetic, comparison, and logical operators.', '20:15', 3),
    (js_course.id, 'Control Flow', 'if/else, switch, and ternary operators.', '22:45', 4),
    (js_course.id, 'Functions', 'Function declarations, expressions, and arrow functions.', '35:00', 5),
    (js_course.id, 'Arrays', 'Array methods and manipulation.', '38:30', 6),
    (js_course.id, 'Objects', 'Creating and working with objects.', '32:15', 7),
    (js_course.id, 'DOM Manipulation', 'Selecting and modifying DOM elements.', '42:00', 8),
    (js_course.id, 'Events', 'Event listeners and event handling.', '28:45', 9),
    (js_course.id, 'Promises', 'Asynchronous JavaScript and Promises.', '35:20', 10),
    (js_course.id, 'Async/Await', 'Modern async programming patterns.', '30:00', 11),
    (js_course.id, 'ES6+ Features', 'Modern JavaScript features and best practices.', '40:30', 12);
END $$;

-- Update course lecture counts
DO $$
DECLARE
    course RECORD;
BEGIN
    FOR course IN SELECT id, title FROM courses LOOP
        UPDATE courses 
        SET students_count = (SELECT COUNT(*) FROM enrollments WHERE course_id = course.id)
        WHERE id = course.id;
    END LOOP;
END $$;

-- Verify the data
SELECT 'Categories:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Courses:' as info, COUNT(*) as count FROM courses
UNION ALL
SELECT 'Lectures:' as info, COUNT(*) as count FROM lectures;

-- Show sample data
SELECT c.title, c.credits, c.duration, c.rating, cat.name as category, COUNT(l.id) as lectures
FROM courses c
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN lectures l ON l.course_id = c.id
GROUP BY c.id, cat.name
ORDER BY c.created_at DESC;
