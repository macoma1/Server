module.exports = (err, req, res, next) => {
    console.error(err.stack);
    console.log("hola");
    res.status(500).send('Something went WRONG!');
};
