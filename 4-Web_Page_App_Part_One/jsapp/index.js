#!/usr/bin/env node

const http = require('http')

let memes = []
let nextID = 0;

const handleRequest = (req, res) => {

  //if going to /api
  if (req.url.includes('/api')) {
    const [path, query] = req.url.split('?')

    //if post request
    if (req.method == "POST") {
      console.log("POST Request")
      let body = ''
      req.on('data', (data) => {
        body += data
      })
      req.on('end', () => {
        const params = Object.fromEntries(body.split('&').map(
            (param) => param.split('=')
        ))
        let name = params.postMeme
        let year = params.postYear
        let id = nextID;
        nextID++;
        validInput = (year >= 1980 && year <= 2025 && name)
        if (validInput) {
          meme = {name,year, id}
          memes.push(meme)

          //this was the kbye function before
          res.writeHead(201, {
            "Content-Type": "text/html"
          })
          res.write("<h1>You added a meme, good job!</h1>")
          res.write("<br><a href='/'>Home</a><br><br><a href='api'>See Memes</a>")
          res.end()
        }
        else {
          res.writeHead(400, {
            "Content-Type": "text/html"
          })
          res.write("<h1>Invalid Input!</h1><br>")
          res.write("<p>You must enter a name!<br>You must enter a number between 1980 and 2025</p><br>")
          res.write("<a href='/'>Home</a>")
          res.end()
        }

      })
    }

    else if (req.method == "GET") {
      console.log("GET Request")
      let body = ''
      req.on('data', (data) => {
        body += data
      })
      req.on('end', () => {
        let params = {}
        if(query) {
          params = Object.fromEntries(query.split('&').map(
              (param) => param.split('=')
          ))
        }
        let name = params.meme
        let year = params.year
        validInput = (year >= 1980 && year <= 2025 && name)
        if (validInput) {

          let matches = []
          let i = 0
          while (i < memes.length) {
            if (memes[i].name == name && memes[i].year == year){
              matches.push(memes[i])
            }
            i++;
          }

          if (matches.length == 0){
            res.writeHead(404, {
              "Content-Type": "text/html"
            })
            res.write("<h1>No Matches Found!</h1><br><a href='/'>Return Home</a>")
            res.end()
          }
          else{
            res.writeHead(200, {
              "Content-Type": "text/html"
            })
            writePostAndDelete(res)
            res.write("<h1>Matches Found!</h1><br><h2>Memes</h2>")
            let index = 0;
            writeTable(res, matches)
            res.write("<br><a href='/api'>See All Memes</a>")
            res.end()
          }


        }
        else {
          //this will show all mems
          res.writeHead(200, {
            "Content-Type": "text/html"
          })
          writePostAndDelete(res)
          res.write("<h1>Showing all memes!</h1>")
          res.write("<p>You are on this page because you either clicked the link, or your search input was invalid</p>")

          res.write("<h2>Memes</h2>")
          if(memes.length != 0){
            writeTable(res,memes)
          }
          else {res.write("<p>No memes yet!</p>")}
          res.write("<br><a href='/'>Home</a>")
          res.end()
        }
      })
    }

    else if (req.method === "PUT") {
      console.log("PUT Request")
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const params = JSON.parse(body)
          console.log(params.id)
          let change = false
          let i = 0
          if(params.newYear < 1980 || params.newYear > 2025){
            throw("invalid year")
          }
          while (i<memes.length && !change){
            if(memes[i].id == params.id) {
              memes[i].name = params.newName
              memes[i].year = params.newYear
              change = true
            }
          }
          if (change) {
            res.writeHead(200, {
              "Content-Type": "application/json"
            });
            res.end(JSON.stringify({ success: true }));
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Item not found' }));
          }
        }
        catch (error) {
          console.error('Error parsing JSON:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
      });
    }

    else if (req.method === "DELETE") {
      console.log("delete request")
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const requestUrl = new URL(req.url, `http://${req.headers.host}`);
          const id = requestUrl.searchParams.get('id')
          console.log("id,",id)
          let change = false
          let i = 0
          while (i<memes.length && !change){
            if(memes[i].id == id) {
              memes = memes.filter((item) => item.id !== Number(id));
              change = true
            }
          }
          if (change) {
            res.writeHead(200, {
              "Content-Type": "application/json"
            });
            res.end(JSON.stringify({ success: true }));
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Item not found' }));
          }
        }
        catch (error) {
          console.error('Error parsing JSON:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
        console.log(memes)
      });
    }

    //if not a valid post or get request
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

//write out the search table
const writeTable = (res, arr) => {
  index = 0
  res.write("<table>")
  while (index < arr.length) {
    res.write("<tr><td>")
    res.write(arr[index].name)
    res.write("</td><td>")
    res.write(arr[index].year)
    res.write("</td><td>")
    res.write("<button onclick='sendEditReq(")
    res.write(arr[index].id.toString())
    res.write(")'>Edit</button>")
    res.write("</td><td>")
    res.write("<button onclick='sendDeleteReq(")
    res.write(arr[index].id.toString())
    res.write(")'>Delete</button>")
    res.write("</td></tr>")
    index++;
  }
  res.write("</table>")
}

const writePostAndDelete = (res) => {

  res.write(`
        <script>
            const sendEditReq = (num) => {
                let newName = prompt("name")
                let newYear = prompt("year")
                console.log("sendEditReq");
                fetch('/api', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: num, newName: newName, newYear: newYear})
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    location.reload();
                })
                .catch(error => console.error('Error:', error));
            };
            const sendDeleteReq = (num) => {
                console.log("sendDeleteReq,", num.toString())
                fetch('/api?id='+num.toString(), {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    location.reload();
                })
                .catch(error => console.error('Error:', error));
            }
        </script>
  `)

}

//handleRequest is the function defined at the top of this file
const server = http.createServer(handleRequest)

//listens on port 3000 for js requests
server.listen(3000)
