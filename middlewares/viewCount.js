let count = 0;

module.exports = viewCount = (req, res, next) => {
    count++;
    console.log(count);

    // res.send("tools found");
    next();
};
