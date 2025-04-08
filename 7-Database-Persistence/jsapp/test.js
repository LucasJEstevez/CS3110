#!/usr/bin/env node

const http = require('http');
const fs = require('fs');

const ANIMALS_PATH = './animals.txt';
const SOUNDS_PATH = './sounds.txt'

const animals = []
const sounds = []

//exports data to given file
async function pushToFile (path, arr) {
    console.log("pushToFile has begun!")
    console.log("path: ", path)
    console.log("arr: ", arr)
    try {
        let ctnt = arr.join('\n');
        console.log("ctnt: ", ctnt);
        fs.writeFile(path, ctnt, (err) => {
            if (err) {
                console.error('Failed to write file:', err);
            } else {
                console.log("file go brr");
            }
        });
    } catch (err) {
        console.log(err);
        return err;
    }
}

//gets data from given file
async function pullFromFile (path, arr) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("data: ",data);
            lines = data.split('\n');
            arr.length = 0;
            arr.push(...lines);
            resolve();
        })
    })
}

console.log("about to pull from file");
pullFromFile(ANIMALS_PATH, animals).then(() => {
    console.log("last line");
    console.log(animals);
});
pullFromFile(SOUNDS_PATH, sounds).then(() => {
    console.log(sounds);
});

const handleRequest = (req, res) => {

    //if going to /api
    if (req.url.includes('/api')) {
        console.log("api url")
        const [path, query] = req.url.split('?')

        //if post request
        if (req.method == "POST") {
            let body = ''
            req.on('data', (data) => {
                body += data
            })
            req.on('end', () => {
                pullFromFile(ANIMALS_PATH, animals).then(() => {
                    pullFromFile(SOUNDS_PATH, sounds).then(() => {
                        const params = JSON.parse(body);
                        console.log("params:", params)
                        let animal = params.animal
                        let sound = params.sound
                        animals.push(animal)
                        sounds.push(sound)
                        console.log("animals,", animals)
                        console.log("sounds,", sounds)

                        console.log("pushing to files:")
                        pushToFile(ANIMALS_PATH,animals)
                        pushToFile(SOUNDS_PATH,sounds)

                        res.writeHead(201, {
                            "Content-Type": "text/html"
                        })
                        //you need to figure out how to add all da memes
                        res.end()
                    });
                });
            })
        }

        else if (req.method == "GET") {

            pullFromFile(ANIMALS_PATH, animals).then(() => {
                pullFromFile(SOUNDS_PATH, sounds).then(() => {

                    console.log("GET")
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    })
                    const responseData = {
                        animals: animals,
                        sounds: sounds
                    };
                    res.write(JSON.stringify(responseData));
                    res.end();

                });

            });
        }

        else if (req.method == "PUT") {
            console.log("PUT request!")
        }

        else if (req.method == "DELETE"){

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