const validate = (req,res,next) => {
    let num = [1,2,3,4,5,6,7,8,9,0];
    let char = ["!", "~", "`", "@", "#", "$", "%", "^", "&", "*", "(", ")", "[", "]", ".", ",", "<", ">", "'", ":", ";", "{", "}", "|", "/"];
    let city = req.body.city;
    city = city.split("");
    for(let i=0; i<city.length; i++) {
        if(num.includes(city[i]) || char.includes(city[i])) {
            res.send({msg: "Incorrect input"});
        }
    }
    next();
}

module.exports = { validate };