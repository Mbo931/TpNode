import http from "node:http";
import {createServer} from 'node:http'
import {readFileSync, readFile, createReadStream} from 'node:fs'
import {json} from "node:stream/consumers"



const server = createServer(async (req, res) => {
    //Répond à la demande de favicon (icon de l'onglet de page)
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {
            "Content-type": "image/x-icon"
        });
        res.end()
        return
    }
       res.writeHead(404, {
        "Content-type": 'text/html'
    })
    res.end(readFileSync('404.html', 'utf8'))
})







server.listen('3000', ()=> {
    console.log(`Server running at port 3000`)
})