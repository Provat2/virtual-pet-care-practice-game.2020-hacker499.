var database, dog, dogimg1, dogimg2;
var foodS;
var feed, add;
var foodObject, feedTime, Lastfeed;
var namingSys;
var nameValue;
var nameGet;

function preload(){
    dogimg1 = loadImage('dogImg.png');
    dogimg2 = loadImage('dogImg1.png');
}

function setup(){
    createCanvas(1000,600);
    database = firebase.database();

    foodObject = new Food();
    dog = createSprite(700, 200, 10, 10);
    dog.addImage(dogimg1);
    dog.scale = 0.3;

    var dogref = database.ref("Food");
    dogref.on('value', readPosition);
    feed = createButton("Feed");
    feed.position(500, 120);
    feed.mousePressed(FeedDog);
    add = createButton("Add food");
    add.position(600, 120);
    add.mousePressed(AddFood);


    namingSys = new Form();
}

function draw(){
    background("green");
    foodObject.display();

    //namingSys.entryName(nameValue);
    namingSys.display();

    fill("black");
    textSize(20);
    text("Use buttons to add and feed the food", 500, 20);

    feedTime = database.ref("FeedTime");
    feedTime.on("value", function(data){
        Lastfeed = data.val();
    })

    if (Lastfeed > 12){
        text("Last Feed: " + Lastfeed%12 + "PM", 150, 30);
    }
    else if(Lastfeed === 0){
        text("Last Feed: 12 PM", 150, 30); 
    }
    else{
        text("Last Feed: " + Lastfeed + "AM", 150, 30);
    }

    drawSprites();
}

function readPosition(data){
    foodS = data.val();
    foodObject.updateFoodStock(foodS);
}

function writePosition(n){
    if(n > 0){
        n -= 1;
    }
    else{
        n = 0;
    }
    database.ref('/').set({
        'Food': n
    });
}

function AddFood(){
    foodS++;
    database.ref('/').update({
        Food: foodS
    });
}

function FeedDog(){
    dog.addImage(dogimg2);
    foodObject.updateFoodStock(foodObject.getFoodStock() - 1)
    database.ref('/').update({
        Food: foodObject.getFoodStock(),
        FeedTime: hour()
    });
}