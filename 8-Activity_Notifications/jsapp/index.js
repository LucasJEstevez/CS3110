#!/usr/bin/env node

const http = require('http');

const rows = [];

//Handles /api requests
const handleRequest = (req, res) => {

    //if going to /api
    if (req.url.includes('/api')) {
        const [path, query] = req.url.split('?')

        //if post request
        if (req.method == "POST") {
            console.log("POST!");
            let body = ''
            req.on('data', (data) => {
                body += data
            })
            req.on('end', () => {
                const params = JSON.parse(body);
                console.log("Params: ",params);
                rows.push(params);

                res.writeHead(201, {
                    "Content-Type": "text/html"
                })
                res.write("Success!");
                res.end();
                /*
                pullFromFile(ANIMALS_PATH, animals).then(() => {
                    pullFromFile(SOUNDS_PATH, sounds).then(() => {
                        const params = JSON.parse(body);
                        console.log("params:", params)
                        let animal = params.animal
                        let sound = params.sound

                        //adds new animal/sound to server data
                        animals.push(animal)
                        sounds.push(sound)
                        console.log("animals,", animals)
                        console.log("sounds,", sounds)

                        //adds changes to files (persistent storage)
                        console.log("pushing to files:")
                        pushToFile(ANIMALS_PATH,animals)
                        pushToFile(SOUNDS_PATH,sounds)

                        res.writeHead(201, {
                            "Content-Type": "text/html"
                        })
                        //you need to figure out how to add all da memes
                        res.end()
                    });
                });*/
            })
        }

        //GET request for animal data
        else if (req.method == "GET") {
            res.writeHead(200, {
                        "Content-Type": "application/json"
            })
            res.write(JSON.stringify(rows));
            res.end();
        }

        //if not a valid request type
        else {
            res.writeHead(400, {
                "Content-Type": "text/html"
            })
            res.write("<h1>Must Fill Out Form</h1><br><a href='/'>Home</a>")
            res.end()
        }
    }
    else{
        res.writeHead(404, {
            "Content-Type": "text/html"
        })
        res.write("<h1>Page not found, please try again later</h1><br><a href='/'>Home</a>")
        res.end()
    }
}


//handleRequest is the function defined at the top of this file
const server = http.createServer(handleRequest)

//listens on port 3000 for js requests
server.listen(3000)