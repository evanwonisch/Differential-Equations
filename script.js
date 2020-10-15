var canvas;
var ctx;
var width, height;
var time = 0;
const FPS = 60;

var xs = [-15,15, 0.8]
var ys = [-10,10, 0.8]

var plot_width;
var plot_heigth;
var xscale;
var yscale;
var xshift;
var yshift;

var mouseX;
var mouseY;

var showFlow = false;
var equation_index = 0;
var stepsize = 0.1;

window.onload = () => {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")


    setInterval(() => {
        canvas.width = width = window.innerWidth
        canvas.height = height = window.innerHeight
        ctx.fillStyle = "whitesmoke"
        ctx.fillRect(0, 0, width, height)

        update();

    }, 1000 / FPS);

    window.addEventListener("mousemove", e => {
        mouseX = e.pageX;
        mouseY = e.pageY;
    })

    var equations = document.querySelectorAll("li")
    equations.forEach(e => {
        e.addEventListener("click", e => {
            equation_index = parseInt(e.target.getAttribute("data-index"))
            equations.forEach(a => {
                a.setAttribute("data-checked", false)
            })
            e.target.setAttribute("data-checked", true)
        })
    })

    var chekbox = document.getElementById("checkbox")
    chekbox.addEventListener("change", e => {
        showFlow = e.target.checked
    })


    var numberInput = document.getElementById("numberInput")
    numberInput.addEventListener("keydown", e => {
        if(e.code == "Enter"){
            stepsize = parseFloat(numberInput.value);
            if(stepsize < 0.05){
                stepsize = 0.05
                numberInput.value = 0.05
            }
        }
    })
}

function f_prime(x, y){
    switch(equation_index){
        case 0:
            return x
        case 1:
            return -y * Math.exp(-0.05*(x*x+y*y))
        case 2:
            return 0.1*(x*Math.sin(y))
        case 3:
            return (x*x-y*y)/(x*x+y*y)
        case 4:
            return Math.sin(x) * Math.cos(y)
        case 5:
            return 0.1*((x*x -2)/(y*y+1)*Math.sin(x)+ Math.sin(y))
    }
}


function update(){

    plot_width = xs[1] - xs[0]
    plot_heigth = ys[1] - ys[0]
    xscale = width / plot_width
    yscale = height / plot_heigth
    xshift = -xscale * (xs[0] + xs[1]) / 2 + width/2
    yshift = -yscale * (ys[0] + ys[1]) / 2 + height/2

    time += 0.3

    for(var x = xs[0]; x < xs[1]; x+=xs[2]){
        for(var y = ys[0]; y < ys[1]; y+=ys[2]){
            if(showFlow){
                solve(x,y, "blue", 0.2, false)
            } else {
                ctx.beginPath()
                ctx.moveTo(x * xscale + xshift, y * yscale + yshift)
                ctx.lineTo(x * xscale + xshift + 10, y * yscale + yshift + -f_prime(x,y)* 10)
                ctx.stroke()
            }
        }
    }

    solve(mouseX / xscale - xshift/ xscale, -mouseY/yscale + yshift/yscale)
}

function solve(x, y, color = "red", lineWidth = 3, showPoint = true){
    var n_steps = 40/ stepsize
    y = -y
    var startx = x
    var starty = y;
    

    if(showPoint){
        ctx.beginPath();
        ctx.fillStyle = color
        ctx.arc(x * xscale + xshift, y * yscale + yshift, 5, 0, Math.PI * 2)
        ctx.fill();
    }
    
    ctx.beginPath();
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color

    var step = 0;
    do {
        if(step == 0){
            ctx.moveTo(x * xscale + xshift, y * yscale + yshift)
        } else {
            ctx.lineTo(x * xscale + xshift, y * yscale + yshift)
        }

        //NEXT POSTION
        x += stepsize;
        y -= f_prime(x,y) * stepsize;
        if(y > 2000){
            y = 2000
        }
        if(y < -2000){
            y = -2000
        }

        step++;
    } while(step <= n_steps);

    ctx.stroke();


    x = startx;
    y = starty;


    ctx.beginPath();
    ctx.strokeStyle = color

    var step = 0;
    do {
        if(step == 0){
            ctx.moveTo(x * xscale + xshift, y * yscale + yshift)
        } else {
            ctx.lineTo(x * xscale + xshift, y * yscale + yshift)
        }

        //NEXT POSTION
        x -= stepsize;
        y += f_prime(x,y) * stepsize;
        if(y > 2000){
            y = 2000
        }
        if(y < -2000){
            y = -2000
        }

        step++;
    } while(step <= n_steps);

    ctx.stroke();
}
