//Event listener for calculator button
const button = document.querySelector("#equalsButton");
button.addEventListener("click", equalsClick, false);

//Event listener for hovering over image
const rick = document.querySelector("#theMan");
rick.addEventListener("mouseover", imageListen, false);

//Function to calculate
function equalsClick(event){let text="";

    //Numbers
    let num1 = document.getElementById("num1").value;
    let num2 = document.getElementById("num2").value;

    number1 = parseInt(num1); number2 = parseInt(num2);

    //Checks they are real numbers
    if(Number.isInteger(number1) && Number.isInteger(number2)){
        let text='';
        let answer=0;

        //Gets mathematical operation from dropdown menu
        let opt = document.getElementById("op").selectedIndex;

        switch(opt){
            case 0:
                //Funny ha-ha
                if(number1==6 && number2 == 9){answer="HAHA YOURE SO FUNNY IM LITERALLY CRYING";}
                //Regular addition
                else{answer=number1+number2;}
                op="+";
                break;

            //Subtraction, Multiplication, Division
            case 1: answer=number1-number2;op="-";break;
            case 2: answer=number1*number2;op="*";break;
            case 3: answer=number1/number2;op="/";break;
        }

        //Line of text to output
        text = number1+" "+op+" "+number2+" = "+answer+"\n";
        
        //Creates p tag
        let line = document.createElement("p");
        line.textContent = text;

        //Adds tag to section where it belongs
        let sect = document.getElementById("answers");
        sect.appendChild(line);
    }

    //Invalid input data
    else{
        let text = "Invalid! Try again."

        let line = document.createElement("p");
        line.textContent = text;

        let sect = document.getElementById("answers");
        sect.appendChild(line);
    }

    //This preventDefault stops the button from redirecting the page, which in this case would refresh
    event.preventDefault();
}

//When hovering over the image, weird things will happen
function imageListen(event){

    //Changes image opacity to .5
    let image = document.getElementById("theMan");
    image.style.opacity = .5;

    //Replace initial message with sad one
    const helloMsg = document.getElementById("helloMsg");
    helloMsg.remove();
    const byeMsg = document.getElementById("byeMsg");
    byeMsg.textContent = "Me when you let me down instead-->     :(";

    //Without this line, if you hover over the image but then push the button, this listener can get called again.
    //However, the original h2 tag is gone so this causes errors
    //This was my cheap fix
    image.removeEventListener("mouseover", imageListen, false);
}