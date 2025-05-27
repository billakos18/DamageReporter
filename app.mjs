import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import damagesRoutes from './routes/damages_routes.mjs';

const app = express();

// Static files (style_index.css, images, scripts)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 10 }, // 10 minutes  
    resave: false,
    saveUninitialized: false
}));

// Set up Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    helpers: { // Custom helpers
        json: (context) => {
             const json = JSON.stringify(context);
            // Escape closing tags and special characters to keep JS safe inside HTML <script>
            const safeJson = json
                .replace(/</g, '\\u003c')  // escape <
                .replace(/>/g, '\\u003e')  // escape >
                .replace(/&/g, '\\u0026')  // escape &
                .replace(/\u2028/g, '\\u2028')  // line separator
                .replace(/\u2029/g, '\\u2029'); // paragraph separator
            return safeJson;
            },
        formatDate: (dateString, formatStr = 'PPpp') => {
            return format(new Date(dateString), formatStr);
            },
         eq: (a, b) => a == b,
         not: (a) => !a,
         escape: (str) => {
            if (typeof str !== 'string') {
                str = String(str || '');
            }
            return str.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;');
            }
}}));
app.set('view engine', 'hbs');

// Use routes
app.use('/', damagesRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));


