import http from "http";
import querystring from 'node:querystring'
import { readFileSync } from 'fs';
import pug from "pug";
import dotenv from 'dotenv';
import dayjs from 'dayjs';
dayjs.locale('fr'); 



dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_LOCALHOST || 'localhost';


const students = [
    { name : "Sonia", birth : "2019-14-05"},
    { name : "Antoine", birth : "2000-12-05"},
    { name : "Alice", birth : "1990-14-09"},
    { name : "Sophie", birth : "2001-10-02"},
    { name : "Bernard", birth : "1980-21-08"}
];
students.forEach(student => {
  student.formattedBirth = dayjs(student.birth).format('D MMMM YYYY');
});

const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(200, { "Content-type": "image/x-icon" });
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/style.css') {
        const css = readFileSync('./assets/css/style.css', 'utf8');
        res.writeHead(200, { 'Content-type': 'text/css' });
        res.end(css);
        return;
    }

    if (req.url === '/' && req.method === 'GET') {
        const html = pug.renderFile('./view/homeTemplate.pug');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    } else if (req.url === '/' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Body:', body);
            const parsedBody = querystring.parse(body);
            console.log('Parsed Body:', parsedBody);
            students.push({ name: parsedBody.name, birth: parsedBody.birthdate });
            res.writeHead(302, { 'Location': '/users' });
            res.end();
        });
    } else if (req.url === '/users' && req.method === 'GET') {
        const html = pug.renderFile('./view/usersTemplate.pug', { students });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1>');
    }
});
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
