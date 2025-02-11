const button = document.querySelector("#equalsButton");
button.addEventListener("click", equalsClick, false);

const rick = document.querySelector("#theMan");
rick.addEventListener("mouseover", imageListen, false);

function equalsClick(event){let text="";

    let num1 = document.getElementById("num1").value;
    let num2 = document.getElementById("num2").value;
    if(Number.isInteger(parseInt(num1)) && Number.isInteger(parseInt(num2))){
        let text='';
        let answer=0;

        let opt = document.getElementById("op").selectedIndex;

        switch(opt){
            case 0:
                op="+";
                if(num1=='6' && num2 == '9'){answer="HAHA YOURE SO FUNNY";}
                else{answer=parseInt(num1)+parseInt(num2);}
                break;
            case 1: answer=num1-num2;op="-";break;
            case 2: answer=num1*num2;op="*";break;
            case 3: answer=num1/num2;op="/";break;
        }
        text = num1+" "+op+" "+num2+" = "+answer+"\n";
        console.log(text);
        
        let line = document.createElement("p");
        line.textContent = text;

        let sect = document.getElementById("answers");
        sect.appendChild(line);
    }
    else{
        console.log("Something went wrong!");
    }

    //This preventDefault stops the button from redirecting the page, which in this case would refresh
    event.preventDefault();
}

function imageListen(event){
    let image = document.getElementById("theMan");
    image.style.opacity = .5;

    const helloMsg = document.getElementById("helloMsg");
    helloMsg.remove();

    const byeMsg = document.getElementById("byeMsg");
    byeMsg.textContent = ":( Sad";

    //Without this line, if you hover over the image but then push the button, this listener can get called again.
    //However, the original h2 tag is gone so this causes errors
    //This was my cheap fix
    image.removeEventListener("mouseover", imageListen, false);
}