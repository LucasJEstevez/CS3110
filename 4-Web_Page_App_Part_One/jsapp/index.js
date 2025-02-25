#!/usr/bin/env node

const http = require('http')

let memes = []

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
        const params = Object.fromEntries(body.split('&').map(
            (param) => param.split('=')
        ))
        console.log("params",params)
        let name = params.postMeme
        let year = params.postYear
        console.log(name,", ",year)
        validInput = (year >= 1980 && year <= 2025 && name)
        console.log("validInput? ", validInput)
        if (validInput) {
          console.log("valid input for post!")
          meme = {name,year}
          memes.push(meme)
          console.log("memes,",memes)

          //this was the kbye function before
          res.writeHead(201, {
            "Content-Type": "text/html"
          })
          res.write("<h1>You added a meme, good job!</h1>")
          res.write("<br><a href='/'>Home</a><br><br><a href='api'>See Memes</a>")
          //you need to figure out how to add all da memes
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
      console.log("get method")
      let body = ''
      req.on('data', (data) => {
        body += data
      })
      req.on('end', () => {
        let params = {}
        if(query) {
          console.log("there's a query!")
          params = Object.fromEntries(query.split('&').map(
              (param) => param.split('=')
          ))
        }
        console.log("params",params)
        let name = params.meme
        let year = params.year
        console.log(name,", ",year)
        validInput = (year >= 1980 && year <= 2025 && name)
        console.log("validInput? ", validInput)
        if (validInput) {
          console.log("valid input for get!")

          let matches = []
          let i = 0
          while (i < memes.length) {
            if (memes[i].name == name && memes[i].year == year){
              matches.push(memes[i])
            }
            i++;
          }

          if (matches.length == 0){
            console.log("no matches found")
            res.writeHead(404, {
              "Content-Type": "text/html"
            })
            res.write("<h1>No Matches Found!</h1><br><a href='/'>Return Home</a>")
            res.end()
          }
          else{
            console.log("matches found")
            console.log(matches)
            res.writeHead(200, {
              "Content-Type": "text/html"
            })
            res.write("<h1>Matches Found!</h1><br><h2>Memes</h2><table>")
            let index = 0;
            console.log("entering while loop")
            while (index < matches.length) {
              console.log("iteration ", index + 1)
              res.write("<tr><td>")
              res.write(matches[index].name)
              res.write("</td><td>")
              res.write(matches[index].year)
              res.write("</td>")
              index++;
            }
            console.log("exited while loop")
            res.write("</table>")
            res.write("<br><a href='/api'>See All Memes</a>")
            res.end()
          }


        }
        else {
          //this will show all mems
          console.log("invalid input for get")
          res.writeHead(400, {
            "Content-Type": "text/html"
          })
          res.write("<h1>Showing all memes!</h1>")
          res.write("<p>You are on this page because you either clicked the link, or your search input was invalid</p>")

          res.write("<h2>Memes</h2><table>")
          if(memes.length != 0){
            let index = 0;
            console.log("entering while loop")
            while (index < memes.length) {
              console.log("iteration ", index + 1)
              res.write("<tr><td>")
              res.write(memes[index].name)
              res.write("</td><td>")
              res.write(memes[index].year)
              res.write("</td>")
              index++;
            }
            console.log("exited while loop")
            res.write("</table>")
          }
          else {res.write("<p>No memes yet!</p>")}
          res.write("<br><a href='/'>Home</a>")
          res.end()
          console.log("exited while loop")
        }
      })
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

/*
const kbye = (res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  })
  res.write(JSON.stringify(dancers))
  res.end()
}
 */

//handleRequest is the function defined at the top of this file
const server = http.createServer(handleRequest)

//listens on port 3000 for js requests
server.listen(3000)
